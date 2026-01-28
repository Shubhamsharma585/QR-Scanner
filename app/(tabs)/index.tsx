import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/qr.png')}
                    style={styles.logoImage}
                />
                <Text style={styles.appName}>QR Instant</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.screenPadding,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    logoImage: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: Spacing.sm,
    },
    appName: {
        ...Typography.h2,
    },
    content: {
        padding: Spacing.screenPadding,
        flexGrow: 1,
        justifyContent: 'center',
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
