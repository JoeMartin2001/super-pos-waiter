import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FoodCategory from './FoodCategory';
import { appColors } from '../../common/variables';

const Tab = createMaterialTopTabNavigator();

const FoodCategories = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                indicatorContainerStyle: {
                    backgroundColor: appColors.primary,
                },
                activeTintColor: 'white',
                indicatorStyle: {
                    backgroundColor: 'white',
                },
            }}
        >
            <Tab.Screen 
                name="National" 
                component={FoodCategory} 
                options={({}) => ({
                    title: 'нацио...'
                })}
                initialParams={{ category: 'nationalFood' }}
            />
            <Tab.Screen 
                name="FastFood" 
                component={FoodCategory} 
                options={({}) => ({
                    title: 'фастфуд'
                })}
                initialParams={{ category: 'fastFood' }}
            />
            <Tab.Screen 
                name="Dessert" 
                component={FoodCategory} 
                options={({}) => ({
                    title: 'дессерт',
                })}
                initialParams={{ category: 'dessert' }}
            />
            <Tab.Screen 
                name="Drink" 
                component={FoodCategory} 
                options={({}) => ({
                    title: 'напитки'
                })}
                initialParams={{ category: 'drinks' }}
            />
        </Tab.Navigator>
    )
}

export default FoodCategories
