import React, { useEffect } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export const ScannerOverlay = () => {
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Top Overlay */}
            <View style={styles.overlay} />

            <View style={styles.centerRow}>
                {/* Left Overlay */}
                <View style={styles.overlay} />

                {/* Scan Window */}
                <View style={styles.scanWindow}>
                    <Animated.View style={[styles.scanFrame, { transform: [{ scale: pulseAnim }] }]}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </Animated.View>
                </View>

                {/* Right Overlay */}
                <View style={styles.overlay} />
            </View>

            {/* Bottom Overlay */}
            <View style={styles.overlay} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
    },
    centerRow: {
        flexDirection: 'row',
        height: SCAN_SIZE,
    },
    scanWindow: {
        width: SCAN_SIZE,
        height: SCAN_SIZE,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#FFF',
        borderWidth: 4,
        borderRadius: 8,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
});
