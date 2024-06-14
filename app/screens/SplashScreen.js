import React from "react";
import {View, StyleSheet, Image} from "react-native";


function SplashScreen() {
    return (
        <View style ={styles.container}>
            <Image source = {require('../images/splashScreen.png')} style = {styles.logoImage}  />
        </View>
    );
}


const styles = StyleSheet.create({
    container :{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },

    logoImage : {
        resizeMode : 'stretch',
        width: 344,
        height: 900,
    },
})

export default SplashScreen;