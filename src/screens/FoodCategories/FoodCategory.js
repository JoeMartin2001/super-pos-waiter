import React, { useLayoutEffect, useState } from 'react'
import { View, Text, ToastAndroid, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { appColors, base_url } from '../../common/variables'
import { useFetch } from '../../hooks/useFetch'
import { Entypo } from '@expo/vector-icons';
import { useAppContext } from '../../context/StateProvider'

const FoodCategory = ({route, navigation}) => {
    const [{cart}, dispatch] = useAppContext()
    const [foodList, setFoodList] = useState([])
    const [loading, error, request, clearError] = useFetch()

    useLayoutEffect(() => {
        fetchFoodList()
        
        async function fetchFoodList() {
            try {
                const data = await request(`api/food/getFoodByCategory/${route.params.category}`)
                setFoodList(data)
    
                if(error) {
                    ToastAndroid.show('Проблема с интернетом или сервером!', ToastAndroid.SHORT)
                    clearError()
                }
            } catch (_) {
                console.log(_)
            }
        }
    }, [])

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

    return (
        <View style={styles.container}>
                {
                    loading ? (
                        <View style={styles.spinner_container}>
                            <ActivityIndicator size="large" color={appColors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={foodList}
                            renderItem={({item}) => (
                                <ListItem key={item._id} bottomDivider>
                                    <Avatar source={{uri: base_url + item.imgPath}} />
                                    <ListItem.Content>
                                        <ListItem.Title>{item.title}</ListItem.Title>
                                        <ListItem.Subtitle>{item.price}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Title>
                                        <View style={styles.countView}>
                                            <TouchableOpacity onPress={() => handleRemoveFromCart(item)}>
                                                <Entypo name="minus" size={26} color={appColors.primary} />
                                            </TouchableOpacity>
                                            <Text style={{fontSize: 20}}>{handleItemCount(item._id)}</Text>
                                            <TouchableOpacity onPress={() => handleAddToCart(item)}>
                                                <Entypo name="plus" size={26} color={appColors.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </ListItem.Title>
                                </ListItem>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    )
                }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    spinner_container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    countView: {
        width: 140,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default FoodCategory
