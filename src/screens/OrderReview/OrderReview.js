import React, { useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, Image, ToastAndroid } from 'react-native'
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { TextInput, Switch, Divider  } from 'react-native-paper'
import { appColors } from '../../common/variables'
import { useAppContext } from '../../context/StateProvider'
import { Entypo } from '@expo/vector-icons';
import { socketIO } from '../../common/socketIO'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCartTotal } from '../../context/reducer'
import { currencyFormat } from '../../common/appFuncs'

const OrderReview = ({navigation}) => {
    const [{cart}, dispatch] = useAppContext()
    const [commentEnabled, setCommentEnabled] = useState(false);
    const [guestCount, setGuestCount] = useState(null)
    const [comment, setComment] = useState('')

    useLayoutEffect(() => {
        // socketIO.on('confirm_order_event', (data) => {
        //     navigation.navigate('Home')         
        // })       
    }, [])

    const cleanUpFunction = async() => {
        return new Promise((resolve, reject) => {
            setGuestCount(null)
            setComment('')
            setCommentEnabled(false)
            dispatch({
                type: 'clearCart'
            })
            resolve()
        })
    }

    const onToggleSwitch = () => setCommentEnabled(!commentEnabled)

    const handleAddToCart = (item) => {
        dispatch({
            type: 'addToCart',
            payload: {...item, count: 1}
        })
    }

    const handleRemoveFromCart = (item) => {
        dispatch({
            type: 'removeFromCart',
            payload: item._id
        })
    }

    const handleItemCount = (id) => {
        const i = cart.findIndex((item) => item._id === id)
        
        if(i > -1) {
            return cart[i].count
        } 

        return 0
    }

    const handleCreateOrder = async() => {
        const tableNum = await AsyncStorage.getItem('tableNum')
        const userId = await AsyncStorage.getItem('userId')
        const newCart = cart.map((item) => {
            return {item: item._id, count: item.count}
        })

        if(guestCount) {
            const order = {
                tableNum,
                status: 'accepted',
                userId,
                guestCount,
                comment,
                foodList: newCart,
            }
            
            socketIO.emit('createOrder', JSON.stringify(order))
            cleanUpFunction()
            return navigation.navigate('Home')
        }

        ToastAndroid.show('Введите количество гостей!', ToastAndroid.SHORT)
    }

    return (
        cart.length ?
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={styles.container}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <ScrollView style={{paddingVertical: 2}}>
                        <View style={styles.foodList}>
                            <ScrollView>
                                {
                                    cart.map((item) => (
                                        <View style={styles.foodListItem} key={item._id}>
                                            <Text>{item.title}</Text> 
                                            <View style={styles.countView}>
                                                <TouchableOpacity onPress={() => handleRemoveFromCart(item)}>
                                                    <Entypo name="minus" size={26} color={appColors.primary} />
                                                </TouchableOpacity>
                                                <Text style={{fontSize: 20}}>{handleItemCount(item._id)}</Text>
                                                <TouchableOpacity onPress={() => handleAddToCart(item)}>
                                                    <Entypo name="plus" size={26} color={appColors.primary} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                        </View>
                        <View style={styles.feedbackView}>
                            <TextInput
                                label='Количество гостей'
                                keyboardType='number-pad'
                                mode='outlined'
                                theme={{ colors: { primary: appColors.secondary, underlineColor: 'transparent',}}}
                                style={{marginBottom: 10}}
                                value={guestCount}
                                onChangeText={(value) => setGuestCount(value)}
                            />
                            <TextInput 
                                label='Комментарий...'
                                mode='outlined'
                                theme={{ colors: { primary: appColors.secondary, underlineColor: 'transparent',}}}
                                disabled={!commentEnabled}
                                multiline={true}
                                numberOfLines={4}
                                style={{marginBottom: 10}}
                                value={comment}
                                onChangeText={(value) => setComment(value)}
                            />
                            <View style={styles.switchView}>
                                <Text style={{marginRight: 20}}>Комментарий</Text>
                                <Switch value={commentEnabled} onValueChange={onToggleSwitch} color={appColors.secondary} />
                            </View>
                        </View>
                        <Divider />
                        <View style={styles.priceView}>
                            <Text style={{fontSize: 20}}>Общая сумма:  </Text>
                            <Text style={{fontSize: 20, fontWeight: '700'}}>{currencyFormat(getCartTotal(cart))} сум</Text>
                        </View>
                        <View style={styles.submitView}>
                            <TouchableOpacity style={styles.submitTouchable} onPress={handleCreateOrder}>
                                <Text style={{fontSize: 20, color: 'white'}}>Создать</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        :  
        <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Image
                source={require('./img/empty.png')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    foodList: {
        height: 300,
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 5,
    },
    foodListItem: {
        height: 50,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    countView: {
        width: 140,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    feedbackView: {
        paddingVertical: 10
    },
    switchView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    priceView: {
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 25
    },
    submitView: {
        height: 50,
        width: '100%',
        backgroundColor: appColors.secondary,
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 5
    },
    submitTouchable: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default OrderReview
