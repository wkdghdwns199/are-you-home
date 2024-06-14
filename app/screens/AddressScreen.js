import {StatusBar, View, StyleSheet} from 'react-native'
import React from 'react'
import Postcode from "@actbase/react-daum-postcode";
import {useRoute} from "@react-navigation/native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {LinearGradient} from "expo-linear-gradient";
import {storeData} from '../libs/AsyncStorage'
function AddressScreen({navigation}){

    const route = useRoute();
    const {gradientColors} = route.params;

    return (
        <>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    height: getStatusBarHeight(),
                    position: 'absolute',
                    width: '100%',
                    zIndex: 9999,
                    top:0,
                }}
            >
                <StatusBar
                    translucent={true}
                    backgroundColor="transparent"
                    barStyle="light-content"
                />
            </LinearGradient>
        <View style={styles.container}>

            <Postcode
                style={{ width: '100%', height: '96%', position:'absolute', bottom:0 }}
                jsOptions={{ animation: true }}
                onSelected={(data) => {storeData('userAddress',JSON.stringify(data.address))
                navigation.goBack()}}
            />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems :'center',
        justifyContent:'center',
        backgroundColor:'white',
    }
})

export default AddressScreen
