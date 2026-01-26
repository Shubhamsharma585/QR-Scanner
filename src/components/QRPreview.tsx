import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Button } from './Button';
import { Card } from './Card';
import { Icon } from './Icon';

interface QRPreviewProps {
    value: string;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ value }) => {
    const qrRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    // If value is empty, don't show QR
    if (!value) return null;

    const saveToGallery = async () => {
        if (!permissionResponse?.granted) {
            const permission = await requestPermission();
            if (!permission.granted) {
                Alert.alert("Permission Required", "Please allow access to save QR codes to your gallery.");
                return;
            }
        }

        setLoading(true);
        try {
            if (qrRef.current) {
                qrRef.current.toDataURL(async (data: string) => {
                    try {
                        const base64Code = data.startsWith('data:image/png;base64,')
                            ? data.replace('data:image/png;base64,', '')
                            : data;

                        const dir = FileSystem.cacheDirectory;
                        if (!dir) throw new Error("Storage unavailable");

                        const filename = dir + `qr_code_${Date.now()}.png`;
                        await FileSystem.writeAsStringAsync(filename, base64Code, {
                            encoding: 'base64',
                        });
                        await MediaLibrary.saveToLibraryAsync(filename);
                        Alert.alert("Saved", "QR Code saved to gallery successfully!");
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "Failed to save: " + (err instanceof Error ? err.message : String(err)));
                    }
                });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to init save: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setLoading(false);
        }
    };

    const shareQR = async () => {
        setLoading(true);
        try {
            if (qrRef.current) {
                qrRef.current.toDataURL(async (data: string) => {
                    try {
                        const base64Code = data.startsWith('data:image/png;base64,')
                            ? data.replace('data:image/png;base64,', '')
                            : data;

                        const dir = FileSystem.cacheDirectory;
                        if (!dir) throw new Error("Storage unavailable");

                        const filename = dir + `qr_code_share_${Date.now()}.png`;
                        await FileSystem.writeAsStringAsync(filename, base64Code, {
                            encoding: 'base64',
                        });

                        if (await Sharing.isAvailableAsync()) {
                            await Sharing.shareAsync(filename);
                        } else {
                            Alert.alert("Error", "Sharing is not available on this device");
                        }
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "Failed to share: " + (err instanceof Error ? err.message : String(err)));
                    }
                });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to init share: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.previewCard}>
                <View style={styles.qrContainer}>
                    <QRCode
                        value={value}
                        size={200}
                        color="black"
                        backgroundColor="white"
                        getRef={(c) => (qrRef.current = c)}
                    />
                </View>
            </Card>

            <View style={styles.actions}>
                <Button
                    title="Save to Gallery"
                    onPress={saveToGallery}
                    loading={loading}
                    icon={<Icon name="download-outline" type="Ionicons" size={20} color="#FFF" />}
                />
                <Button
                    title="Share"
                    onPress={shareQR}
                    variant="secondary"
                    loading={loading}
                    icon={<Icon name="share-social-outline" type="Ionicons" size={20} color={Colors.primary} />}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.lg,
    },
    previewCard: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
        padding: Spacing.xl,
    },
    qrContainer: {
        backgroundColor: 'white',
        padding: Spacing.md,
        borderRadius: Spacing.borderRadius.md,
        // Add shadow specifically to QR container for "White background card" look
    },
    actions: {
        gap: Spacing.md,
    },
});
