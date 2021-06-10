import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { appColors } from '../common/variables';
import LoginScreen from '../screens/LoginScreen/LoginScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={({}) => ({
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: appColors.primary
                }
            })}
        >
            <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={({}) => ({
                    headerShown: false
                })}
            />
        </Stack.Navigator>
    )
}

export default AuthStack
