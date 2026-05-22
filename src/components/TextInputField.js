import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';

export default function TextInputField({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  containerStyle,
  inputStyle,
  editable = true,
  ...props
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, !editable && styles.disabledWrap, error && styles.inputError]}>
        {leftIcon ? <Text style={styles.leftIcon}>{leftIcon}</Text> : null}
        <TextInput
          placeholderTextColor={colors.muted}
          style={[styles.input, !editable && styles.disabledInput, inputStyle]}
          editable={editable}
          {...props}
        />
        {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6
  },
  label: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14
  },
  inputWrap: {
    minHeight: 52,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text
  },
  leftIcon: {
    marginRight: 8,
    fontSize: 17
  },
  rightElement: {
    marginLeft: 8
  },
  disabledWrap: {
    backgroundColor: '#F3F4F6'
  },
  disabledInput: {
    color: colors.muted
  },
  inputError: {
    borderColor: colors.danger
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700'
  }
});
