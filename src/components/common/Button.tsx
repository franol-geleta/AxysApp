import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, FONTS } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.surface },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: COLORS.background },
  secondary: { color: COLORS.primary },
  outline: { color: COLORS.primary },
};

export const Button: React.FC<ButtonProps> = memo(({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = disabled ? styles.disabled : variantStyles[variant];
  const labelStyle = disabled ? styles.disabledText : variantTextStyles[variant];
  const indicatorColor = variant === 'outline' ? COLORS.primary : COLORS.background;

  return (
    <TouchableOpacity
      style={[styles.container, buttonStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text style={[styles.label, labelStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  disabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.semiBold,
  },
  disabledText: {
    color: COLORS.buttonDisabledText,
  },
});
