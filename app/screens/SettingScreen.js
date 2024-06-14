import {View, StyleSheet,StatusBar,Pressable, Text, Switch, Image } from 'react-native';
import React, {useState, useEffect} from 'react';
import {LinearGradient} from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {useRoute} from "@react-navigation/native";
import {loadAsync} from "expo-font";

function SettingScreen({navigation}){
    const route = useRoute();
    const {gradientColors} = route.params;

    const [fontLoaded, setFontLoaded] = useState(false);

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    async function loadFont() {
        await loadAsync({
            'font-jua': require('../fonts/BMJUA_ttf.ttf'), // 배달의민족 주아체 폰트 경로
        });
        setFontLoaded(true);
    }

    useEffect(() => {
        loadFont().then(r => console.log(r));
    }, []);



    if (!fontLoaded) {
        return null; // 폰트 로딩 중이라면 렌더링하지 않음
    }

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
                <View style={styles.menuBox}>
                    <Pressable style={styles.settingAddressPageButton}>


                        <MaskedView maskElement={
                            <Text style={[styles.menuTextStyle, {backgroundColor:'transparent'}]}>주소 설정</Text>}>
                            <LinearGradient colors={gradientColors}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}>
                        <Text style={[styles.menuTextStyle,{opacity:0}]} onPress={() => navigation.navigate('AddressScreen',{gradientColors:gradientColors})}>주소 설정</Text>
                            </LinearGradient>
                        </MaskedView>
                    </Pressable>

                    <View style={{flexDirection:'row'}}>
                        <MaskedView maskElement={
                            <Text style={[styles.menuTextStyle, {backgroundColor:'transparent'}]}>거리 측정 모드</Text>}>
                            <LinearGradient colors={gradientColors}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}>
                                <Text style={[styles.menuTextStyle,{opacity:0}]}>거리 측정 모드</Text>
                            </LinearGradient>
                        </MaskedView>
                        <Switch
                            trackColor={{false: '#767577', true: gradientColors[1]}}
                            thumbColor={isEnabled ? gradientColors[0] : '#f4f3f4'}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                            style={{width:55, height:25}}
                        />

                    </View>
                </View>

                <View
                    style={[styles.bottomPiece]}>
                    <Text style={styles.safeAndDangerStatusText}></Text>
                    <LinearGradient colors={gradientColors} style={styles.settingScreenButton}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Image style={styles.settingIcon} source={require('../images/closePageImage.png')}/>
                    </Pressable>
                    </LinearGradient>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems :'center',
        justifyContent:'center',
        backgroundColor:'white',
    },
    bottomPiece:{
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height:'50%',
        backgroundColor:'white'
    },
    settingScreenButton:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        width:50,
        height:50,
        borderRadius:50,
        top:120,
    },
    settingIcon: {
        width:25,
        height:25
    },
    menuBox: {
        width: '70%',
        height: 250,
    },
    settingAddressPageButton: {
        marginBottom:50,
    },
    menuTextStyle: {
        fontSize:30,
        fontFamily :'font-jua'
    }
})
export default SettingScreen
