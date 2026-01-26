import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneratorInput } from '../../src/components/GeneratorInput';
import { QRPreview } from '../../src/components/QRPreview';
import { TypeSelector } from '../../src/components/TypeSelector';
import { Colors } from '../../src/constants/colors';
import { Spacing } from '../../src/constants/spacing';
import { Typography } from '../../src/constants/typography';

export default function CreateScreen() {
    const [selectedType, setSelectedType] = useState('text');
    const [qrValue, setQrValue] = useState('');

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create QR Code</Text>
                    </View>

                    <TypeSelector
                        selected={selectedType}
                        onSelect={setSelectedType}
                    />

                    <View style={styles.formContainer}>
                        <GeneratorInput
                            type={selectedType}
                            onChange={setQrValue}
                        />
                    </View>

                    {/* Show Preview if we have value */}
                    {qrValue ? (
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewLabel}>Live Preview</Text>
                            <QRPreview value={qrValue} />
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderText}>
                                Enter content to generate QR code
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingBottom: Spacing.xxl + 20,
    },
    header: {
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h1,
    },
    formContainer: {
        marginBottom: Spacing.xl,
    },
    previewContainer: {
        marginTop: Spacing.md,
    },
    previewLabel: {
        ...Typography.h3,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    placeholderContainer: {
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    placeholderText: {
        ...Typography.body,
        textAlign: 'center',
        color: Colors.textSecondary,
    },
});
