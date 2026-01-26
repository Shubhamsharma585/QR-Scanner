import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Colors } from '../constants/colors';

export type IconType = 'Feather' | 'Ionicons';

interface IconProps {
    type?: IconType;
    name: string;
    size?: number;
    color?: string;
    style?: any;
}

export const Icon: React.FC<IconProps> = ({
    type = 'Feather',
    name,
    size = 24,
    color = Colors.textPrimary,
    style,
}) => {
    const IconComponent = type === 'Ionicons' ? Ionicons : Feather;

    return (
        <IconComponent
            name={name as any}
            size={size}
            color={color}
            style={style}
        />
    );
};
