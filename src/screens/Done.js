import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux'
import { setTaskID, setTasks } from '../redux/actions'
import GlobalStyle from '../utils/GlobalStyle'
import CheckBox from '@react-native-community/checkbox'

export default function Done({ navigation }) {

    const { tasks } = useSelector(state => state.taskReducer)
    const dispatch = useDispatch()

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
                data={tasks.filter(task => task.Done === true)}
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
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1
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
        paddingHorizontal: 10,
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
    }
})