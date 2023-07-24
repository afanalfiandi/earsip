import { Image, RefreshControl, BackHandler, ActivityIndicator, StyleSheet, Modal, TextInput, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../component/colors'
import { Dimension } from '../component/dimension'
import { Button, Dialog, Portal, PaperProvider, List } from 'react-native-paper';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../function/config';
import { uri as Uri } from '../function/config';
import wajib from '../function/wajib';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import deleteWajib from '../function/deleteWajib';
const Wajib = () => {
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [refresh, setRefresh] = useState(Math.random());

    const handlePress = () => setExpanded(!expanded);

    const [jenisDokumen, setJenisDokumen] = useState(0);
    const [jenisDokumenLabel, setJenisDokumenLabel] = useState('Jenis Dokumen');

    const [namaDoc, setNamaDoc] = useState(null);
    const [type, setType] = useState(null);
    const [uri, setUri] = useState(null);

    const [data, setData] = useState(
        [
            {
                id_dokumen: '',
                tgl_upload: '',
                files: '',
                jenis_dokumen: '',
            }
        ]
    );
    const [dataJenisDoc, setDataJenisDoc] = useState(
        [
            {
                id_dokumen_wajib_detail: '',
                jenis_dokumen: ''
            }
        ]
    )

    const openPicker = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        setNamaDoc(result.name);
        setUri(result.uri);
        setType(result.mimeType);
    }

    const onSubmit = async () => {

        const user = JSON.parse(await AsyncStorage.getItem('userSession'));

        setLoading(true);
        wajib(user.nip, jenisDokumen, uri, namaDoc, type);
        setTimeout(() => {
            setLoading(false);
            setModal(!modal);
        }, 3000);
    }

    const getJenisDoc = () => {
        fetch(baseUrl + 'getJenisDoc', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
            .then((resp) => {
                setDataJenisDoc(resp[0]);
            }).catch((e) => {
                console.log(e);
                // ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
            })
    }
    const getDocument = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('userSession'));
        fetch(baseUrl + 'getWajib', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nip: user.nip,
            })
        }).then((res) => res.json())
            .then((resp) => {
                setData(resp[0]);
            }).catch((e) => {
                console.log(e);
                // ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
            })
    }

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            getJenisDoc();
            getDocument();
            setTimeout(() => {
                setLoading(false);
            }, 1500);

            const backAction = () => {
                Alert.alert("", "Apakah Anda yakin ingin keluar dari aplikasi?", [
                    {
                        text: "Batal",
                        onPress: () => null,
                        style: "cancel",
                    },
                    { text: "Keluar", onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }, [refresh]));

    const onView = async (files) => {
        WebBrowser.openBrowserAsync(Uri + 'wajib/' + files)
    }

    const onDelete = async (id) => {
        setLoading(true);
        setTimeout(() => {
            deleteWajib(id, 'Wajib');
            setLoading(false);
        }, 3000);
    }
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.h1}>Upload Dokumen</Text>
                        <TouchableOpacity onPress={() => { setModal(!modal) }}>
                            <Image source={require('../assets/img/close.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalView}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Jenis Dokumen</Text>
                            <List.Section style={{ borderWidth: 1, borderRadius: 10, borderColor: '#D8D8D8' }}>
                                <List.Accordion
                                    style={{ width: '100%', borderRadius: 10, backgroundColor: colors.light }}
                                    title={jenisDokumenLabel}
                                    expanded={expanded}
                                    onPress={handlePress}
                                    left={props =>
                                        <Image {...props} source={require('../assets/img/folder.png')} />}>
                                    {dataJenisDoc.map((item) => {
                                        return (
                                            <List.Item title={item.jenis_dokumen} key={item.id_dokumen_wajib_detail} onPress={() => {
                                                setJenisDokumen(item.id_dokumen_wajib_detail)
                                                setJenisDokumenLabel(item.jenis_dokumen);
                                                handlePress()
                                            }}>
                                            </List.Item>
                                        )
                                    })}
                                </List.Accordion>
                            </List.Section>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Upload Dokumen</Text>
                            <TouchableOpacity style={styles.docPicker} onPress={openPicker}>
                                <Image source={require('../assets/img/file.png')} style={{ marginRight: 15 }} />

                                <Text>Pilih Dokumen  {namaDoc != null && ('\n' + namaDoc)} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.formGroup}>
                            <TouchableOpacity style={[styles.docPicker, { backgroundColor: colors.red, justifyContent: 'center', alignItems: 'center' }]} onPress={onSubmit}>
                                <Text style={{ color: colors.white, fontWeight: 'bold' }}>Simpan</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal >
            <Modal
                animationType="fade"
                transparent={true}
                visible={loading}
            >
                <View style={[styles.centeredView, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }]}>
                    <ActivityIndicator size="large" color={colors.red} />
                </View>
            </Modal>
            <View style={styles.header}>
                <Text style={styles.greetings}>Dokumen Wajib</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => {
                    setModal(!modal);
                }}>
                    <Text style={styles.addTxt}>+</Text>
                </TouchableOpacity>
            </View>

            {!loading && data == null && (
                <View style={[styles.centeredView, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Tidak ada data</Text>
                </View>
            )}
            {!loading && data != null && (
                <ScrollView style={styles.content} refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => {
                        setLoading(true);
                        getDocument();
                        setTimeout(() => {
                            setLoading(false)
                        }, 3000);
                    }} />}
                >
                    {data.map((item) => {
                        return (
                            <View style={[styles.itemContainer]} key={item.id_dokumen}>
                                <View style={styles.contentImgContainer}>
                                    <Image source={require('../assets/img/file.png')} />
                                </View>
                                <View style={styles.contentTextContainer}>
                                    <Text style={[styles.cardTitle, { marginBottom: 2 }]}>{item.jenis_dokumen}</Text>
                                    <Text style={styles.cardText}>{item.tgl_upload}</Text>
                                </View>
                                <View style={styles.contentBtnContainer}>
                                    <Menu>
                                        <MenuTrigger>
                                            <Image source={require('../assets/img/tooltip-icon.png')} />
                                        </MenuTrigger>
                                        <MenuOptions style={{ padding: 10 }}>
                                            <MenuOption onSelect={() => { onView(item.files) }} text='Lihat' />
                                            <View style={styles.divider} />
                                            <MenuOption onSelect={() => { onDelete(item.id_dokumen) }} text='Hapus' />
                                        </MenuOptions>
                                    </Menu>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            )}
        </View >
    )
}

export default Wajib

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        paddingVertical: 25,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,

    },
    profileBtn: {
        width: 40,
        height: 40,
    },
    profileImg: {
        width: '100%',
        height: '100%',
    },
    greetings: {
        fontWeight: 'bold',
        fontSize: 18
    },
    row: {
        marginTop: '20%'
    },
    h1: {
        fontWeight: 'bold',
        fontSize: 20
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    card: {
        width: '48%',
        height: Dimension.height * 0.15,
        padding: 10,
        backgroundColor: colors.white,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 3,
        elevation: 5,
        borderRadius: 10
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    cardBody: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    cardText: {
        fontSize: 12,
        color: colors.grey,
        fontWeight: 'bold'
    },
    content: {
        marginTop: Dimension.height * 0.03,
        paddingBottom: Dimension.height * 0.06,
        paddingTop: 10
    },
    itemContainer: {
        marginBottom: 15,
        marginHorizontal: 4,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: colors.white,
        shadowColor: "#000000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 25

    },
    contentImgContainer: {
        padding: 10,
        backgroundColor: colors.light,
        borderRadius: 10
    },
    contentTextContainer: {
        width: '74%'
    },
    contentBtnContainer: {
        marginRight: 5,
    },
    divider: {
        borderBottomWidth: 2,
        borderBottomColor: colors.light
    },
    addBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100
    },
    addTxt: {
        fontSize: 30,
        color: colors.red,
        fontWeight: 'bold'
    },
    centeredView: {
        backgroundColor: colors.light,
        flex: 1,
        padding: 20
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalView: {

    },
    modalText: {

    },
    formGroup: {
        marginTop: 15
    },
    inputContainer: {
        width: '100%',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderColor: '#D8D8D8',
        height: 65,
        backgroundColor: colors.light,
    },
    input: {
        width: '92%',
        backgroundColor: 'transparent',
        borderWidth: 0,

    },
    label: {
        marginBottom: 5,
        color: colors.red,
        fontWeight: 'bold',
        fontSize: 16,
    },
    docPicker: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#D8D8D8',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15
    }
})