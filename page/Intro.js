import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../component/colors'
import { Dimension } from '../component/dimension'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Intro = () => {
  const navigation = useNavigation();

  const onStart = async () => {
    AsyncStorage.setItem('intro','1')
    navigation.navigate('Auth');
  }
  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.first]}>
        <Text style={[styles.h1, styles.txtBlack]}>Don't be busy. Just be</Text>
        <Text style={[styles.h1, styles.txtRed]}>productive.</Text>
        <Text style={[styles.text, styles.txtBlack]}>Save document online and save some time.</Text>
      </View>
      <View style={[styles.row, styles.second]}>
        <Image source={require('../assets/img/intro.png')} />
      </View>
      <View style={[styles.row, styles.third]}>
        <TouchableOpacity style={styles.btn} onPress={onStart}>
          <Text style={styles.btnText}>Mulai</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Intro

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    padding: 18,
  },
  row: {
    paddingVertical: 20
  },
  first: {
    marginTop: 30,
    marginBottom: 10
  },
  h1: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  txtBlack: {
    color: colors.black
  },
  txtRed: {
    color: colors.red
  },
  text: {
    fontSize: 16,
    fontWeight: 'light'
  },
  second: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  third: {
    position: 'absolute',
    bottom: 25,
    right: 0,
    left: 0,
    paddingHorizontal: 18
  },
  btn: {
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 5,
  },
  btnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
})