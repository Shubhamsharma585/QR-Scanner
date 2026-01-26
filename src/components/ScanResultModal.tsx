import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useRef } from 'react';
import { Animated, Linking, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Button } from './Button';
import { Card } from './Card';
import { Icon } from './Icon';

interface ScanResultModalProps {
    visible: boolean;
    data: string;
    type: string;
    onClose: () => void;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({ visible, data, type, onClose }) => {
    const slideAnim = useRef(new Animated.Value(300)).current;
    const { height } = useWindowDimensions();

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                damping: 20,
                stiffness: 90,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(data);
        // Could show a toast here
    };

    const handleOpen = async () => {
        if (await Linking.canOpenURL(data)) {
            await Linking.openURL(data);
        }
    };

    const isUrl = data.startsWith('http');

    if (!visible) return null;

    return (
        <View style={styles.overlayWrapper}>
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={onClose}
            />
            <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.handle} />

                <View style={styles.header}>
                    <View style={styles.typeBadge}>
                        <Icon name="qr-code-outline" type="Ionicons" size={16} color={Colors.primary} />
                        <Text style={styles.typeText}>{type}</Text>
                    </View>
                </View>

                <Card style={styles.contentCard}>
                    <Text style={styles.content} numberOfLines={4}>
                        {data}
                    </Text>
                </Card>

                <View style={styles.actions}>
                    {isUrl && (
                        <Button
                            title="Open in Browser"
                            onPress={handleOpen}
                            style={styles.actionButton}
                            icon={<Icon name="globe-outline" type="Ionicons" size={20} color="#FFF" />}
                        />
                    )}

                    <Button
                        title="Copy Content"
                        onPress={handleCopy}
                        variant="secondary"
                        style={styles.actionButton}
                        icon={<Icon name="copy-outline" type="Ionicons" size={20} color={Colors.primary} />}
                    />

                    <Button
                        title="Scan Again"
                        onPress={onClose}
                        variant="text"
                        style={styles.actionButton}
                    />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlayWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.2)', // Subtle backdrop
        zIndex: 100,
    },
    container: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: Spacing.borderRadius.xl,
        borderTopRightRadius: Spacing.borderRadius.xl,
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl + 20, // Extra for safe area
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
        gap: 6,
    },
    typeText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.primary,
    },
    contentCard: {
        marginBottom: Spacing.lg,
        backgroundColor: Colors.surface,
    },
    content: {
        ...Typography.body,
        textAlign: 'center',
    },
    actions: {
        gap: Spacing.sm,
    },
    actionButton: {
        width: '100%',
    },
});
