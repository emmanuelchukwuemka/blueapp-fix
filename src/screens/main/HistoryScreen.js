import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Animated, Alert } from 'react-native';
import { Text, SegmentedButtons, Surface } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';

const ICON_COLOR = '#5B9FFF';

const mapTransactionToHistoryItem = (transaction) => {
    // Determine if it's a gain or redemption based on transaction type
    const isGain = ['earning', 'referral_bonus', 'code_redemption'].includes(transaction.type);
    
    // Determine icon based on transaction type
    let icon = 'cash';
    if (transaction.type === 'earning') icon = 'clipboard-text';
    else if (transaction.type === 'referral_bonus') icon = 'account-plus';
    else if (transaction.type === 'code_redemption') icon = 'ticket-confirmation';
    else if (transaction.type === 'point_withdrawal') icon = 'cash-remove';
    else if (transaction.type === 'deposit') icon = 'cash-plus';
    
    return {
        id: transaction.id.toString(),
        title: transaction.description,
        points: (isGain ? '+' : '-') + Math.abs(transaction.points_amount || 0),
        date: new Date(transaction.created_at).toLocaleString(),
        type: isGain ? 'gain' : 'redeem',
        icon: icon,
        transaction: transaction // Store the full transaction object for details
    };
};

const HistoryItem = ({ item, index, tab, navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 50,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 7,
                delay: index * 50,
                useNativeDriver: true,
            })
        ]).start();
    }, [tab]);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity onPress={() => {
                if (item.transaction) {
                    navigation.navigate('TransactionDetail', { transaction: item.transaction });
                } else {
                    navigation.navigate('TransactionDetail', { item });
                }
            }} activeOpacity={0.9}>
                <Surface style={styles.card} elevation={1}>
                    <View style={[styles.iconContainer, { backgroundColor: item.type === 'gain' ? '#E3F2FD' : '#FFEBEE' }]}>
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={24}
                            color={ICON_COLOR}
                        />
                    </View>
                    <View style={styles.contentContainer}>
                        <Text variant="titleMedium" style={styles.itemTitle}>{item.title}</Text>
                        <Text variant="bodySmall" style={styles.itemDate}>{item.date}</Text>
                    </View>
                    <Text
                        variant="titleMedium"
                        style={[
                            styles.points,
                            { color: item.type === 'gain' ? Colors.success : Colors.error }
                        ]}
                    >
                        {item.points}
                    </Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.disabled} style={{ marginLeft: 8 }} />
                </Surface>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function HistoryScreen({ navigation }) {
    const { user } = useUser();
    const [tab, setTab] = useState('gained');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const params = {};
                
                const response = await apiService.getHistory(params);
                const mappedTransactions = response.transactions.map(mapTransactionToHistoryItem);
                setTransactions(mappedTransactions);
            } catch (error) {
                Alert.alert('Error', error.message || 'Failed to load history');
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.isLoggedIn) {
            fetchTransactions();
        }
    }, [tab, user]);
    
    // Refresh data when coming back to the screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (user?.isLoggedIn) {
                const fetchTransactions = async () => {
                    setLoading(true);
                    try {
                        const params = {};
                        
                        const response = await apiService.getHistory(params);
                        const mappedTransactions = response.transactions.map(mapTransactionToHistoryItem);
                        setTransactions(mappedTransactions);
                    } catch (error) {
                        Alert.alert('Error', error.message || 'Failed to load history');
                        console.error('Error fetching transactions:', error);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchTransactions();
            }
        });
        
        return unsubscribe;
    }, [navigation, user]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.headerTitle}>History</Text>
                <Text variant="bodyMedium" style={styles.headerSubtitle}>Track your earnings and spendings</Text>
            </View>

            <View style={styles.tabsContainer}>
                <SegmentedButtons
                    value={tab}
                    onValueChange={setTab}
                    buttons={[
                        {
                            value: 'gained',
                            label: 'Points Gained',
                            showSelectedCheck: true,
                            checkedColor: Colors.white,
                            style: { backgroundColor: tab === 'gained' ? ICON_COLOR : 'transparent', borderColor: ICON_COLOR }
                        },
                        {
                            value: 'redeemed',
                            label: 'Redeemed',
                            showSelectedCheck: true,
                            checkedColor: Colors.white,
                            style: { backgroundColor: tab === 'redeemed' ? ICON_COLOR : 'transparent', borderColor: ICON_COLOR }
                        },
                    ]}
                    style={{ backgroundColor: Colors.white }} // Container background
                />
            </View>

            <FlatList
                data={transactions.filter(h => {
                    if (tab === 'gained') {
                        return ['earning', 'referral_bonus', 'code_redemption'].includes(h.transaction.type);
                    } else {
                        return ['point_withdrawal'].includes(h.transaction.type);
                    }
                })}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => <HistoryItem item={item} index={index} tab={tab} navigation={navigation} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="history" size={64} color={Colors.disabled} />
                        <Text style={styles.emptyText}>No history found.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC', // Slightly grey professional background
    },
    header: {
        padding: Spacing.l,
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingBottom: 30, // Make room for tabs overlap if we wanted, or just clean spacing
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
        color: Colors.textSecondary
    },
    tabsContainer: {
        paddingHorizontal: Spacing.m,
        marginBottom: Spacing.s
    },
    listContent: {
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.l
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        overflow: 'hidden'
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    contentContainer: {
        flex: 1,
    },
    itemTitle: {
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 2
    },
    itemDate: {
        color: Colors.textSecondary,
        fontSize: 12
    },
    points: {
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60
    },
    emptyText: {
        marginTop: 10,
        color: Colors.textSecondary
    }
});
