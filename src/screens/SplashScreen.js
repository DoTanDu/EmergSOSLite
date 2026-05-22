import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { appText } from '../constants/appText';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 900);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SOS</Text>
      <Text style={styles.title}>{appText.appName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 24
  },
  logo: {
    color: colors.white,
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 4
  },
  title: {
    marginTop: 10,
    color: colors.white,
    fontSize: 28,
    fontWeight: '900'
  }
});
