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
        <ActivityIndicator color={isOutline || isGhost ? colors.primary : colors.white} />
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
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0
  },
  ghost: {
    backgroundColor: colors.primaryLight,
    shadowOpacity: 0,
    elevation: 0
  },
  danger: {
    backgroundColor: colors.danger
  },
  success: {
    backgroundColor: colors.success
  },
  dark: {
    backgroundColor: colors.text
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
    color: colors.primary
  }
});
