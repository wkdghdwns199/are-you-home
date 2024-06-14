import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen';
import SettingScreen from './SettingScreen';
import AddressScreen from "./AddressScreen";

const Stack = createStackNavigator();

function NavigationScreen() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                    cardStyleInterpolator: ({ current, layouts }) => {
                        const translateY = current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.height, 0],
                        });
                        return {
                            cardStyle: {
                                transform: [{ translateY }],
                            },
                        };
                    },
                }}>
                <Stack.Screen name="MainScreen" component={MainScreen} />
                <Stack.Screen name="SettingScreen" component={SettingScreen} />
                <Stack.Screen name="AddressScreen" component={AddressScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default NavigationScreen;