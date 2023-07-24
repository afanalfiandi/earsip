import { baseUrl } from '../function/config';
const wajib = async (nip, jenisDokumen, uri, name, type) => {
    const data = new FormData();
    data.append('nip', nip);
    data.append('jenis_dokumen', jenisDokumen);
    data.append('file', {
        uri: uri,
        type: type,
        name: name
    });
    try {
        let res = await fetch(baseUrl + "uploadWajib", {
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

export default wajib;