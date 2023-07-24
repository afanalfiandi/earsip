
import { baseUrl } from '../function/config';
const pribadi = async (nip, namaFile, uri, name, type) => {
    const data = new FormData();

    data.append('nip', nip);
    data.append('nama_dokumen', namaFile);
    data.append('file', {
        uri: uri,
        type: type,
        name: name
    });

    try {
        let res = await fetch(baseUrl + "uploadPribadi", {
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

export default pribadi;