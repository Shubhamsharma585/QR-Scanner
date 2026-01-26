import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { HistoryItem as HistoryItemType } from '../utils/storage';
import { Card } from './Card';
import { Icon } from './Icon';

interface HistoryItemProps {
    item: HistoryItemType;
    onDelete: (id: string) => void;
    onPress: (item: HistoryItemType) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete, onPress }) => {
    const swipeableRef = useRef<Swipeable>(null);

    const renderRightActions = (progress: any, dragX: any) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.rightActionContainer}>
                <Animated.View style={[styles.rightAction, { transform: [{ scale }] }]}>
                    <RectButton
                        style={styles.deleteButton}
                        onPress={() => {
                            swipeableRef.current?.close();
                            onDelete(item.id);
                        }}
                    >
                        <Icon name="trash-outline" type="Ionicons" size={24} color="#FFF" />
                    </RectButton>
                </Animated.View>
            </View>
        );
    };

    const getIconName = (type: string) => {
        switch (type) {
            case 'URL': return 'globe-outline';
            case 'WIFI': return 'wifi';
            case 'EMAIL': return 'mail-outline';
            case 'PHONE': return 'call-outline';
            default: return 'text-outline';
        }
    };

    const formattedDate = new Date(item.timestamp).toLocaleDateString() + ' ' +
        new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            rightThreshold={40}
        >
            <Card style={styles.card} onPress={() => onPress(item)}>
                <View style={styles.row}>
                    <View style={styles.typeIcon}>
                        <Icon name={getIconName(item.type)} type="Ionicons" size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.data} numberOfLines={1}>
                            {item.data}
                        </Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.typeTag}>{item.type}</Text>
                            <Text style={styles.date}>{formattedDate}</Text>
                        </View>
                    </View>
                    <Icon name="chevron-forward" type="Ionicons" size={20} color={Colors.textSecondary} />
                </View>
            </Card>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: Spacing.screenPadding,
        marginBottom: Spacing.listGap,
        padding: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    info: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    data: {
        ...Typography.bodyBold,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeTag: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
        marginRight: Spacing.sm,
    },
    date: {
        ...Typography.caption,
    },
    rightActionContainer: {
        width: 80,
        marginBottom: Spacing.listGap,
        marginRight: Spacing.screenPadding,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightAction: {
        flex: 1,
        width: '100%',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: Colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Spacing.borderRadius.lg,
    },
});
