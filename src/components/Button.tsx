import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { borderRadius, spacing, fontSize, fontWeight } from '../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return colors.gradient.primary;
      case 'secondary':
        return colors.gradient.secondary;
      case 'danger':
        return [colors.error, '#E85555'];
      default:
        return colors.gradient.dark;
    }
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
              variant === 'outline' && styles.textOutline,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
          styles.buttonOutline,
          disabled && styles.buttonDisabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {buttonContent}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[disabled && styles.buttonDisabled, style]}
    >
      <LinearGradient
        colors={disabled ? [colors.grayDark, colors.grayDark] : getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
        ]}
      >
        {buttonContent}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonSmall: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  buttonMedium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  buttonLarge: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  textSmall: {
    fontSize: fontSize.sm,
  },
  textMedium: {
    fontSize: fontSize.md,
  },
  textLarge: {
    fontSize: fontSize.lg,
  },
  textOutline: {
    color: colors.primary,
  },
});

export default Button;
