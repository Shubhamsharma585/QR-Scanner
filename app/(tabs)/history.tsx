import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { EmptyHistory } from '../../src/components/EmptyHistory';
import { HistoryItem } from '../../src/components/HistoryItem';
import { Input } from '../../src/components/Input';
import { ScanResultModal } from '../../src/components/ScanResultModal';
import { Colors } from '../../src/constants/colors';
import { Spacing } from '../../src/constants/spacing';
import { Typography } from '../../src/constants/typography';
import { HistoryItem as HistoryItemType, Storage } from '../../src/utils/storage';

export default function HistoryScreen() {
    const [history, setHistory] = useState<HistoryItemType[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<HistoryItemType[]>([]);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<HistoryItemType | null>(null);

    const loadHistory = useCallback(async () => {
        const data = await Storage.getHistory();
        setHistory(data);
        setFilteredHistory(data);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [loadHistory])
    );

    const handleSearch = (text: string) => {
        setSearch(text);
        if (!text) {
            setFilteredHistory(history);
        } else {
            const filtered = history.filter(item =>
                item.data.toLowerCase().includes(text.toLowerCase()) ||
                item.type.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredHistory(filtered);
        }
    };

    const handleDelete = async (id: string) => {
        await Storage.deleteItem(id);
        loadHistory(); // Reload to refresh list
    };

    const handleClearAll = () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all scan history? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: async () => {
                        await Storage.clearHistory();
                        loadHistory();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan History</Text>
                {history.length > 0 && (
                    <Button
                        title="Clear All"
                        variant="text"
                        onPress={handleClearAll}
                        textStyle={{ color: Colors.error }}
                    />
                )}
            </View>

            <View style={styles.searchContainer}>
                <Input
                    label=""
                    placeholder="Search history..."
                    value={search}
                    onChangeText={handleSearch}
                    iconName="search"
                    containerStyle={{ marginBottom: 0 }}
                />
            </View>

            <FlatList
                data={filteredHistory}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <HistoryItem
                        item={item}
                        onDelete={handleDelete}
                        onPress={setSelectedItem}
                    />
                )}
                ListEmptyComponent={<EmptyHistory />}
                contentContainerStyle={styles.listContent}
            />

            {/* Re-use ScanResultModal for details view */}
            <ScanResultModal
                visible={!!selectedItem}
                data={selectedItem?.data || ''}
                type={selectedItem?.type || ''}
                onClose={() => setSelectedItem(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.screenPadding,
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h1,
    },
    searchContainer: {
        paddingHorizontal: Spacing.screenPadding,
        marginBottom: Spacing.md,
    },
    listContent: {
        paddingBottom: Spacing.xxl + 20,
        paddingTop: Spacing.sm,
    },
});
