import { ToastAndroid } from "react-native";
import { baseUrl } from "./config";

const img = async (nip, name, type, uri) => {
    const data = new FormData();

    data.append('nip', nip);
    data.append('file', {
        uri: uri,
        type: type,
        name: name
    });

    try {
        let res = await fetch(baseUrl + "uploadImg", {
            method: 'post',
            body: data,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        });

        let result = await res.json();
        
        if (result != 1) {
            ToastAndroid.show("Gagal!", ToastAndroid.LONG);
        }
    } catch (error) {
        console.log('error upload', error);
    }
}

export default img;