import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import styles from '../styles.js';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />
      <Image source={require('../assets/splash-icon1.png')} style={styles.logo} />
      <Text style={styles.appName}>My Finance App - CashFlow</Text>
      <Text style={styles.tagline}>Track. Save. Grow.</Text>
      <ActivityIndicator size="large" color="#3F51B5" style={styles.loader} />
    </View>
  );
}
