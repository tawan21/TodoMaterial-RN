import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux'
import { setTaskID, setTasks } from '../redux/actions'
import GlobalStyle from '../utils/GlobalStyle'
import CheckBox from '@react-native-community/checkbox'

export default function ToDo({ navigation }) {

    const { tasks } = useSelector(state => state.taskReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        getTasks()
    }, [])

    const getTasks = () => {
        AsyncStorage.getItem('Tasks')
            .then(tasks => {
                const parsedTasks = JSON.parse(tasks)
                if (parsedTasks && typeof parsedTasks === 'object')
                    dispatch(setTasks(parsedTasks))
            })
            .catch(err => console.log(err))
    }

    const deleteTask = (id) => {
        const filteredTasks = tasks.filter(task => task.ID !== id)
        AsyncStorage.setItem('Tasks', JSON.stringify(filteredTasks))
            .then(() => {
                dispatch(setTasks(filteredTasks))
                ToastAndroid.show("Task removed successfully", ToastAndroid.LONG)
            })
            .catch(err => console.log(err))
    }

    const checkTask = (id, newValue) => {
        const index = tasks.findIndex(task => task.ID === id)
        if (index > -1) {
            let newTasks = [...tasks]
            newTasks[index].Done = newValue
            AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
                .then(() => {
                    dispatch(setTasks(newTasks))
                    ToastAndroid.show("Task state changed", ToastAndroid.SHORT)
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <View style={styles.body}>
            <FlatList
                data={tasks.filter(task => task.Done === false)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                            dispatch(setTaskID(item.ID))
                            navigation.navigate('Task')
                        }}
                    >
                        <View style={styles.item_row}>
                            <View
                                style={[
                                    {
                                        backgroundColor:
                                            item.Color === 'red' ? '#ef5350' :
                                                item.Color === 'blue' ? '#42a5f5' :
                                                    item.Color === 'green' ? '#66bb6a' : '#ffffff'
                                    },
                                    styles.color
                                ]}
                            />
                            <CheckBox
                                value={item.Done}
                                onValueChange={newValue => { checkTask(item.ID, newValue) }}
                            />
                            <View style={styles.item_body}>
                                <Text style={
                                    styles.title
                                }
                                    numberOfLines={1}
                                >
                                    {item.Title}
                                </Text>
                                <Text style={[
                                    GlobalStyle.CustomFontTask,
                                    styles.subtitle
                                ]}
                                    numberOfLines={1}
                                >
                                    {item.Desc}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.delete}
                                onPress={() => { deleteTask(item.ID) }}
                            >
                                <FontAwesome5
                                    name={'trash'}
                                    size={22}
                                    color={'#d50000'}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    dispatch(setTaskID(tasks.length + 1))
                    navigation.navigate('Task')
                }}
            >
                <FontAwesome5
                    name={'plus'}
                    size={20}
                    color={'#ffffff'}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6200ee',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 16,
        right: 16,
        elevation: 5
    },
    item_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    item_body: {
        flex: 1
    },
    delete: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        marginHorizontal: 10,
        marginVertical: 7,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5
    },
    title: {
        color: '#000000',
        fontSize: 30,
        margin: 5,
        fontFamily: 'Ubuntu-Regular'
    },
    subtitle: {
        color: '#616161',
        fontSize: 20,
        margin: 5
    },
    color: {
        width: 20,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    }
})