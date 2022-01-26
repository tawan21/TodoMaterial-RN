import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Splash from './screens/Splash';
import ToDo from './screens/ToDo';
import Done from './screens/Done';
import Camera from './screens/Camera'
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Task from './screens/Task';
import { StatusBar } from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs()

const Tab = createBottomTabNavigator()

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={
        ({ route }) => ({
          tabBarIcon: ({ focused, size, color }) => {
            let iconName
            if (route.name === 'To-Do')
              iconName = 'clipboard-list'
            else
              iconName = 'clipboard-check'
            size = focused ? 25 : 20
            return (
              <FontAwesome5
                name={iconName}
                size={size}
                color={color}
              />
            )
          },
          tabBarActiveTintColor: '#3700b3',
          tabBarInactiveTintColor: '#777777',
          tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' }
        })
      }
    >
      <Tab.Screen name={'To-Do'} component={ToDo} options={{ headerShown: false }} />
      <Tab.Screen name={'Done'} component={Done} options={{ headerShown: false }} />
    </Tab.Navigator>
  )
}

const RootStack = createStackNavigator();

function App() {
  return (
    <Provider store={Store}>
      <StatusBar 
        barStyle = "light-content" 
        hidden = {false} 
        backgroundColor = "#3700b3" 
        translucent = {true}
      />
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#6200ee'
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 25,
              fontFamily: 'JosefinSans-Regular'
            }
          }}
        >
          <RootStack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="My Tasks"
            component={HomeTabs}
          />
          <RootStack.Screen
            name="Task"
            component={Task}
          />
          <RootStack.Screen
            name="Camera"
            component={Camera}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App;