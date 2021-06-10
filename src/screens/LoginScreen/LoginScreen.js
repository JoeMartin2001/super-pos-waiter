import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    View, 
    Platform, 
    StatusBar, 
    Image, 
    KeyboardAvoidingView, 
    Keyboard, 
    ScrollView, 
    TextInput, 
    TouchableNativeFeedback, 
    TouchableWithoutFeedback  
} from 'react-native';
import { appColors } from '../../common/variables';
import { useAppContext } from '../../context/StateProvider';
import { useFetch } from '../../hooks/useFetch';

const LoginScreen = () => {
    const [loading, error, request, clearError] = useFetch()
    const [, dispatch] = useAppContext()
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async() => {
      try {
        const data = await request('api/auth/login', 'POST', {login, password})
        dispatch({
          type: 'loginUser',
          payload: data._id
        })
      } catch (_) {
        ToastAndroid.show(_.message, ToastAndroid.SHORT)
        clearError()
      }
    }

    return (
      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : "height"}
          style={{flex: 1}}>
          <SafeAreaView style={styles.container}>
            <ScrollView style={{paddingVertical:2}}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                  <View style={styles.imageView}>
                      <Image
                          style={styles.chefImg}
                          source={require('./img/waiter.png')}
                      />
                      <Text style={styles.loginTitle}>SPOS Waiter</Text>
                  </View>
                  <TextInput 
                      placeholder="Логин" 
                      style={styles.input} 
                      placeholderTextColor='rgba(255, 255, 255, 0.6)' 
                      value={login}
                      onChangeText={(value) => setLogin(value)}
                  />
                  <TextInput 
                      placeholder="Пароль" 
                      style={styles.input} 
                      placeholderTextColor='rgba(255, 255, 255, 0.6)'
                      secureTextEntry={true}
                      value={password} 
                      onChangeText={(value) => setPassword(value)}
                  />
                  <View style={styles.btnContainer}>
                      <TouchableNativeFeedback onPress={handleLogin}>
                          <View style={styles.buttonViewInside}>
                              <Text style={styles.buttonViewText}>Войти</Text>
                          </View>
                      </TouchableNativeFeedback>
                  </View>
                  <View style={{flex: 1}} />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <StatusBar />
      </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appColors.primary,
    },
    inner: {
      padding: 24,
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom:100,
    },
    header: {
      fontSize: 36,
      marginBottom: 48,
    },
    imageView: {
        height: 450,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25
    },
    chefImg: {
        height: 200,
        width: 200
    },
    loginTitle: {
        color: 'white',
        fontSize: 22,
        marginTop: 45,
        // fontFamily: 'Amsterdam'
    },
    input: {
      height: 40,
      borderColor: '#ffffff',
      borderBottomWidth: 1,
      marginBottom: 36,
      fontSize: 18,
      paddingBottom: 5,
      color: 'white'
    },
    btnContainer: {
      backgroundColor: 'white',
      marginTop: 30,
    },
    buttonViewInside: {
        backgroundColor: appColors.secondary,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonViewText: {
        color: 'white',
        fontSize: 20
    },
});

export default LoginScreen
