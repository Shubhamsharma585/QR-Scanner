import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Button } from './Button';
import { Card } from './Card';
import { Icon } from './Icon';

interface QRPreviewProps {
    value: string;
}

const getWritableDirectory = async (): Promise<string> => {
    const baseDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
    if (!baseDir) {
        throw new Error(`Storage directory unavailable on ${Platform.OS}. Please try again or check app settings.`);
    }

    const dir = `${baseDir}qr-codes/`;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return dir;
};

export const QRPreview: React.FC<QRPreviewProps> = ({ value }) => {
    const qrRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
        writeOnly: true,
        granularPermissions: ['photo'],
    });

    // If value is empty, don't show QR
    if (!value) return null;

    const getQRCodeBase64 = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!qrRef.current) {
                reject(new Error("QR Code not ready"));
                return;
            }
            qrRef.current.toDataURL((data: string) => {
                if (data) {
                    const base64Code = data.startsWith('data:image/png;base64,')
                        ? data.replace('data:image/png;base64,', '')
                        : data;
                    resolve(base64Code);
                } else {
                    reject(new Error("Failed to generate QR data"));
                }
            });
        });
    };

    const saveToGallery = async () => {
        setLoading(true);
        try {
            const base64Code = await getQRCodeBase64();

            if (Platform.OS === 'web') {
                const link = document.createElement('a');
                link.href = `data:image/png;base64,${base64Code}`;
                link.download = `qr_code_${Date.now()}.png`;
                link.click();
                return;
            }

            if (!permissionResponse?.granted) {
                const permission = await requestPermission();
                if (!permission.granted) {
                    Alert.alert("Permission Required", "Please allow access to save QR codes to your gallery.");
                    return;
                }
            }

            const isMediaLibraryAvailable = await MediaLibrary.isAvailableAsync();
            if (!isMediaLibraryAvailable) {
                Alert.alert("Not Available", "Media library is not available on this device.");
                return;
            }

            const dir = await getWritableDirectory();

            const filename = dir + `qr_code_${Date.now()}.png`;
            await FileSystem.writeAsStringAsync(filename, base64Code, {
                encoding: FileSystem.EncodingType.Base64,
            });
            await MediaLibrary.saveToLibraryAsync(filename);
            Alert.alert("Saved", "QR Code saved to gallery successfully!");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setLoading(false);
        }
    };

    const shareQR = async () => {
        if (Platform.OS === 'web') {
            Alert.alert("Not Supported", "Sharing is not supported on Web. Please use Download instead.");
            return;
        }

        setLoading(true);
        try {
            const base64Code = await getQRCodeBase64();
            const dir = await getWritableDirectory();

            const filename = dir + `qr_code_share_${Date.now()}.png`;
            await FileSystem.writeAsStringAsync(filename, base64Code, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filename);
            } else {
                Alert.alert("No Sharing", "Sharing is not available on this device.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to share: " + (error instanceof Error ? error.message : String(error)));
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
