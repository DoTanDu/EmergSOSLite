import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function ScreenContainer({ children, scroll = true, style }) {
  if (!scroll) {
    return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={[styles.container, style]}>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    gap: 14
  }
});

