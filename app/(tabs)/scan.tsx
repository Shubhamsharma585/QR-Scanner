import { BarcodeScanningResult, CameraView, FlashMode } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Icon } from '../../src/components/Icon';
import { ScannerOverlay } from '../../src/components/ScannerOverlay';
import { ScanResultModal } from '../../src/components/ScanResultModal';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { useAppCameraPermissions } from '../../src/hooks/useCameraPermissions';
import { Storage } from '../../src/utils/storage';

export default function ScanScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { permission, requestCameraPermission } = useAppCameraPermissions();

    const [scanned, setScanned] = useState(false);
    const [flash, setFlash] = useState<FlashMode>('off');
    const [result, setResult] = useState<{ data: string; type: string } | null>(null);
    const [isActive, setIsActive] = useState(false); // To control camera active state with tab focus

    // Handle tab focus to pause camera when not visible
    useFocusEffect(
        useCallback(() => {
            setIsActive(true);
            return () => {
                setIsActive(false);
                setFlash('off');
            };
        }, [])
    );

    useEffect(() => {
        if (!permission?.granted) {
            requestCameraPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = async ({ data, type }: BarcodeScanningResult) => {
        if (scanned) return;

        setScanned(true);
        // Determine type (simplified)
        let formattedType = 'TEXT';
        if (data.startsWith('http')) formattedType = 'URL';
        else if (data.startsWith('WIFI:')) formattedType = 'WIFI';
        else if (data.startsWith('MATMSG:') || data.startsWith('mailto:')) formattedType = 'EMAIL';
        else if (data.startsWith('tel:')) formattedType = 'PHONE';

        setResult({ data, type: formattedType });

        // Auto save
        await Storage.saveScan(data, formattedType);
    };

    const handleCloseResult = () => {
        setResult(null);
        setScanned(false);
    };

    const toggleFlash = () => {
        setFlash(current => (current === 'off' ? 'on' : 'off'));
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.permissionContainer, { paddingTop: insets.top }]}>
                <Icon name="camera-off" size={64} color={Colors.textSecondary} />
                <Text style={styles.permissionText}>Camera access is required</Text>
                <Button title="Allow Camera" onPress={requestCameraPermission} style={{ marginTop: 20 }} />
                <Button title="Go Back" variant="text" onPress={() => router.back()} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {isActive && (
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    flash={flash}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                />
            )}

            {/* Overlay UI */}
            <View style={[styles.uiOverlay, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.navigate('/(tabs)');
                            }
                        }}
                        style={styles.iconButton}
                    >
                        <Icon name="arrow-back" type="Ionicons" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleFlash}
                        style={styles.iconButton}
                    >
                        <Icon
                            name={flash === 'on' ? 'flash' : 'flash-off'}
                            type="Ionicons"
                            size={24}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Scanner Visuals */}
                <ScannerOverlay />

                {/* Footer Hint */}
                <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                    <Text style={styles.hintText}>Point camera at QR code</Text>
                </View>
            </View>

            {/* Result Modal */}
            <ScanResultModal
                visible={!!result}
                data={result?.data || ''}
                type={result?.type || ''}
                onClose={handleCloseResult}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionText: {
        ...Typography.h2,
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    uiOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    hintText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
});
