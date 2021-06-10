import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {useState} from 'react'
import { Modal, StyleSheet, ToastAndroid } from 'react-native'
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { appColors } from '../../common/variables'
import { useNavigation } from '@react-navigation/native';

const TablesModal = ({modalVisible, setModalVisible}) => {
    const navigation = useNavigation()
    const [tableNum, setTableNum] = useState('')
    const [error, setError] = useState(false)

    const handleOkButton = () => {  
        if(tableNum.length) {
            setError(false)
            AsyncStorage.setItem('tableNum', tableNum)
            .then(() => {
                navigation.navigate('FoodCategories')
                setModalVisible(false)
                setTableNum('')
            })
            .catch((err) => console.log('Oops, error!' + err))
            return null;
        } 
        setError(true)

        ToastAndroid.showWithGravity('Введите номер стола!', ToastAndroid.SHORT, ToastAndroid.CENTER);
    }

    return (
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType='fade'
        >
            <View style={styles.modalView}>
                <View style={styles.modalViewCenter}>
                    <TextInput
                        label='Номер стола'
                        mode='outlined'
                        style={{backgroundColor: 'white', borderColor: appColors.secondary}}
                        selectionColor={appColors.tertiary}
                        theme={{ colors: { primary: appColors.secondary, underlineColor: 'transparent',}}}
                        keyboardType='number-pad'
                        error={error}
                        value={tableNum}
                        onChangeText={(value) => setTableNum(value)}
                    />
                    <View style={styles.buttonView}>
                        <Button 
                            icon="cancel" 
                            color='red'
                            mode="outlined" 
                            style={{borderColor: 'red'}}
                            onPress={() => {
                                setModalVisible(false)
                                setError(false)
                            }}
                        >
                            Отмена
                        </Button>
                        <Button 
                            icon="check" 
                            mode="contained" 
                            style={{backgroundColor: appColors.secondary}}
                            onPress={handleOkButton}
                        >
                            Создать
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalViewCenter: {
        width: 300,
        height: 170,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    buttonView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default TablesModal
