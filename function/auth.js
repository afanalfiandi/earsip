import { ToastAndroid } from 'react-native';
import { baseUrl } from '../function/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as RootNavigation from './navigationRef';
import totalDoc from './totalDoc';

const auth = async (nip, password) => {
    fetch(baseUrl + 'auth', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nip: nip,
            password: password
        })
    }).then((res) => res.json())
        .then((resp) => {
            if (resp != 0) {
                AsyncStorage.setItem('userSession', JSON.stringify(resp));
                AsyncStorage.setItem('loggedIn', 'true');
                RootNavigation.navigate('Home');
            } else {
                ToastAndroid.show("NIP atau kata sandi salah", ToastAndroid.LONG);
            }
        }).catch((e) => {
            console.log(e);
            // ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
        })
}
export default auth