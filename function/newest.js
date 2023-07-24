import { ToastAndroid } from 'react-native';
import { baseUrl } from '../function/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from './navigationRef';

const newest = async (nip,total) => {
    // console.warn(nip, total);
    fetch(baseUrl + 'getNewest', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nip: nip,
        })
    }).then((res) => res.json())
        .then((resp) => {
            console.warn(resp);
        }).catch((e) => {
            console.log(e);
            // ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
        })
}
export default newest