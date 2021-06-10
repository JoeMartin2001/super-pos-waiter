import AsyncStorage from "@react-native-async-storage/async-storage"
import { socketIO } from "../common/socketIO"

export const initialState = {
    cart: [],
    chat: [],
    userId: null,
}

export const getCartTotal = (cart) => cart?.reduce((total, item) => total + parseInt(item.price) * parseInt(item.count), 0)

export const reducer = (state, action) => {
    switch (action.type) {
        case 'addToCart':
            const i = state.cart.findIndex((item) => item._id === action.payload._id)

            if(i > -1) {
                const newCart = state.cart
                newCart[i].count++

                return {
                    ...state, 
                    cart: newCart
                }
            }

            return {
                ...state,
                cart: [...state.cart, action.payload]
            }
        case 'removeFromCart':
            const index = state.cart.findIndex((item) => item._id === action.payload)

            if(index > -1) {
                if(state.cart[index].count > 1) {
                    const newCart = state.cart
                    newCart[index].count--

                    return {
                        ...state,
                        cart: newCart
                    }
                } else {
                    const newCart = state.cart
                    newCart.splice(index, 1)

                    return {
                        ...state,
                        cart: newCart
                    }
                }
            }
        case 'clearCart':
            return {
                ...state,
                cart: []
            }
        case 'loginUser': 
            AsyncStorage.setItem('userId', action.payload)
            .then(() => {
                const user = {userId: action.payload, socketId: socketIO.id}
                console.log(user)
                socketIO.emit('new_user', JSON.stringify(user))
            })
            .catch((_) => console.log(_))

            return {
                ...state,
                userId: action.payload
            }
        case 'logoutUser': 
            AsyncStorage.removeItem('userId')
            .then((result) => {
                console.log('User has been removed! ' + state.userId)
            })
            .catch((err) => console.log(err))
            return {
                ...state,
                userId: null
            }
        case 'addMessage': 
            return {
                ...state,
                chat: [...state.chat, action.payload]
            }
        case 'GET_LATEST_CHATS': 
            return {
                ...state,
                chat: action.payload
            }
        default:
            return state
    }
}
