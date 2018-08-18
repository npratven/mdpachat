import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Autolink from 'react-native-autolink';

import ImagePicker from 'react-native-image-picker';

import { COLORS } from '@lib/theme';
import { sendTextMessage, sendPhotoMessage } from '@lib/api';

import { observer } from 'mobx-react/native';
import { SIZES } from '../lib/theme';

import currentUserStore from '@stores/user';
import messagesStore from '@stores/messages';
import membersStore from '@stores/members';
import { Avatar } from '@components/avatar';

@observer
class Chat extends Component {
    state = {
        newMessage: null
    };

    sendMessage = () => {
        sendTextMessage({
            text: this.state.newMessage,
            userId: currentUserStore.data.userId
        });
        this.setState({ newMessage: null });
    };

    onCameraPressed() {
        const options = {
            title: 'Select Image',
            quality: 0.7,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                const filename = response.fileName || '.JPG';
                const newImage = {
                    uri: response.uri,
                    filename
                };

                sendPhotoMessage({
                    image: newImage,
                    userId: currentUserStore.data.userId
                });
            }
        });
    };

    render() {
        const behavior = Platform.OS === 'ios' ? 'padding' : null;
        // behaviour: we need to scroll the view up so it doesn't render under the keyboard on ios;
        // https://facebook.github.io/react-native/docs/keyboardavoidingview.html#behavior

        //keyboardVerticalOffset: we need to compensate for the navigation bar height or the input will render
        // under the keyboard https://facebook.github.io/react-native/docs/keyboardavoidingview.html#keyboardverticaloffset

        return (
            <KeyboardAvoidingView style={styles.container} behavior={behavior} keyboardVerticalOffset={65}>
                <FlatList
                    style={styles.flatList}
                    data={messagesStore.data}
                    keyExtractor={(item, idx) => {
                        return `messageItem_${idx}`;
                    }}
                    renderItem={({ item }) => {
                        const user = membersStore.data[item.userId];

                        let userPhoto = '';

                        if (user && user.photo && user.photo !== '') {
                            userPhoto = user.photo;
                        }

                        const isOwnMessage = item.userId === currentUserStore.data.userId;

                        return (
                            <View style={[styles.listItem, isOwnMessage ? styles.ownItem : styles.othersItem]}>
                                <View style={styles.userAvatar}>
                                    <Avatar
                                        source={userPhoto}
                                        border={1}
                                        size={26}
                                    />
                                </View>
                                {item.type === 'text' && <Autolink
                                    style={[
                                        styles.message,
                                        isOwnMessage ? styles.ownMessage : styles.othersMessage
                                    ]}
                                    text={`${item.text}`}
                                    hashtag='instagram'
                                    mention='twitter'
                                    linkStyle={styles.link}
                                />}
                                {item.type === 'photo' && (
                                    <View style={[styles.photo, isOwnMessage ? styles.ownPhoto : styles.othersPhoto]}>
                                        <Image style={styles.image} source={{ uri: item.photoUrl }}/>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                    inverted
                    keyboardShouldPersistTaps={'handled'}
                />
                <View style={styles.sendWrapper}>
                        <TouchableOpacity onPress={this.onCameraPressed.bind(this)}>
                        <Icon style={styles.sendButton} name={'ios-images'} size={40} color={COLORS.primary} />
                        </TouchableOpacity>

                    <TextInput
                        style={styles.sendInput}
                        placeholderTextColor={COLORS.lightText}
                        underlineColorAndroid={'transparent'}
                        multiline
                        textAlignVertical={'top'}
                        onChangeText={text => this.setState({ newMessage: text })}
                        value={this.state.newMessage}
                    />
                        <TouchableOpacity onPress={this.sendMessage.bind(this)}>
                            <Icon style={styles.sendButton} name={'ios-send-outline'} size={40} color={COLORS.primary} />
                        </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sendWrapper: {
        height: 70,
        backgroundColor: COLORS.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        bottom: 0
    },
    sendInput: {
        flex: 1,
        height: 60,
        padding: 10,
        backgroundColor: COLORS.screenBackground,
        borderColor: COLORS.lightBackground,
        borderWidth: 1,
        borderRadius: 10
    },
    sendButton: {
        margin: 10
    },
    listItem: {
        backgroundColor: COLORS.screenBackground,
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 5,
        alignItems: 'center'
    },
    ownItem: {
        flexDirection: 'row-reverse'
    },
    othersItem: {
        flexDirection: 'row'
    },
    userAvatar: {
        width: 26,
        height: 26
    },
    message: {
        fontSize: 16,
        color: COLORS.primaryText,
        borderRadius: 10,
        paddingVertical: 3,
        paddingHorizontal: 10,
        overflow: 'hidden'
    },
    ownMessage: {
        marginLeft: 30,
        marginRight: 5,
        backgroundColor: COLORS.primary,
        color: COLORS.lightText
    },
    othersMessage: {
        marginLeft: 5,
        marginRight: 30,
        backgroundColor: COLORS.secondary,
        color: COLORS.darkText
    },
    photo: {
        borderRadius: 10,
        overflow: 'hidden',
        width: SIZES.screenWidth * 0.65,
        height: SIZES.screenWidth * 0.65 * 0.75
    },
    image: {
        width: SIZES.screenWidth * 0.65,
        height: SIZES.screenWidth * 0.65 * 0.75
    },
    ownPhoto: {
        marginLeft: 30,
        marginRight: 5,
        backgroundColor: COLORS.primary
    },
    othersPhoto: {
        marginLeft: 5,
        marginRight: 30,
        backgroundColor: COLORS.secondary
    },

    flatList: {
        backgroundColor: COLORS.screenBackground
    }
});

export default Chat;
