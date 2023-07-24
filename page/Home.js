import { Button, RefreshControl, ActivityIndicator, Modal, Image, ToastAndroid, StyleSheet, BackHandler, FlatList, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../component/colors'
import { Dimension } from '../component/dimension'
import { Dialog, Portal, PaperProvider } from 'react-native-paper';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, uri } from '../function/config';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import deleteWajib from '../function/deleteWajib';

const Home = () => {
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(Math.random());
  const [loading, setLoading] = useState();
  const [terbaru, setTerbaru] = useState([])
  const [userData, setUserData] = useState({});
  const [total, setTotal] = useState(0);
  const getUser = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('userSession'));
    setUserData(user);
  }

  const getTotal = async () => {
    const userSession = JSON.parse(await AsyncStorage.getItem('userSession'));
    fetch(baseUrl + 'getTotalDoc', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: userSession.nip,
      })
    }).then((res) => res.json())
      .then((resp) => {
        setTotal(resp);
      }).catch((e) => {
        ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
      })
  }
  const getTerbaru = async () => {
    const userSession = JSON.parse(await AsyncStorage.getItem('userSession'));
    fetch(baseUrl + 'getNewest', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: userSession.nip,
      })
    }).then((res) => res.json())
      .then((resp) => {
        setTerbaru(resp);
      }).catch((e) => {
        ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.LONG);
      })
  }

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getTerbaru();
      getUser();
      getTotal();
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

  const onView = async (files) => {
    WebBrowser.openBrowserAsync(uri + 'wajib/' + files)
  }
  const onDelete = async (id) => {  
    setLoading(true);
    setTimeout(() => {
      deleteWajib(id, 'Home');
      setLoading(false);
    }, 3000);
    setTimeout(() => {
      getTerbaru();
    }, 1000);
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={loading}
      >
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color={colors.red} />
        </View>
      </Modal>
      {!loading && (
        <View>
          <View style={styles.header}>
            <Text style={styles.greetings}>Halo,{'\n'}{userData.nama}</Text>

            <TouchableOpacity style={styles.profileBtn} onPress={() => {
              navigation.navigate('Profile');
            }}>
              <Image style={styles.profileImg} source={require('../assets/img/user-default.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.h1}>Dokumen</Text>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <View style={styles.cardHeader} >
                  <Image source={require('../assets/img/file.png')} />
                  <Menu>
                    <MenuTrigger style={styles.tooltip}>
                      <Image source={require('../assets/img/tooltip-icon.png')} />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 10 }}>
                      <MenuOption onSelect={() =>
                        navigation.navigate('Wajib')
                      } text='Lihat' />
                    </MenuOptions>
                  </Menu>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>Dok. Wajib</Text>
                  <Text style={styles.cardText}>{total.total_wajib} dokumen</Text>
                </View>
              </View>
              <View style={styles.card}>
                <View style={styles.cardHeader} >
                  <Image source={require('../assets/img/bag.png')} />
                  <Menu>
                    <MenuTrigger style={styles.tooltip}>
                      <Image source={require('../assets/img/tooltip-icon.png')} />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 10 }}>
                      <MenuOption onSelect={() => navigation.navigate('Pribadi')} text='Lihat' />
                    </MenuOptions>
                  </Menu>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>Dok. Umum</Text>
                  <Text style={styles.cardText}>{total.total_pribadi} dokumen</Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView style={styles.content} refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => {
              setLoading(true)
              setTimeout(() => {
                getTerbaru();
                getTotal();
                setLoading(false)
              }, 3000);
            }} />}>
            <Text style={styles.h1}>File Terbaru</Text>
            {terbaru == null && (
              <View style={{ justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                <Text>Tidak ada file terbaru</Text>
              </View>
            )}
            {terbaru != null && (
              terbaru.map((item) => {
                return (
                  <View style={styles.itemContainer} key={item.id_dokumen}>
                    <View style={styles.contentImgContainer}>
                      <Image source={require('../assets/img/file.png')} />
                    </View>
                    <View style={styles.contentTextContainer}>
                      <Text style={[styles.cardTitle, { marginBottom: 2 }]}>{item.jenis_dokumen}</Text>
                      <Text style={styles.cardText}>{item.tgl_upload}</Text>
                    </View>
                    <View style={styles.contentBtnContainer}>
                      <Menu>
                        <MenuTrigger style={styles.tooltip}>
                          <Image source={require('../assets/img/tooltip-icon.png')} />
                        </MenuTrigger>
                        <MenuOptions style={{ padding: 10 }}>
                          <MenuOption onSelect={() => { onView(item.files) }} text='Lihat' />
                          <View style={styles.divider} />
                          <MenuOption onSelect={() => {
                            onDelete(item.id_dokumen)
                          }} text='Hapus' />
                        </MenuOptions>
                      </Menu>
                    </View>
                  </View>
                )
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  )
}
export default Home
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
  profileBtn: {
    width: 40,
    height: 40,
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  greetings: {
    fontWeight: 'bold',
    fontSize: 18
  },
  row: {
    marginTop: '20%'
  },
  h1: {
    fontWeight: 'bold',
    fontSize: 20
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  card: {
    width: '48%',
    height: Dimension.height * 0.15,
    padding: 10,
    backgroundColor: colors.white,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  cardText: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: 'bold'
  },
  content: {
    marginTop: Dimension.height * 0.03,
  },
  itemContainer: {
    marginVertical: 9,
    marginHorizontal: 4,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentImgContainer: {
    padding: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginRight: 2
  },
  contentTextContainer: {
    width: '74%',
    marginLeft: 4
  },
  contentBtnContainer: {
    marginRight: 5,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: colors.light
  },
  tooltip: {
    padding: 8
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center'
  }
})