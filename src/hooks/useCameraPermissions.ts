import { PermissionStatus, useCameraPermissions } from 'expo-camera';
import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';

export const useAppCameraPermissions = () => {
    const [permission, requestPermission] = useCameraPermissions();

    const requestCameraPermission = useCallback(async () => {
        if (!permission) return false;

        if (permission.status === PermissionStatus.UNDETERMINED) {
            const result = await requestPermission();
            return result.granted;
        }

        if (permission.status === PermissionStatus.DENIED && !permission.canAskAgain) {
            Alert.alert(
                "Camera Permission Required",
                "Please enable camera access in your device settings to scan QR codes.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Settings", onPress: () => Linking.openSettings() }
                ]
            );
            return false;
        }

        if (permission.status === PermissionStatus.DENIED) {
            const result = await requestPermission();
            return result.granted;
        }

        return permission.granted;
    }, [permission, requestPermission]);

    return {
        permission,
        requestCameraPermission,
    };
};
