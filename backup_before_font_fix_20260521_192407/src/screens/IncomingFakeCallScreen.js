import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';

export default function IncomingFakeCallScreen({ navigation, route }) {
  const callerName = route.params?.callerName || 'NgÆ°á»i thÃ¢n';

  return (
    <View style={styles.container}>
      <Text style={styles.calling}>Cuá»™c gá»i Ä‘áº¿n...</Text>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{callerName.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{callerName}</Text>
      <Text style={styles.phone}>Di Ä‘á»™ng</Text>

      <View style={styles.actions}>
        <PrimaryButton title="Tá»« chá»‘i" variant="danger" onPress={() => navigation.goBack()} style={styles.button} />
        <PrimaryButton title="Nghe mÃ¡y" variant="success" onPress={() => navigation.goBack()} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  calling: {
    color: colors.white,
    opacity: 0.8,
    fontSize: 18
  },
  avatar: {
    marginTop: 28,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: colors.white,
    fontSize: 56,
    fontWeight: '900'
  },
  name: {
    marginTop: 18,
    color: colors.white,
    fontSize: 34,
    fontWeight: '900'
  },
  phone: {
    marginTop: 4,
    color: colors.white,
    opacity: 0.75
  },
  actions: {
    position: 'absolute',
    bottom: 70,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1
  }
});

