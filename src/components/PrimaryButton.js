import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle
}) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSuccess = variant === 'success';
  const isGhost = variant === 'ghost';
  const isDark = variant === 'dark';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.outline,
        isDanger && styles.danger,
        isSuccess && styles.success,
        isGhost && styles.ghost,
        isDark && styles.dark,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? colors.text : colors.white} />
      ) : (
        <View style={styles.content}>
          {icon ? <Text style={[styles.icon, (isOutline || isGhost) && styles.outlineText]}>{icon}</Text> : null}
          <Text style={[styles.text, (isOutline || isGhost) && styles.outlineText, textStyle]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: '#FF7A7C',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    color: colors.white,
    marginRight: 8,
    fontSize: 17
  },
  outline: {
    backgroundColor: '#1A2438',
    borderWidth: 1,
    borderColor: '#3A4A67',
    shadowOpacity: 0.15,
    elevation: 1
  },
  ghost: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#553338',
    shadowOpacity: 0.12,
    elevation: 1
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: '#FB7185'
  },
  success: {
    backgroundColor: colors.success,
    borderColor: '#4ADE80'
  },
  dark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155'
  },
  disabled: {
    opacity: 0.55
  },
  pressed: {
    transform: [{ scale: 0.985 }]
  },
  text: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16
  },
  outlineText: {
    color: colors.text
  }
});
