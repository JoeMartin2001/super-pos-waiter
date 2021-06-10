import React from 'react'
import { ActivityIndicator } from 'react-native'
import { View, Text, StyleSheet } from 'react-native'
import { appColors } from '../../common/variables'

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator 
                size='large'
                color={appColors.primary}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.transparent
    }
})

export default SplashScreen
