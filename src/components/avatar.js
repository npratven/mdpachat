import React, { Component } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, SIZES } from '@lib/theme';

class Avatar extends Component {
    static propTypes = {
        border: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired,
        source: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { border, size, source } = this.props;
        const extraStylesAvatar = {
            borderRadius: Math.floor(size / 2),
            borderWidth: border,
            height: size,
            width: size
        };
        if (source) {
            avatar = <Image style={[styles.avatar, extraStylesAvatar]} source={{ uri: source }}/>;
        } else {
            avatar = <View style={[styles.iconContainer, extraStylesAvatar]}>
                <Icon 
                name={'logo-freebsd-devil'}
                size={size * 0.8}
                color={COLORS.lightBackground}
                />
            </View>;
        }

        return (
            <View style={styles.container}>
                {avatar}
            </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        justifyContent: 'center',
        backgroundColor: COLORS.avatarBackgroundColor,
        borderColor: COLORS.primary,
        position: 'absolute',
        top: 0,
        left: 0
    },
    iconContainer: {
       backgroundColor: 'transparent',
       justifyContent: 'center',
       borderColor: COLORS.primary,
       position: 'absolute',
       top: 0,
       left: 0
    }

});
export { Avatar };
