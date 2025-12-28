import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Animated, Alert } from 'react-native';
import { Text, Surface, Chip, Searchbar, Button } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';

const mapApiTaskToScreenTask = (apiTask) => {
    // Map the API task status to the screen status
    let status = 'Available';
    if (apiTask.user_status === 'completed') status = 'Completed';
    else if (apiTask.user_status === 'in_progress') status = 'Pending';
    else if (apiTask.user_status === 'pending_review') status = 'Pending';
    else if (apiTask.user_status === 'rejected') status = 'Available'; // Task can be retried
    
    // Determine icon based on category
    let icon = 'clipboard-text';
    if (apiTask.category === 'Survey') icon = 'clipboard-list';
    else if (apiTask.category === 'Video') icon = 'play-circle';
    else if (apiTask.category === 'Daily') icon = 'calendar-today';
    else if (apiTask.category === 'Social') icon = 'share-variant';
    else if (apiTask.category === 'Referral') icon = 'account-multiple';
    
    return {
        id: apiTask.id.toString(),
        title: apiTask.title,
        points: apiTask.points_reward,
        type: apiTask.category,
        status: status,
        icon: icon,
        description: apiTask.description,
        time_required: apiTask.time_required,
        is_active: apiTask.is_active,
        requires_admin_verification: apiTask.requires_admin_verification,
        task: apiTask // Store the full task object for detail screen
    };
};

const FILTER_OPTIONS = ['All', 'Available', 'Completed', 'Pending'];
const ICON_COLOR = '#5B9FFF';

const TaskItem = ({ item, index, navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            delay: index * 100, // Stagger effect
            useNativeDriver: true,
        }).start();

        Animated.spring(slideAnim, {
            toValue: 0,
            friction: 6,
            tension: 40,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
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
        </Animated.View>
    );
};

export default function TasksScreen({ navigation }) {
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filter !== 'All' && filter !== 'Pending') {
                    // API doesn't have a direct filter for status, so we'll filter after
                    // If we need to filter by status, we'll do it in the UI
                }
                
                const response = await apiService.getTasks(params);
                const mappedTasks = response.tasks.map(mapApiTaskToScreenTask);
                setTasks(mappedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                Alert.alert('Error', `Failed to load tasks: ${error.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.isLoggedIn) {
            fetchTasks();
        }
    }, [filter, user]);

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filter === 'All' || task.status === filter)
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
                renderItem={({ item, index }) => <TaskItem item={item} index={index} navigation={navigation} />}
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
