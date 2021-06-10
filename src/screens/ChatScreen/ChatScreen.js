import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { appColors } from '../../common/variables';
import { socketIO } from '../../common/socketIO';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import { useFetch } from '../../hooks/useFetch';
import { ActivityIndicator } from 'react-native';
import { useAppContext } from '../../context/StateProvider';

const ChatScreen = ({navigation}) => {
    const [loading, error, request, clearError] = useFetch()
    const [{chat}, dispatch] = useAppContext()
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(null)
    const scrollViewRef = useRef()

    useEffect(() => {
        const ubsub = navigation.addListener('focus', fetchLatestMessages)

        async function fetchLatestMessages() {
            try {
                const data = await request(`api/chat/getLatestChats`)

                dispatch({
                    type: 'GET_LATEST_CHATS',
                    payload: [...data].reverse()
                })
            } catch (e) {
                console.log(e.message)
                clearError()
            }
        }
        
        return ubsub
    }, [])

    useEffect(() => {
        handleUserId()

        async function handleUserId() {
            const userId = await AsyncStorage.getItem('userId')
            setUserId(userId)
        }
        
        socketIO.on('get_message', handleAddMessage)

        return () => {
            socketIO.off('get_message', handleAddMessage)
        }

    }, [])


    const handleAddMessage = (data) => {
        dispatch({
            type: 'addMessage',
            payload: data
        })
    }

    const handleSendMessage = async() => {
        socketIO.emit('send_message', {msg: text, id: userId})
        setText('')
    }

    const renderChatList = (item) => {
        const isFriend = () => item.user._id === userId

        return (
            <View style={{...styles.messageView, flexDirection: !isFriend() ? 'row-reverse': 'row'}} key={item._id}>
                <View style={styles.avatarView}>
                    <FontAwesome name="user-circle" size={30} color="grey" />
                </View>
                <View style={{
                    ...styles.messageItemView, 
                    backgroundColor: isFriend() ? appColors.transparent: appColors.secondary
                }}>
                    <Text style={{color: isFriend() ? 'grey' : 'grey'}}>{item.user.name}</Text>
                    <Text style={{color: isFriend() ? 'black' : 'white'}}>{item.msg}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                {
                    chat.length ? (
                        <ScrollView 
                            ref={scrollViewRef}
                            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        >
                            {chat.map((item) => renderChatList(item))}
                        </ScrollView>
                    ) : (
                        <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator color={appColors.primary} size='large' />
                        </View>
                    )
                }

            </View>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder='Сообщение' 
                    style={styles.messageInput} 
                    value={text}
                    onChangeText={(value) => setText(value)}
                />
                <TouchableOpacity onPress={handleSendMessage} style={{padding: 5}}>
                    <Ionicons name="send" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    messageView: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    avatarView: {
        paddingHorizontal: 5,
        display: 'flex',
        alignItems: 'center'
    },
    messageItemView: {
        maxWidth: '70%',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    inputContainer: {
        height: 60,
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'lightgrey'
    },
    messageInput: {
        height: '100%',
        flex: 1,
        fontSize: 18,
    }
})

export default ChatScreen
