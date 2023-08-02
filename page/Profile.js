import { ActivityIndicator, BackHandler, Modal, StyleSheet, ScrollView, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../component/colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import img from '../function/img';
import { baseUrl } from '../function/config';
import { Button, Dialog, Portal, PaperProvider, List } from 'react-native-paper';
import mime from 'mime';
import { uri } from '../function/config';
import updateProfile from '../function/profile';
import updatePassword from '../function/password';
import moment from 'moment'
import 'moment/locale/id';

const Profile = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [loadingImg, setLoadingImg] = useState(true);
    const [refresh, setRefresh] = useState(Math.random());

    const [dataJabatan, setDataJabatan] = useState([
        {
            id_jabatan_detail: "",
            jabatan: ""
        }
    ])

    const [dataStatus, setDataStatus] = useState([
        {
            id_status_karyawan_detail: "",
            status_karyawan: ""
        }
    ])

    const [profile, setProfile] = useState(false);
    const [pass, setPass] = useState(false);
    const [jabatanLabel, setJabatanLabel] = useState();
    const [jkLabel, setJkLabel] = useState();
    const [statusLabel, setStatusLabel] = useState();


    const [nip, setNip] = useState();
    const [nama, setNama] = useState();
    const [tglPengangkatan, setTglPengangkatan] = useState();
    const [jabatan, setJabatan] = useState();
    const [jk, setJK] = useState();
    const [status, setStatus] = useState();
    const [alamat, setAlamat] = useState();

    const [lama, setLama] = useState();
    const [baru, setBaru] = useState();


    const [userData, setUserData] = useState({
        nip: '',
        nama: '',
        img: '',
        jabatan: '',
        jk: '',
        status: '',
        alamat: '',
    })

    const getUser = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('userSession'));
        const nip = user.nip;

        fetch(baseUrl + 'getUser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nip: nip,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                setUserData(responseJson);
                setNip(responseJson.nip);
                setNama(responseJson.nama);
                setJabatanLabel(responseJson.jabatan);
                setJkLabel(responseJson.jk);
                setStatusLabel(responseJson.status);
                setAlamat(responseJson.alamat);
                setTglPengangkatan(responseJson.tgl_pengangkatan);
            })
            .catch((e) => {
                console.log(e);
            })

    }

    const getJabatan = () => {
        fetch(baseUrl + 'getJabatan', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                setDataJabatan(responseJson[0]);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    const getStatus = () => {
        fetch(baseUrl + 'getStatus', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                setDataStatus(responseJson[0]);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            getUser();
            getJabatan();
            getStatus();
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

    const onLogout = () => {
        setLoading(true);
        setTimeout(() => {
            AsyncStorage.clear();
            setLoading(false);
            navigation.navigate('Auth');
        }, 3000);
    }

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const name = result.assets[0].uri.split('/').pop();;
            const uri = result.assets[0].uri;
            const type = mime.getType(result.assets[0].uri);


            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                img(userData.nip, name, type, uri);

                setTimeout(() => {
                    getUser();
                }, 1000);
            }, 3000);
        }
    }
    const [expanded, setExpanded] = useState(false);
    const [expandedJK, setExpandedJK] = useState(false);
    const [expandedStatus, setExpandedStatus] = useState(false);

    const handlePress = () => setExpanded(!expanded);
    const jkPress = () => setExpandedJK(!expandedJK);
    const statusPress = () => setExpandedStatus(!expandedStatus);
    const disable = () => { }

    const onProfile = async () => {
        setLoading(true);
        updateProfile(userData.nip, nama, jabatan, jk, status, alamat);
        console.log(alamat);
        setTimeout(() => {
            setProfile(false);
            setLoading(false)
        }, 3000);

        setTimeout(() => {
            getUser();
        }, 1500);
    }
    const onPassword = async () => {
        setLoading(true);
        updatePassword(userData.nip, lama, baru);
        setTimeout(() => {
            setPass(false)
            setLoading(false)
        }, 3000);
    }
    return (
        <ScrollView style={styles.container}>
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
                <Text style={styles.greetings}>Pengaturan Akun</Text>
                <TouchableOpacity onPress={onLogout}>
                    <Text style={[styles.greetings, { fontWeight: 'light', fontSize: 16 }]}>Logout</Text>
                </TouchableOpacity>
            </View>
            {!loading && (
                <View>
                    <View style={styles.row}>
                        <View style={styles.imgContainer}>
                            <View style={styles.floatContainer}>
                                <Image source={{ uri: uri + 'img/' + userData.img }} style={styles.profileImg} />
                                <TouchableOpacity style={styles.floatBtn} onPress={pickImage}>
                                    <Image source={require('../assets/img/camera.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.formGroup, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={styles.formTitle}>Detail Profil</Text>
                            <TouchableOpacity style={styles.switchBtn} onPress={() => { setProfile(!profile) }}>
                                <Text>{profile == true ? 'Batal' : 'Ubah'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>NIP</Text>
                            <TextInput value={nip} onChangeText={setNip} style={styles.input} editable={false} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Nama Lengkap</Text>
                            <TextInput value={nama} onChangeText={setNama} style={styles.input} editable={profile == true ? true : false} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Tanggal Pengangkatan</Text>
                            <TextInput value={moment(tglPengangkatan).format('dddd D MMMM YYYY')} onChangeText={setTglPengangkatan} style={styles.input} editable={false} />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Jabatan</Text>
                            <List.Section style={{ borderWidth: 1, borderRadius: 10, borderColor: '#D8D8D8' }}
                                disabled={true}
                            >
                                <List.Accordion
                                    style={{ width: '100%', borderRadius: 10, backgroundColor: colors.light, opacity: profile ? 1 : 0.4 }}
                                    title={jabatanLabel}
                                    expanded={expanded}
                                    onPress={profile == true ? handlePress : disable}
                                >
                                    {dataJabatan.map((item) => {
                                        return (
                                            <List.Item title={item.jabatan} key={item.id_jabatan_detail} onPress={() => {
                                                setJabatan(item.id_jabatan_detail)
                                                handlePress()
                                            }}>
                                            </List.Item>
                                        )
                                    })}
                                </List.Accordion>
                            </List.Section>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Jenis Kelamin</Text>
                            <List.Section style={{ borderWidth: 1, borderRadius: 10, borderColor: '#D8D8D8' }}>
                                <List.Accordion
                                    style={{ width: '100%', borderRadius: 10, backgroundColor: colors.light, opacity: profile ? 1 : 0.4 }}
                                    title={jkLabel}
                                    expanded={expandedJK}
                                    onPress={profile == true ? jkPress : disable}
                                >
                                    <List.Item title={"Laki-laki"} onPress={() => {
                                        setJK(1)
                                        jkPress()
                                    }}>
                                    </List.Item>
                                    <List.Item title={"Perempuan"} onPress={() => {
                                        setJK(2)
                                        jkPress()
                                    }}>
                                    </List.Item>
                                </List.Accordion>
                            </List.Section>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Status Karyawan</Text>
                            <List.Section style={{ borderWidth: 1, borderRadius: 10, borderColor: '#D8D8D8' }}>
                                <List.Accordion
                                    style={{ width: '100%', borderRadius: 10, backgroundColor: colors.light, opacity: profile ? 1 : 0.4 }}
                                    title={statusLabel}
                                    expanded={expandedStatus}
                                    onPress={profile == true ? statusPress : disable}
                                >
                                    {dataStatus.map((item) => {
                                        return (
                                            <List.Item title={item.status_karyawan} key={item.id_status_karyawan_detail} onPress={() => {
                                                setStatus(item.id_status_karyawan_detail)
                                                statusPress()
                                            }}>
                                            </List.Item>
                                        )
                                    })}
                                </List.Accordion>
                            </List.Section>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Alamat</Text>
                            <TextInput value={alamat} onChangeText={setAlamat} style={[styles.input, {height: 120}]} editable={profile == true ? true : false} />
                        </View>
                        <View style={styles.formGroup}>
                            <TouchableOpacity style={[styles.btn, { opacity: profile == true ? 1 : 0.7 }]} disabled={profile == true ? false : true} onPress={onProfile}>
                                <Text style={styles.txtBtn}>Ubah</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.row, { marginBottom: 50 }]}>
                        <View style={[styles.formGroup, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={styles.formTitle}>Pengaturan Sandi</Text>
                            <TouchableOpacity style={styles.switchBtn} onPress={() => { setPass(!pass) }}>
                                <Text>{pass == true ? 'Batal' : 'Ubah'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Kata Sandi Lama</Text>
                            <TextInput value={lama} secureTextEntry onChangeText={setLama} style={styles.input} editable={pass == true ? true : false} placeholder="*******" />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Kata Sandi Baru</Text>
                            <TextInput value={baru} secureTextEntry onChangeText={setBaru} style={styles.input} editable={pass == true ? true : false} placeholder="*******" />
                        </View>
                        <View style={styles.formGroup}>
                            <TouchableOpacity style={[styles.btn, { opacity: pass == true ? 1 : 0.7 }]} disabled={pass == true ? false : true} onPress={onPassword}>
                                <Text style={styles.txtBtn}>Ubah</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        padding: 25,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    greetings: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.red
    },
    row: {
        marginVertical: 10
    },
    formTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10
    },
    formGroup: {
        marginBottom: 10
    },
    label: {
        marginBottom: 5,
        fontSize: 16
    },
    input: {
        borderWidth: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderRadius: 8,
        flexDirection: 'row',
        borderColor: '#D8D8D8'
    },
    btn: {
        backgroundColor: colors.red,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10
    },
    txtBtn: {
        color: colors.white,
        fontWeight: 'bold'
    },
    switchBtn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    floatContainer: {
        paddingHorizontal: 5
    },
    floatBtn: {
        position: 'absolute',
        width: 30,
        borderRadius: 100,
        height: 30,
        bottom: 0,
        right: 0,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 3,
        elevation: 5,
    },
    centeredView: {
        backgroundColor: colors.light,
        flex: 1,
        padding: 20
    },
    profileImg: {
        width: 75,
        height: 75,
        borderRadius: 100,
    }
})