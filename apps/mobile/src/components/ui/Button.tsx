import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [styles.button, styles[variant]];
  const textStyles: TextStyle[] = [styles.text, styles[`${variant}Text`]];

  if (size === 'small') {
    buttonStyles.push(styles.buttonSmall);
    textStyles.push(styles.textSmall);
  } else if (size === 'large') {
    buttonStyles.push(styles.buttonLarge);
    textStyles.push(styles.textLarge);
  }

  if (fullWidth) {
    buttonStyles.push(styles.buttonFullWidth);
  }

  if (disabled || loading) {
    buttonStyles.push(styles.buttonDisabled);
  }

  return (
    <TouchableOpacity
      style={[...buttonStyles, style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : '#10B981'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[...textStyles, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Variants
  primary: {
    backgroundColor: '#10B981',
  },
  secondary: {
    backgroundColor: '#3B82F6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Text styles
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#10B981',
  },
  ghostText: {
    color: '#10B981',
  },
});
