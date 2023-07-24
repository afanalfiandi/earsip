import { ToastAndroid } from 'react-native';
import { baseUrl } from '../function/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from './navigationRef';

const updateProfile = async (nip, nama, jabatan) => {
    fetch(baseUrl + 'updateProfile', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nip: nip,
            nama: nama,
            jabatan: jabatan,
        })
    }).then((res) => res.json())
        .then((resp) => {
            
            RootNavigation.navigate('Profile');

            if (resp == 1) {
                ToastAndroid.show('Berhasil', ToastAndroid.LONG);
            } else {
                ToastAndroid.show('Gagal', ToastAndroid.LONG);
            }
        }).catch((e) => {
            console.log(e);
            // ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
        })
}
export default updateProfile