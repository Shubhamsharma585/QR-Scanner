import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.98}
                style={[styles.card, style]}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.background,
        borderRadius: Spacing.borderRadius.lg,
        padding: Spacing.cardPadding,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3, // Android
    },
});
