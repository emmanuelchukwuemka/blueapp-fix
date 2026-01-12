import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Animated, Alert } from 'react-native';
import { Text, Surface, Chip, Searchbar } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';

const CodeHistoryScreen = ({ navigation }) => {
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    useEffect(() => {
        const fetchCodes = async () => {
            setLoading(true);
            try {
                const params = {
                    page: page,
                    per_page: 10
                };
                
                const response = await apiService.getCodeHistory(params);
                const newCodes = response.codes || [];
                
                if (page === 1) {
                    setCodes(newCodes);
                } else {
                    setCodes(prev => [...prev, ...newCodes]);
                }
                
                setHasMore(newCodes.length === 10); // If we got 10 items, there might be more
            } catch (error) {
                console.error('Error fetching code history:', error);
                Alert.alert('Error', `Failed to load code history: ${error.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.isLoggedIn) {
            fetchCodes();
        }
    }, [user, page]);

    const filteredCodes = codes.filter(code =>
        code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (code.description && code.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const loadMore = () => {
        if (hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    };

    const CodeItem = ({ item, index }) => {
        const fadeAnim = useRef(new Animated.Value(0)).current;
        const slideAnim = useRef(new Animated.Value(20)).current;

        useEffect(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
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
                <Surface style={styles.card} elevation={1}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: item.status === 'used' ? '#FFEBEE' : '#E8F5E9' }]}>
                            <MaterialCommunityIcons
                                name={item.status === 'used' ? 'ticket-confirmation' : 'ticket-outline'}
                                size={24}
                                color={item.status === 'used' ? Colors.error : Colors.success}
                            />
                        </View>
                        <View style={styles.headerInfo}>
                            <Text variant="titleMedium" style={styles.cardTitle}>{item.code}</Text>
                            <Text variant="bodySmall" style={styles.metaText}>
                                {item.points_reward} points • {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={[styles.statusText, { 
                                color: item.status === 'used' ? Colors.error : Colors.success 
                            }]}>
                                {item.status === 'used' ? 'Redeemed' : 'Available'}
                            </Text>
                        </View>
                    </View>

                    {item.description && (
                        <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
                            {item.description}
                        </Text>
                    )}

                    <View style={styles.cardFooter}>
                        <Text style={styles.metaText}>
                            {item.status === 'used' ? 'Redeemed on ' + new Date(item.updated_at).toLocaleDateString() : 'Expires in 30 days'}
                        </Text>
                    </View>
                </Surface>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.headerTitle}>Code History</Text>
                <Text variant="bodyMedium" style={styles.headerSubtitle}>View your redeemed codes</Text>

                <Searchbar
                    placeholder="Search for codes..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor={Colors.primary}
                />

                <View style={styles.filterContainer}>
                    <Chip
                        selected={filter === 'All'}
                        onPress={() => setFilter('All')}
                        style={[styles.filterChip, filter === 'All' ? styles.activeChip : styles.inactiveChip]}
                        textStyle={[styles.chipText, filter === 'All' ? styles.activeChipText : styles.inactiveChipText]}
                    >
                        All
                    </Chip>
                    <Chip
                        selected={filter === 'Redeemed'}
                        onPress={() => setFilter('Redeemed')}
                        style={[styles.filterChip, filter === 'Redeemed' ? styles.activeChip : styles.inactiveChip]}
                        textStyle={[styles.chipText, filter === 'Redeemed' ? styles.activeChipText : styles.inactiveChipText]}
                    >
                        Redeemed
                    </Chip>
                    <Chip
                        selected={filter === 'Available'}
                        onPress={() => setFilter('Available')}
                        style={[styles.filterChip, filter === 'Available' ? styles.activeChip : styles.inactiveChip]}
                        textStyle={[styles.chipText, filter === 'Available' ? styles.activeChipText : styles.inactiveChipText]}
                    >
                        Available
                    </Chip>
                </View>
            </View>

            <FlatList
                data={filteredCodes}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={({ item, index }) => <CodeItem item={item} index={index} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="ticket-outline" size={64} color={Colors.disabled} />
                        <Text style={styles.emptyText}>No codes found.</Text>
                        <Text style={styles.emptySubtext}>Redeem codes to see them here</Text>
                    </View>
                }
            />
        </View>
    );
};

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
        marginBottom: 15,
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
    cardTitle: {
        fontWeight: 'bold',
        color: Colors.text
    },
    metaText: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2
    },
    statusBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 12
    },
    description: {
        color: Colors.textSecondary,
        marginBottom: 10,
        lineHeight: 18
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 12
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60
    },
    emptyText: {
        marginTop: 10,
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: 'bold'
    },
    emptySubtext: {
        marginTop: 5,
        color: Colors.textSecondary
    }
});

export default CodeHistoryScreen;