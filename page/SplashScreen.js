import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '../component/colors';
import { Dimension } from '../component/dimension';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFonts } from 'expo-font';
// 
const SplashScreen = () => {
    const navigation = useNavigation();
    const navig = async () => {
        setTimeout(async () => {
            const intro = await AsyncStorage.getItem('intro');
            const loggedIn = await AsyncStorage.getItem('loggedIn');

            if (loggedIn == 'true') {
                navigation.navigate('Home')
            } else if (!loggedIn && intro != '1') {
                navigation.navigate('Intro')
            } else {
                navigation.navigate('Auth')
            }
        }, 2000)
    }
    useEffect(() => {
        navig();
    }, [])

    // 
    return (
        <View style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.light}
                barStyle='dark-content'
            />
            <View style={styles.imgContainer}>
                <Image style={styles.img} source={require('../assets/img/smk.png')} />
            </View>
            <View style={styles.textContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                    <Image style={styles.smImg} source={require('../assets/img/icon-transparent.png')} />
                    <Text style={styles.h1}>E-Arsip</Text>
                </View>
                <Text style={styles.text}>Aplikasi Pengelolaan Kearsipan Elektronik</Text>
            </View>
        </View>
    )
}

export default SplashScreen

// 
const styles = StyleSheet.create(
    {
        container: {
            backgroundColor: colors.light,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imgContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 3,
            margin: Dimension.width * 0.3
        },
        img: {
            width: Dimension.width* 0.5,
            height: Dimension.width* 0.5,
        },
        text: {
            fontSize: 18,
            margin: 20,
            fontFamily: 'Poppins-Regular'
        },
        textContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        h1: {
            fontSize: 20,
            color: colors.red,
            fontWeight: 'bold',
            margin: 5,
            fontFamily: 'Poppins-Bold',
            textTransform: 'uppercase'
        },
        text: {
            fontSize: 16,
            color: colors.red,
        },
        smImg: {
            width: 17,
            height: 20,
            marginRight: 5
        }
    }
)