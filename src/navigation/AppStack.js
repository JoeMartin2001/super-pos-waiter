import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { appColors } from '../common/variables';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import TableInfoScreen from '../screens/TableInfoScreen/TableInfoScreen';
import FoodCategories from '../screens/FoodCategories/FoodCategories';
import { View, Text } from 'react-native';
import OrderReview from '../screens/OrderReview/OrderReview';
import { useAppContext } from '../context/StateProvider';
import { Entypo } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import Tables from '../screens/HomeScreen/Tables';
import { socketIO } from '../common/socketIO';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});  

const Stack = createStackNavigator();

const AppStack = () => {
    const [{userId, cart}, dispatch] = useAppContext()

    useEffect(() => {
        async function showNotification(msg) {
            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Новое уведомление!",
                  body: msg,
                },
                trigger: null,
            })

            await Notifications.cancelScheduledNotificationAsync(identifier);
        }

        socketIO.on('new_order_finished', (data) => showNotification(data))
        socketIO.on('get_message', async(data) => {
            const userId = await AsyncStorage.getItem('userId')
            if(data.user._id !== userId) {
                showNotification(data.msg)
            }
        })

        return () => {
            socketIO.off('new_order_finished', (data) => showNotification(data))
            socketIO.off('get_message', () => showNotification('Новое сообщение!'))
        }
    }, [])

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
                name="Home" 
                component={Tables} 
                options={({navigation}) => ({
                    title: 'Главное меню',
                    headerRight: () => (
                        <Menu>
                            <MenuTrigger style={{marginRight: 5, padding: 7}}>
                                <Entypo name="dots-three-vertical" size={20} color="white" />   
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption 
                                    style={{paddingVertical: 12, paddingHorizontal: 10}} 
                                    onSelect={() => navigation.navigate('Chat')}
                                >
                                    <Text style={{fontSize: 16}}>Чат</Text>
                                </MenuOption>
                                <MenuOption 
                                    style={{paddingVertical: 12, paddingHorizontal: 10}} 
                                    onSelect={() => dispatch({type: 'logoutUser'})}
                                >
                                    <Text style={{fontSize: 16}}>Выйти</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    )
                })}
            />
            <Stack.Screen 
                name="TableInfo" 
                component={TableInfoScreen} 
                options={({}) => ({
                    title: 'О столе',
                })}
            />
            <Stack.Screen 
                name="FoodCategories" 
                component={FoodCategories} 
                options={({navigation}) => ({
                    title: 'Создание заказа',
                    headerStyle: {
                        elevation: 0,
                        shadowOpacity: 0,
                        backgroundColor: appColors.primary,
                    },
                    headerRight: () => (
                        <TouchableOpacity
                            style={{
                                marginRight: 5, 
                                width: 40, 
                                height: 40, 
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => navigation.navigate('OrderReview')}
                        >
                            <View style={{
                                position: 'absolute', 
                                top: 0, right: 0, 
                                backgroundColor: 'red', 
                                height: 20, 
                                width: 20,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                                zIndex: 2,
                                overflow: 'hidden'
                            }}>
                                <Text style={{color: 'white', fontSize: 12}}>{cart.length}</Text>
                            </View>
                            <MaterialIcons name="shopping-bag" size={30} color="white" />
                        </TouchableOpacity>
                    )
                })}
            />
            <Stack.Screen 
                name="OrderReview" 
                component={OrderReview} 
                options={({}) => ({
                    title: 'Просмотр стола',
                })}
            />
            <Stack.Screen 
                name="Chat" 
                component={ChatScreen} 
                options={({}) => ({
                    title: 'Просмотр стола',
                })}
            />
        </Stack.Navigator>
    )
}

export default AppStack
