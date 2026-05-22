import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { colors } from '../constants/colors';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import AddContactScreen from '../screens/AddContactScreen';
import SosAlertScreen from '../screens/SosAlertScreen';
import SosHistoryScreen from '../screens/SosHistoryScreen';
import RecordingHistoryScreen from '../screens/RecordingHistoryScreen';
import FakeCallScreen from '../screens/FakeCallScreen';
import IncomingFakeCallScreen from '../screens/IncomingFakeCallScreen';
import DangerMapScreen from '../screens/DangerMapScreen';
import AddDangerReportScreen from '../screens/AddDangerReportScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.loadingText}>Dang mo EmergSOS Lite...</Text>
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '900' },
        headerRight: () => (
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileLink}>Ho so</Text>
          </Pressable>
        )
      })}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'EmergSOS Lite' }} />
      <Stack.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Danh ba khan cap' }} />
      <Stack.Screen name="AddContact" component={AddContactScreen} options={{ title: 'Lien he' }} />
      <Stack.Screen name="SosAlert" component={SosAlertScreen} options={{ title: 'SOS Alert' }} />
      <Stack.Screen name="SosHistory" component={SosHistoryScreen} options={{ title: 'Lich su SOS' }} />
      <Stack.Screen name="RecordingHistory" component={RecordingHistoryScreen} options={{ title: 'Lich su ghi am' }} />
      <Stack.Screen name="FakeCall" component={FakeCallScreen} options={{ title: 'Fake Call' }} />
      <Stack.Screen
        name="IncomingFakeCall"
        component={IncomingFakeCallScreen}
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
      <Stack.Screen name="DangerMap" component={DangerMapScreen} options={{ title: 'Diem nguy hiem' }} />
      <Stack.Screen name="AddDangerReport" component={AddDangerReportScreen} options={{ title: 'Bao cao nguy hiem' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Ho so', headerRight: () => null }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) return <LoadingScreen />;

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  loadingText: {
    marginTop: 10,
    color: colors.muted,
    fontWeight: '700'
  },
  profileLink: {
    color: colors.white,
    fontWeight: '800'
  }
});

