import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Icon } from '../../src/components/Icon';
import { Colors } from '../../src/constants/colors';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textSecondary,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: Colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: Colors.background,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon type="Feather" name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: 'Scan',
                    tabBarIcon: ({ color, size }) => (
                        <Icon type="Ionicons" name="scan-outline" size={size} color={color} />
                    ),
                    // Hide tab bar on scan screen for immersive experience? 
                    // User asked for bottom nav ON home screen, but immersive scanner usually hides it.
                    // Let's keep it visible for now unless "Immersive" implies hiding it.
                    // "SCANNER SCREEN: Design: Immersive... Top bar... Status text at bottom".
                    // Safe to hide tab bar for Scanner.
                    tabBarStyle: { display: 'none' },
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color, size }) => (
                        <Icon type="Ionicons" name="add-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <Icon type="Feather" name="clock" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
