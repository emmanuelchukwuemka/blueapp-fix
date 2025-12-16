import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Surface, Chip, Searchbar, Button } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TASKS = [
    { id: '1', title: 'Daily Login Reward', points: 50, type: 'Daily', status: 'Available', icon: 'login', description: 'Log in daily to earn bonus points.' },
    { id: '2', title: 'Complete Profile Details', points: 200, type: 'One-time', status: 'Available', icon: 'account-details', description: 'Fill out your profile details to unlock more tasks.' },
    { id: '3', title: 'Share with Friends', points: 100, type: 'Referral', status: 'Pending', icon: 'share-variant', description: 'Invite your friends to join BluePoint.' },
    { id: '4', title: 'Watch Video Ad', points: 20, type: 'Video', status: 'Available', icon: 'play-circle', description: 'Watch a short video advertisement.' },
    { id: '5', title: 'Product Survey', points: 150, type: 'Survey', status: 'Completed', icon: 'clipboard-list', description: 'Complete a short survey about your preferences.' },
    { id: '6', title: 'Newsletter SignUp', points: 80, type: 'Social', status: 'Available', icon: 'email-plus', description: 'Subscribe to our newsletter for updates.' },
];

const FILTER_OPTIONS = ['All', 'Available', 'Completed', 'Pending'];
const ICON_COLOR = '#5B9FFF';

export default function TasksScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredTasks = TASKS.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filter === 'All' || task.status === filter)
    );

    const renderItem = ({ item }) => (
        <Surface style={styles.card} elevation={1} onPress={() => navigation.navigate('TaskDetail', { task: item })}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: item.status === 'Completed' ? '#E8F5E9' : '#E3F2FD' }]}>
                    <MaterialCommunityIcons
                        name={item.status === 'Completed' ? 'check-circle' : item.icon}
                        size={24}
                        color={item.status === 'Completed' ? Colors.success : ICON_COLOR}
                    />
                </View>
                <View style={styles.headerInfo}>
                    <View style={styles.typeRow}>
                        <Text style={styles.typeText}>{item.type}</Text>
                        {item.status === 'Pending' && <Text style={styles.pendingTag}>• Pending</Text>}
                    </View>
                    <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                </View>
                <View style={styles.pointsBadge}>
                    <Text style={styles.pointsValue}>+{item.points}</Text>
                </View>
            </View>

            <Text variant="bodySmall" style={styles.description} numberOfLines={2}>{item.description}</Text>

            <View style={styles.cardFooter}>
                <Text style={styles.metaText}>
                    {item.status === 'Completed' ? 'Completed today' : 'Expires in 24h'}
                </Text>

                {item.status !== 'Completed' && (
                    <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { task: item })}>
                        <View style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Start Task</Text>
                            <MaterialCommunityIcons name="arrow-right" size={16} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </Surface>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.headerTitle}>Available Tasks</Text>
                <Text variant="bodyMedium" style={styles.headerSubtitle}>Complete tasks to earn huge rewards</Text>

                <Searchbar
                    placeholder="Search for tasks..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor={Colors.primary}
                />

                <View style={styles.filterContainer}>
                    {FILTER_OPTIONS.map(f => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f)}
                            style={[
                                styles.filterChip,
                                filter === f ? styles.activeChip : styles.inactiveChip
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                filter === f ? styles.activeChipText : styles.inactiveChipText
                            ]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredTasks}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-off-outline" size={64} color={Colors.disabled} />
                        <Text style={styles.emptyText}>No tasks found.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        padding: Spacing.m,
        paddingTop: Spacing.xl + 10,
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        marginBottom: Spacing.m
    },
    headerTitle: {
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 4
    },
    headerSubtitle: {
        color: Colors.textSecondary,
        marginBottom: 15
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#F5F5F5',
        marginBottom: 15,
        height: 48,
        borderRadius: 12
    },
    searchInput: {
        minHeight: 0,
        fontSize: 14
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    activeChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    inactiveChip: {
        backgroundColor: 'transparent',
        borderColor: Colors.border,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600'
    },
    activeChipText: {
        color: Colors.white
    },
    inactiveChipText: {
        color: Colors.textSecondary
    },
    listContent: {
        padding: Spacing.m,
        paddingBottom: 40
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    headerInfo: {
        flex: 1
    },
    typeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2
    },
    typeText: {
        fontSize: 10,
        color: ICON_COLOR,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    pendingTag: {
        fontSize: 10,
        color: '#FFA000',
        marginLeft: 4
    },
    cardTitle: {
        fontWeight: 'bold',
        color: Colors.text
    },
    pointsBadge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    pointsValue: {
        fontWeight: 'bold',
        color: '#E65100',
        fontSize: 12
    },
    description: {
        color: Colors.textSecondary,
        marginBottom: 15,
        lineHeight: 18
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 12
    },
    metaText: {
        fontSize: 12,
        color: Colors.disabled,
        fontStyle: 'italic'
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    actionButtonText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 12,
        marginRight: 4
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60
    },
    emptyText: {
        marginTop: 10,
        color: Colors.textSecondary
    }
});
