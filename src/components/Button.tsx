import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

type ButtonVariant = 'primary' | 'secondary' | 'text';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}) => {
    const handlePress = () => {
        if (!disabled && !loading) {
            Haptics.selectionAsync();
            onPress();
        }
    };

    const getContainerStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryContainer;
            case 'secondary':
                return styles.secondaryContainer;
            case 'text':
                return styles.textContainer;
            default:
                return styles.primaryContainer;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryText;
            case 'secondary':
                return styles.secondaryText;
            case 'text':
                return styles.textButtonText;
            default:
                return styles.primaryText;
        }
    };

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#FFF' : Colors.primary} />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text style={[getTextStyle(), icon && { marginLeft: Spacing.sm }, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </>
    );

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={handlePress}
                disabled={disabled || loading}
                activeOpacity={0.9}
                style={[styles.baseButton, style, disabled && styles.disabled]}
            >
                <LinearGradient
                    colors={Colors.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.gradient, getContainerStyle()]}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.baseButton,
                getContainerStyle(),
                style,
                disabled && styles.disabled,
            ]}
        >
            {content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        borderRadius: Spacing.borderRadius.md,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradient: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryContainer: {
        height: 56,
        // Gradient handles background
    },
    secondaryContainer: {
        height: 56,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    textContainer: {
        height: 'auto',
        backgroundColor: 'transparent',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    primaryText: {
        ...Typography.button,
        color: '#FFFFFF',
    },
    secondaryText: {
        ...Typography.button,
        color: Colors.primary,
    },
    textButtonText: {
        ...Typography.button,
        color: Colors.primary,
    },
    disabled: {
        opacity: 0.5,
    },
});
