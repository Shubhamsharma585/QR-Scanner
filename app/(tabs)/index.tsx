import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { Colors } from '../../src/constants/colors';
import { Spacing } from '../../src/constants/spacing';
import { Typography } from '../../src/constants/typography';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    {/* Logo could go here */}
                    <View style={styles.logoContainer}>
                        <LinearGradient
                            colors={Colors.primaryGradient}
                            style={styles.logoBackground}
                        >
                            <Icon name="qr-code" type="Ionicons" size={32} color="#FFF" />
                        </LinearGradient>
                    </View>
                    <Text style={styles.appName}>QR Master</Text>
                    <Text style={styles.tagline}>Scan & Create QR Codes Instantly</Text>
                </View>

                <View style={styles.cardsContainer}>
                    <Card
                        style={styles.actionCard}
                        onPress={() => router.push('/(tabs)/scan')}
                    >
                        <View style={styles.cardContent}>
                            <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                                <Icon name="camera-outline" type="Ionicons" size={40} color={Colors.primary} />
                            </View>
                            <Text style={styles.cardTitle}>Scan QR Code</Text>
                            <Text style={styles.cardDescription}>Scan any QR code using your camera</Text>
                        </View>
                    </Card>

                    <Card
                        style={styles.actionCard}
                        onPress={() => router.push('/(tabs)/create')}
                    >
                        <View style={styles.cardContent}>
                            <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
                                <Icon name="add-circle-outline" type="Ionicons" size={40} color={Colors.secondary} />
                            </View>
                            <Text style={styles.cardTitle}>Create QR Code</Text>
                            <Text style={styles.cardDescription}>Generate custom QR codes instantly</Text>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.screenPadding,
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    logoContainer: {
        marginBottom: Spacing.md,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoBackground: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        ...Typography.h1,
        marginBottom: Spacing.xs,
    },
    tagline: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    cardsContainer: {
        gap: Spacing.lg,
    },
    actionCard: {
        padding: Spacing.xl,
        borderRadius: Spacing.borderRadius.xl,
    },
    cardContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    cardTitle: {
        ...Typography.h2,
        marginBottom: Spacing.xs,
    },
    cardDescription: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});
