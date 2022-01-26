import React, { useState, useEffect } from 'react'
import { ToastAndroid, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setTasks } from '../redux/actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Checkbox from '@react-native-community/checkbox'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import PushNotification from 'react-native-push-notification'
import RNFS from 'react-native-fs'
import Dialog from 'react-native-dialog'
import { Appearance } from 'react-native'
import { useTheme } from '@react-navigation/native'

export default function Task({ navigation }) {

    const { tasks, taskID } = useSelector(state => state.taskReducer)
    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [done, setDone] = useState(false)
    const [bellModal, showBellModal] = useState(false)
    const [color, setColor] = useState('white')
    const [bellTime, setBellTime] = useState('1')
    const [image, setImage] = useState('')

    useEffect(() => {
        navigation.addListener('focus', () => {
            getTask();
        })
    }, [])

    const theme = Appearance.getColorScheme()

    const getTask = () => {
        const Task = tasks.find(task => task.ID === taskID)
        if (Task) {
            setTitle(Task.Title)
            setDesc(Task.Desc)
            setDone(Task.Done)
            setColor(Task.Color)
            setImage(Task.Image)
        }
    }

    const setTask = () => {
        if (title.length === 0)
            ToastAndroid.show("Please enter your task's title", ToastAndroid.LONG)
        else {
            try {
                const Task = {
                    ID: taskID,
                    Title: title,
                    Desc: desc,
                    Done: done,
                    Color: color,
                    Image: image
                }
                const index = tasks.findIndex(task => task.ID === taskID)
                let newTasks = []
                if (index > -1) {
                    newTasks = [...tasks]
                    newTasks[index] = Task
                }
                else
                    newTasks = [...tasks, Task]
                AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
                    .then(() => {
                        dispatch(setTasks(newTasks))
                        ToastAndroid.show("Task saved successfully", ToastAndroid.SHORT)
                        navigation.goBack()
                    })
                    .catch(err => console.log(err))
            } catch (error) {
                console.log(error);
            }
        }
    }

    const setTaskAlarm = () => {
        PushNotification.localNotificationSchedule({
            channelId: 'task-channel',
            title: title,
            message: desc,
            date: new Date(Date.now() + parseInt(bellTime * 60 * 1000)),
            allowWhileIdle: true
        })
    }

    const deleteImage = () => {
        RNFS.unlink(image)
            .then(() => {
                const index = tasks.findIndex(task => task.ID === taskID)
                if (index > -1) {
                    let newTasks = [...tasks]
                    newTasks[index].Image = ''
                    AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
                        .then(() => {
                            dispatch(setTasks(newTasks))
                            getTask()
                            ToastAndroid.show("Task image removed", ToastAndroid.SHORT)
                        })
                        .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
    }

    const { colors } = useTheme()

    return (
        <ScrollView>
            <View style={styles.body}>
                <Dialog.Container
                    visible={bellModal}
                    onRequestClose={() => showBellModal(false)}
                    onBackdropPress={() => showBellModal(false)}
                >
                    <Dialog.Title>
                        Set Notification
                    </Dialog.Title>
                    <Dialog.Description>
                        Reminder after
                    </Dialog.Description>
                    <Dialog.Input
                        label='Time in Minutes'
                        onChangeText={value => setBellTime(value)}
                        keyboardType='numeric'
                        value={bellTime}
                    />
                    <Dialog.Button
                        label='OK'
                        onPress={() => {
                            showBellModal(false)
                            setTaskAlarm()
                            ToastAndroid.show("Task reminder set", ToastAndroid.SHORT)
                        }}
                    />
                </Dialog.Container>
                <TextInput
                    value={title}
                    style={[styles.input, { backgroundColor: colors.card }]}
                    placeholder='Title'
                    onChangeText={value => setTitle(value)}
                />
                <TextInput
                    value={desc}
                    style={[styles.input, { backgroundColor: colors.card }]}
                    placeholder='Description'
                    multiline
                    onChangeText={value => setDesc(value)}
                />
                <View style={styles.color_bar}>
                    <TouchableOpacity
                        style={styles.color_white}
                        onPress={() => { setColor('white') }}
                    >
                        {
                            color === 'white' &&
                            <FontAwesome5
                                name={'check'}
                                size={25}
                                color={'#000000'}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.color_red}
                        onPress={() => { setColor('red') }}
                    >
                        {
                            color === 'red' &&
                            <FontAwesome5
                                name={'check'}
                                size={25}
                                color={'#000000'}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.color_blue}
                        onPress={() => { setColor('blue') }}
                    >
                        {
                            color === 'blue' &&
                            <FontAwesome5
                                name={'check'}
                                size={25}
                                color={'#000000'}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.color_green}
                        onPress={() => { setColor('green') }}
                    >
                        {
                            color === 'green' &&
                            <FontAwesome5
                                name={'check'}
                                size={25}
                                color={'#000000'}
                            />
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.extra_row}>
                    <TouchableOpacity
                        style={[styles.extra_button, { backgroundColor: colors.primary }]}
                        onPress={() => { showBellModal(true) }}
                    >
                        <FontAwesome5
                            name={'bell'}
                            size={25}
                            color={colors.background}
                            solid
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.extra_button, { backgroundColor: colors.primary }]}
                        onPress={() => {
                            if (tasks.findIndex(task => task.ID === taskID) === -1)
                                ToastAndroid.show("Save the Task to attach an image", ToastAndroid.LONG)
                            else
                                navigation.navigate('Camera', { id: taskID })
                        }}
                    >
                        <FontAwesome5
                            name={'camera'}
                            size={25}
                            color={colors.background}
                        />
                    </TouchableOpacity>
                </View>
                {image ?
                    <View>
                        <Image
                            style={styles.image}
                            source={{ uri: image }}
                        />
                        <TouchableOpacity
                            style={styles.delete}
                            onPress={() => { deleteImage() }}
                        >
                            <FontAwesome5
                                name={'trash'}
                                size={25}
                                color={'#d50000'}
                            />
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
                <View style={styles.checkbox}>
                    <Checkbox
                        value={done}
                        onValueChange={newValue => setDone(newValue)}
                    />
                    <Text style={[styles.text, { color: colors.text }]}>
                        task complete
                    </Text>
                </View>
                <View style={styles.extra_row}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setTask()
                        }}
                    >
                        <FontAwesome5
                            name={'save'}
                            size={30}
                            color={colors.background}
                            solid
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    checkbox: {
        flexDirection: 'row',
        margin: 10
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#888888',
        borderRadius: 5,
        textAlign: 'left',
        fontSize: 20,
        margin: 10,
        paddingHorizontal: 10
    },
    button: {
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#43a047',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    text: {
        fontSize: 20
    },
    color_bar: {
        flexDirection: 'row',
        height: 50,
        marginVertical: 10
    },
    color_white: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 5,
        marginHorizontal: 5
    },
    color_red: {
        flex: 1,
        backgroundColor: '#ef5350',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 5,
        marginHorizontal: 5
    },
    color_blue: {
        flex: 1,
        backgroundColor: '#42a5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 5,
        marginHorizontal: 5
    },
    color_green: {
        flex: 1,
        backgroundColor: '#66bb6a',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 5,
        marginHorizontal: 5
    },
    extra_row: {
        flexDirection: 'row',
        marginVertical: 10
    },
    extra_button: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 300,
        height: 300,
        margin: 20,
    },
    delete: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#ffffff80',
        margin: 10,
        borderRadius: 5
    }
})