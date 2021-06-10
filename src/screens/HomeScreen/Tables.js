import React, {useState, useLayoutEffect} from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { useFetch } from '../../hooks/useFetch';
import { appColors } from '../../common/variables';
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import TablesModal from './TablesModal';
import { socketIO } from '../../common/socketIO';

const Tables = ({navigation}) => {
    const [tables, setTables] = useState([])
    const [loading, error, request, clearError] = useFetch()
    const [modalVisible, setModalVisible] = useState(false)

    useLayoutEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchTables()
        })  

        socketIO.on('new_order_accepted', () => fetchTables())
        socketIO.on('order_closed', () => fetchTables())

        socketIO.on('new_order_finished', async() => {
            fetchTables()
        })

        return () => {
            socketIO.off('new_order_accepted', () => fetchTables())
            socketIO.off('order_closed', () => fetchTables())

            socketIO.off('new_order_finished', async() => {
                fetchTables()
            })
            unsubscribe()
        }
    }, [])

    const fetchTables = async() => {
        try {
            const data = await request('api/table/getAllTables')
            setTables(data)

            if(error) {
                console.log(error)
                clearError()
            }
        } catch (_) {
            console.log(_)
        }
    }

    const handleCircleColor = (status) => {
        switch (status) {
            case 'pending':
                return 'orange'
            case 'finished':
                return 'green'
            case 'closed':
                return 'grey'
            default:
                return appColors.primary;
        }
    }

    const handleTableList = () => {
        return tables.length ? (
            <FlatList
                data={tables}
                renderItem={({item}) => (
                    <View style={styles.tableItemContainer}>
                        <View style={styles.tableItemView}>
                            <TouchableOpacity 
                                style={{...styles.tableItemTouchable, borderColor: handleCircleColor(item.status)}} 
                                onPress={() => navigation.navigate('TableInfo', {id: item._id})}
                            >
                                <Text style={{fontSize: 25, color: handleCircleColor(item.status)}}>{item.tableNum}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item._id}
                numColumns={4}
            />
        ) : 
        (
            <View style={styles.empty_cart_view}>
                <Image
                    style={styles.emptyCart}
                    source={require('./img/empty.png')}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                !loading ? 
                    handleTableList() 
                    : 
                    (
                        <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator color={appColors.primary} size='large' />
                        </View>
                    )
            }

            <FAB
                style={styles.fab}
                icon={() => <AntDesign name="plus" size={24} color="white" />}
                onPress={() => setModalVisible(true)}
            />
            <TablesModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    )
}

const winWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    fab: {
        position: 'absolute',
        margin: 10,
        right: 0,
        bottom: 0,
        color: 'white',
        backgroundColor: '#38b000'
    },
    tableItemContainer: {
        width: winWidth / 4,
        height: winWidth / 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tableItemView: {
        width: '80%',
        height: '80%',
    },
    tableItemTouchable: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 100,
    },
    // tableItemText: {
    //     fontSize: 25,
    //     color: appColors.primary
    // },
    empty_cart_view: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Tables
