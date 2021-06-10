import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { useAppContext } from '../context/StateProvider';
import SplashScreen from '../screens/SplachScreen/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const AppNavigation = () => {
    const [{userId}, dispatch] = useAppContext()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AsyncStorage.getItem('userId')
            .then(userIdString => {
                if(userIdString) {
                    dispatch({
                        type: 'loginUser',
                        payload: userIdString
                    })
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }, [])

    if(loading) {
        return <SplashScreen />
    }

    return (
        <NavigationContainer>
            {userId ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    )
}

export default AppNavigation
