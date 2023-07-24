import { ToastAndroid } from 'react-native';
import { baseUrl } from '../function/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from './navigationRef';

const updatePassword = async (nip, lama, baru) => {
    fetch(baseUrl + 'updatePassword', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nip: nip,
            lama: lama,
            baru: baru,
        })
    }).then((res) => res.json())
        .then((resp) => {
            RootNavigation.navigate('Profile');
            if (resp == 1) {
                ToastAndroid.show('Berhasil', ToastAndroid.LONG);
            } else if (resp == 2) {
                ToastAndroid.show('Gagal', ToastAndroid.LONG);
            } else {
                ToastAndroid.show('Gagal, kata sandi lama tidak sesuai!', ToastAndroid.LONG);
            }
        }).catch((e) => {
            console.log(e);
            // ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
        })
}
export default updatePassword