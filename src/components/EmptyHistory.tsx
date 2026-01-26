import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Icon } from './Icon';

export const EmptyHistory = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Icon name="time-outline" type="Ionicons" size={64} color={Colors.textSecondary} />
            </View>
            <Text style={styles.title}>No scans yet</Text>
            <Text style={styles.subtitle}>Scanned QR codes will appear here</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
        marginTop: Spacing.xxl,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});
