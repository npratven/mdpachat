import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

import { COLORS } from '@lib/theme';

import { observer } from 'mobx-react/native';

import currentUserStore from '@stores/user';
import membersStore from '@stores/members';
import { Avatar } from '@components/avatar';

@observer
class MembersScreen extends Component {
    onUserPress = user => {
        this.props.navigation.navigate('UserProfile', user);
    };

    render() {
        return (
            <FlatList
                style={styles.flatList}
                data={membersStore.dataAsArray} // everytime the data changes we re-render the list
                keyExtractor={(item, idx) => {
                    // The keyExtractor gives us an unique key for the list cells for caching/recycling
                    // https://facebook.github.io/react-native/docs/flatlist.html#keyextractor
                    return `userItem_${idx}`;
                }}
                renderItem={({ item }) => {
                    const isOwnUser = item.userId === currentUserStore.data.uid;

                    return (
                        <TouchableOpacity
                            onPress={() => {
                                this.onUserPress(item);
                            }}
                        >
                            <View style={[styles.listItem, isOwnUser ? styles.ownListItem : styles.otherListItem]}>
                                <Avatar source={item.photo} border={2} size={50}/>
                                <Text style={styles.userName}>{`${item.name}`}</Text>
                                <Text style={styles.userDescription} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {`${item.description || ''}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        height: 70,
        justifyContent: 'center',
        backgroundColor: COLORS.screenBackground
    },
    ownListItem: {
        backgroundColor: COLORS.secondary
    },
    otherListItem: {},
    userName: {
        marginLeft: 70,
        fontWeight: 'bold',
        fontSize: 16,
        color: COLORS.primaryText
    },
    userDescription: {
        marginLeft: 70,
        marginRight: 25,
        fontSize: 14,
        color: COLORS.darkText
    },
    flatList: {
        backgroundColor: COLORS.screenBackground
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.lightBackground
    }
});

export default MembersScreen;
