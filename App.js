import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { appColors } from './src/common/variables';
import AppNavigation from './src/navigation/AppNavigation';
import { StateProvider } from './src/context/StateProvider';
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  return (
    <StateProvider>
        <MenuProvider>
          <AppNavigation />
        </MenuProvider>
        <StatusBar
          animated={true}
          backgroundColor={appColors.tertiary} 
        />
    </StateProvider>
  );
}
