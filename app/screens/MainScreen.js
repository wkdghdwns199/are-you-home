import {Animated,Text,View,Modal, Pressable, Image, StatusBar,StyleSheet} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {LinearGradient} from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {loadAsync} from "expo-font";
import {getData} from "../libs/AsyncStorage"
import {useIsFocused} from "@react-navigation/native";
import axios from "axios";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function MainScreen({ navigation }) {

    const [fontLoaded, setFontLoaded] = useState(false);

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [changingStatus, setChangingStatus] = useState(true)
    const [imageDirectory, setImageDirectory] = useState(require('../images/safeEmoji.png'))
    const [settingImageDirectory, setSettingImageDirectory] = useState(require('../images/settingIconSafeMode.png'))
    const [gradientColors, setGradientColors] = useState(['#9CFF84','#2BFF99', '#42F1BD'])

    const [fadeSafeStatus, setFadeSafeStatus] = useState(0)
    const [fadeDangerStatus, setFadeDangerStatus] = useState(1)
    const fadeSafeEmoji = useRef(new Animated.Value(1)).current;
    const fadeDangerEmoji = useRef(new Animated.Value(0)).current;
    const [modeOnOffState, setModeOnOffState] = useState(true)

    const [modeTitle, setModeTitle] = useState('Safe Mode')
    const [welcomeText, setWelcomeText] = useState('You Are Home!')

    const [intervalRunning, setIntervalRunning] = useState(false)
    const [intervalId, setIntervalId] = useState(0)


    const [modalVisible, setModalVisible] = useState(false)


    async function loadFont() {
        await loadAsync({
            'font-jua': require('../fonts/BMJUA_ttf.ttf'), // 배달의민족 주아체 폰트 경로
        });
        setFontLoaded(true);
    }



    const isFocused = useIsFocused();
    const [showUserAddress, setShowUserAddress] = useState('주소를 입력해주세요!')
    useEffect(() => {
        loadFont().then(r => console.log(r));
        getData('userAddress').then(userAddress => {
            console.log('screen focused ')
            userAddress === '' ? setShowUserAddress(showUserAddress) : setShowUserAddress(userAddress)
        })
    },[isFocused])


    if (!fontLoaded) {
        return null; // 폰트 로딩 중이라면 렌더링하지 않음
    }


    function emojiChange() {
        setFadeSafeStatus(1-fadeSafeStatus)
        setFadeDangerStatus(1-fadeDangerStatus)

        Animated.timing(fadeSafeEmoji, {
            toValue: fadeSafeStatus,
            duration: 600,
            useNativeDriver: true,
        }).start();

        Animated.timing(fadeDangerEmoji, {
            toValue: fadeDangerStatus,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }

    const fadeOut = () => {
        sendSignal().then(r => console.log(r))

        setChangingStatus(!changingStatus)

        imageDirectory === require('../images/safeEmoji.png') ? setImageDirectory(require('../images/dangerEmoji.png'))
            : setImageDirectory(require('../images/safeEmoji.png'))


        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            emojiChange()
            setTimeout(() => {
                changingStatus ? setGradientColors(['#FF8484', '#FF442B', '#F15742'])
                    : setGradientColors(['#9CFF84','#2BFF99', '#42F1BD'])
                settingImageDirectory === require('../images/settingIconSafeMode.png') ? setSettingImageDirectory(require('../images/settingIconDangerMode.png'))
                    : setSettingImageDirectory(require('../images/settingIconSafeMode.png'))
                modeTitle === 'Safe Mode' ? setModeTitle('Security Mode') : setModeTitle('Safe Mode')
                welcomeText === 'You Are Home!' ? setWelcomeText('Are You Home?') : setWelcomeText('You Are Home!')

                fadeIn();
                toggleInterval();

            }, 500); // 0.5초 뒤에 fadeIn 실행
        });
    };

    const fadeIn = () => {

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    const onModeFunc = async () => {
        try{
            const response = await axios.get('http://182.215.121.80:8080/LED=ON')
            console.log(response["data"])
            response["data"] >= 90 ? setModalVisible(!modalVisible) : console.log('Safe')
        }
        catch (error){
            console.log(error)
        }

    }

    const oFFModeFunc = async () => {
        try{
            const response = await axios.get('http://182.215.121.80:8080/LED=OFF')
            console.log(response["data"])
        }
        catch(error){
            console.log(error)
        }


    }


    const sendSignal = async () => {
        setModeOnOffState(!modeOnOffState)
        console.log(modeOnOffState)
        try{
            modeOnOffState ? await onModeFunc() : await oFFModeFunc()
        }
        catch(error){
            console.error(error)
        }
    }

    // 10초마다 onModeFunc를 호출하는 함수
    const toggleInterval = () => {
        if (intervalRunning){
            clearInterval(intervalId);
            oFFModeFunc().then(r => console.log(r))
            console.log('!!!')
            console.log(intervalRunning)
        }
        else {
            const newIntervalId = setInterval(() => {
                if (modeOnOffState) {
                    onModeFunc().then(r => console.log(r));
                }
            }, 1000);
            setIntervalId(newIntervalId)
        }
        setIntervalRunning(!intervalRunning)
    };

    return (
        <>
            <AnimatedLinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    opacity : fadeAnim,
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
            </AnimatedLinearGradient>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Someone's Home! Check Please</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                clearInterval(intervalId)
                                setModalVisible(!modalVisible)
                                }}>
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        <View style={styles.container}>

            <Animated.View style={[styles.upperPiece,{opacity:fadeAnim}]}>
                <MaskedView maskElement={
                    <Text style={[styles.messageForUserText, {backgroundColor:'transparent'}]}>
                        {modeTitle}</Text>}>
                <LinearGradient colors={gradientColors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}>
                    <Text style={[styles.messageForUserText, {opacity:0}]}>
                        {modeTitle}
                    </Text>
                </LinearGradient>
                </MaskedView>

                <Pressable onPress ={ () => navigation.navigate('AddressScreen',{gradientColors:gradientColors})}>
                <MaskedView maskElement={
                    <Text style={[styles.userAddress, {backgroundColor:'transparent'}]}>
                        {showUserAddress}
                    </Text>}>
                <LinearGradient colors={gradientColors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}>
                        <Text style={[styles.userAddress, {opacity:0}]}>{showUserAddress}</Text>
                </LinearGradient>
                </MaskedView>
                </Pressable>
            </Animated.View>

            <Pressable style={styles.safeAndDangerEmoji} onPress ={fadeOut}>
                <Animated.Image style={[styles.safeAndDangerEmojiImage, {opacity:fadeDangerEmoji}]}
                                   source={require('../images/dangerEmoji.png')}/>
                <Animated.Image style={[styles.safeAndDangerEmojiImage, {opacity:fadeSafeEmoji}]}
                                   source={require('../images/safeEmoji.png')}/>

            </Pressable>
            <AnimatedLinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.bottomPiece, {opacity : fadeAnim}]}>
                <Text style={styles.safeAndDangerStatusText}>{welcomeText}</Text>
                <Pressable onPress={() => navigation.navigate('SettingScreen',{gradientColors : gradientColors})}
                              style={styles.settingScreenButton} >
                    <Image style={styles.settingIcon} source={settingImageDirectory}/>
                </Pressable>
            </AnimatedLinearGradient>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems :'center',
        justifyContent:'center',
        backgroundColor:'white',
    },
    safeAndDangerEmoji :{
        alignItems:'center',
        backgroundColor:'white',
        borderRadius:100,
        width:100,
        height:100,
        zIndex:1,
        top:20,
    },
    upperPiece:{
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        left: 0,
        right: 0,
        top: 0,
        height:'50%',
        backgroundColor:'white'
    },
    messageForUserText:{
        color:'white',
        fontSize:45,
        fontFamily :'font-jua'
    },

    userAddress:{
        height:50,
        top:30,
        fontSize:18,
        fontFamily :'font-jua'
    },
    bottomPiece:{
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height:'50%',
        backgroundColor:'black'
    },
    settingScreenButton:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        width:50,
        height:50,
        borderRadius:50,
        top:100,
    },
    safeAndDangerStatusText: {
        color:'white',
        fontSize:30,
        fontFamily :'font-jua'
    },
    safeAndDangerEmojiImage: {
        position :'absolute',
        top:20,
        width: '62%',
        height:20,
    },
    settingIcon: {
        width:25,
        height:25
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        height:35,
    },
    buttonClose: {
        backgroundColor: '#F15742',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width:300,
        height:100,
        margin: 20,
        backgroundColor: '#ffe7c0',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

});

export default MainScreen
