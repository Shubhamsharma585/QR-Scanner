import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Icon } from './Icon';

export const QR_TYPES = [
    { id: 'text', label: 'Text', icon: 'type' },
    { id: 'url', label: 'URL', icon: 'link' },
    { id: 'wifi', label: 'WiFi', icon: 'wifi' },
    { id: 'email', label: 'Email', icon: 'mail' },
    { id: 'phone', label: 'Phone', icon: 'phone' },
];

interface TypeSelectorProps {
    selected: string;
    onSelect: (id: string) => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ selected, onSelect }) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {QR_TYPES.map((type) => {
                    const isSelected = selected === type.id;
                    return (
                        <TouchableOpacity
                            key={type.id}
                            style={[
                                styles.tab,
                                isSelected && styles.selectedTab
                            ]}
                            onPress={() => onSelect(type.id)}
                        >
                            <Icon
                                name={type.icon}
                                size={18}
                                color={isSelected ? '#FFF' : Colors.textSecondary}
                                style={styles.icon}
                            />
                            <Text style={[
                                styles.label,
                                isSelected && styles.selectedLabel
                            ]}>
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    scrollContent: {
        paddingHorizontal: Spacing.screenPadding,
        gap: Spacing.sm,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    selectedTab: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    icon: {
        marginRight: 6,
    },
    label: {
        ...Typography.caption,
        fontWeight: '600',
    },
    selectedLabel: {
        color: '#FFFFFF',
    },
});
