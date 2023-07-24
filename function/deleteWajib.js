import { ToastAndroid } from 'react-native';
import { baseUrl } from '../function/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as RootNavigation from './navigationRef';
import totalDoc from './totalDoc';

const deleteWajib = async (id, route) => {
    fetch(baseUrl + 'deleteWajib', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
        })
    }).then((res) => res.json())
        .then((resp) => {
            if (resp == 1) {
                ToastAndroid.show("Berhasil", ToastAndroid.LONG);
                RootNavigation.navigate(route);
            } else {
                ToastAndroid.show("Gagal", ToastAndroid.LONG);
            }
        }).catch((e) => {
            console.log(e);
            // ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
        })
}
export default deleteWajib