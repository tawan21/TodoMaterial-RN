import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import PushNotification from "react-native-push-notification";

export default function Splash({ navigation }) {

    useEffect(() => {
        createChannels();
        setTimeout(() => {
            navigation.replace('My Tasks')
        }, 1250);
    }, []);

    const createChannels = () => {
        PushNotification.createChannel(
            {
                channelId: "task-channel",
                channelName: "Task Channel"
            }
        )
    }

    return (
        <View style={styles.body} >
            <Image
                style={styles.logo}
                source={require('../../assets/checklist.png')}
            />
            <Text style={
                styles.text}>
                To-Do List
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3700b3',
    },
    logo: {
        height: 150,
        width: 160,
        margin: 20
    },
    text: {
        fontSize: 40,
        fontFamily: 'JosefinSans-Regular',
        color: '#ffffff'
    }
})