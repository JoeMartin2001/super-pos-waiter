import React, { useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { useFetch } from '../../hooks/useFetch'
import { ListItem, Avatar } from 'react-native-elements'
import {appColors, base_url} from '../../common/variables'
import { ActivityIndicator } from 'react-native'

const TableInfoScreen = ({navigation, route}) => {
    const [tableInfo, setTableInfo] = useState(null)
    const [loading, error, request, clearError] = useFetch()

    useLayoutEffect(() => {
        const ubsubscribe = navigation.addListener('focus', async() => {
            const data = await request(`api/table/getTableById/${route.params.id}`)
            setTableInfo(data)
        })

        return ubsubscribe
    }, [])

    const renderInfo = () => {
        if(error) {
            return (
                <View style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Что-то пошл</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <View style={styles.foodListView}>
                    <FlatList 
                        data={tableInfo.foodList}
                        renderItem={({item}) => (
                            <ListItem key={item._id} bottomDivider>
                                <Avatar source={{uri: base_url + item.item.imgPath}} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.item.title} x {item.count}</ListItem.Title>
                                    <ListItem.Subtitle>{item.item.price} сум</ListItem.Subtitle>
                                </ListItem.Content>
                                {/* <ListItem.Title></ListItem.Title> */}
                            </ListItem>
                        )}
                        keyExtractor={(item) => item._id}
                    />
                </View>
                <View style={styles.commentView}>
                    <ScrollView>
                        <View style={styles.commentViewItem}>
                            <Text>Кол-во гостей: </Text>
                            <Text>{tableInfo.guestCount}</Text>
                        </View>
                        <View style={styles.commentViewItem}>
                            <Text>Кол-во блюд: </Text>
                            <Text>{tableInfo.foodList.length}</Text>
                        </View>
                        <View style={tableInfo.comment ? styles.commentViewTextItem : styles.commentViewItem}>
                            <Text>Коммент: </Text>
                            <Text>{tableInfo.comment ? tableInfo.comment : 'Нет'}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }

    return (
        tableInfo ? renderInfo() : (
            <View style={styles.spinner_container}>
                <ActivityIndicator size="large" color={appColors.primary} />
            </View>
        ) 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    foodListView: {
        flex: 1,
    },  
    commentView: {
        height: 150,
        width: '100%',
        backgroundColor: appColors.transparent,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
    },
    commentViewItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        paddingHorizontal: 15,
        paddingVertical: 2
    },
    commentViewTextItem: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginVertical: 8,
        paddingHorizontal: 15,
        paddingVertical: 2
    },
    spinner_container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default TableInfoScreen
