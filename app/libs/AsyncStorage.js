import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        // console.log(error);
    }
};

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        //console.log(value);
        if(value!==null){
            return value;
        }
    } catch (error) {
        console.log('HI2')
        return '';
    }
};