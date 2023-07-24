import { ToastAndroid } from 'react-native';
import { baseUrl } from '../function/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from './navigationRef';
import newest from './newest';

const totalDoc = async (nip) => {
    fetch(baseUrl + 'getTotalDoc', {
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
            newest(nip, resp);
            // RootNavigation.navigate('Home', resp);

        }).catch((e) => {
            console.log(e);
            // ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
        })
}
export default totalDoc