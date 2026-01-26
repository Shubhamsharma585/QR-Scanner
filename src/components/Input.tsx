import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Icon } from './Icon';

interface InputProps extends TextInputProps {
    label: string;
    iconName?: string;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    iconName,
    containerStyle,
    style,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focusedInput,
                    props.editable === false && styles.disabledInput,
                ]}
            >
                {iconName && (
                    <Icon
                        name={iconName}
                        size={20}
                        color={isFocused ? Colors.primary : Colors.textSecondary}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={Colors.placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor={Colors.primary}
                    {...props}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    label: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Spacing.borderRadius.md,
        backgroundColor: Colors.inputBackground,
        paddingHorizontal: Spacing.md,
    },
    focusedInput: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    disabledInput: {
        backgroundColor: Colors.surface,
    },
    icon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        height: '100%',
        ...Typography.body,
        color: Colors.textPrimary,
        textAlignVertical: 'top', // Android multiline top alignment
    },
});
