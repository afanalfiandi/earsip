import { StatusBar, TextInput, Image, ActivityIndicator, Modal, StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../component/colors'
import { Dimension } from '../component/dimension'
import { useNavigation } from '@react-navigation/native'
import auth from '../function/auth';

const Auth = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [nip, setNip] = useState();
    const [password, setPassword] = useState();

    const onSubmit = () => {
        setLoading(!loading);
        setTimeout(() => {
            auth(nip,password);
            setLoading(false);
            navigation.navigate('Home');
        }, 3000);
    }
    return (
        <ScrollView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.light}
                barStyle='dark-content'
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={loading}
            >
                <View style={styles.centeredView}>
                    <ActivityIndicator size="large" color={colors.red} />
                </View>
            </Modal>
            <View style={styles.header}>
                <Image source={require('../assets/img/icon-transparent-sm.png')} />
                <Text style={[styles.text, { fontWeight: 'bold' }]}>E-ARSIP</Text>
            </View>
            <View style={styles.form}>
                <View style={styles.formGroup}>
                    <Text style={styles.h1}>Selamat Datang!</Text>
                    <Text style={styles.text}>Silahkan masuk untuk melanjutkan</Text>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>NIP</Text>
                    <View style={styles.inputContainer}>
                        <Image source={require('../assets/img/username.png')} />
                        <TextInput style={styles.input} placeholder='Masukkan NIP Anda' value={nip} onChangeText={setNip} />
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kata Sandi</Text>
                    <View style={styles.inputContainer}>
                        <Image source={require('../assets/img/key.png')} />
                        <TextInput secureTextEntry style={styles.input} placeholder='Masukkan Kata Sandi Anda' value={password} onChangeText={setPassword} />
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <TouchableOpacity style={styles.btn} onPress={onSubmit}>
                        <Text style={styles.btnText}>Masuk</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default Auth

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
        padding: 18,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        color: colors.red,
        fontSize: 20,
    },
    h1: {
        fontSize: 24,
        color: colors.red,
        fontWeight: 'bold',
    },
    form: {
        flex: 1,
        paddingTop: Dimension.height * 0.2,
    },
    formGroup: {
        marginTop: 15
    },
    inputContainer: {
        borderWidth: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderRadius: 8,
        flexDirection: 'row',
        borderColor: '#D8D8D8'
    },
    input: {
        width: '92%',
        height: '100%'
    },
    label: {
        marginBottom: 5,
        color: colors.red,
        fontSize: 16,
    },
    btn: {
        backgroundColor: colors.red,
        padding: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        marginTop: 10
    },
    btnText: {
        color: colors.white,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center'
    }
})