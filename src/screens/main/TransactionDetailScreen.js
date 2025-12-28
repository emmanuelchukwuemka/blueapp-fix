import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { Text, Surface, Button, Divider, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../constants/colors';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';

export default function TransactionDetailScreen({ navigation, route }) {
    const { user } = useUser();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchTransaction = async () => {
            if (route.params.transaction) {
                // If transaction is already provided via route params
                setTransaction(route.params.transaction);
            } else if (route.params.item && route.params.item.transaction) {
                // If transaction is nested in item
                setTransaction(route.params.item.transaction);
            } else {
                // If only item is provided, try to get transaction details by ID
                const item = route.params.item;
                if (item && item.id) {
                    setLoading(true);
                    try {
                        const response = await apiService.getTransaction(item.id);
                        setTransaction(response.transaction);
                    } catch (error) {
                        Alert.alert('Error', error.message || 'Failed to load transaction details');
                        console.error('Error fetching transaction:', error);
                    } finally {
                        setLoading(false);
                    }
                }
            }
        };
        
        if (user?.isLoggedIn) {
            fetchTransaction();
        }
    }, [user, route.params]);
    
    const transactionData = transaction || route.params.item;
    const isGain = transactionData?.type === 'gain' || ['earning', 'referral_bonus', 'code_redemption'].includes(transactionData?.type);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my transaction on BluePoint: ${transactionData?.description || transactionData?.title} - ${transactionData?.points || (isGain ? '+' : '-') + Math.abs(transactionData?.points_amount || 0)} Points!`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading transaction details...</Text>
            </View>
        );
    }
    
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Button
                    icon="close"
                    mode="text"
                    textColor={Colors.text}
                    onPress={() => navigation.goBack()}
                    style={styles.closeBtn}
                >
                    Close
                </Button>
            </View>

            <Surface style={styles.receiptCard} elevation={2}>
                <View style={styles.iconWrapper}>
                    <Avatar.Icon
                        size={64}
                        icon={transactionData?.icon || (isGain ? "arrow-down-bold" : "arrow-up-bold")}
                        style={{ backgroundColor: isGain ? '#E8F5E9' : '#FFEBEE' }}
                        color={isGain ? Colors.success : Colors.error}
                    />
                </View>

                <Text variant="headlineMedium" style={[styles.amount, { color: isGain ? Colors.success : Colors.error }]}>
                    {transactionData?.points || (isGain ? '+' : '-') + Math.abs(transactionData?.points_amount || 0)}
                </Text>
                <Text variant="titleMedium" style={styles.status}>Success</Text>

                <Text variant="bodyMedium" style={styles.timestamp}>{transactionData?.date || new Date(transactionData?.created_at).toLocaleString()}</Text>

                <Divider style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Transaction Type</Text>
                    <Text style={styles.value}>{transactionData?.type?.replace('_', ' ') || (isGain ? 'Points Earned' : 'Points Redeemed')}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.value}>{transactionData?.description || transactionData?.title}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Reference ID</Text>
                    <Text style={styles.value}>#{(transactionData?.id || '').toString().padStart(8, '0')}</Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.actions}>
                    <Button
                        mode="outlined"
                        icon="share-variant"
                        onPress={handleShare}
                        style={styles.actionBtn}
                    >
                        Share Receipt
                    </Button>
                    <Button
                        mode="text"
                        textColor={Colors.error}
                        onPress={() => alert('Support feature coming soon!')}
                    >
                        Report an Issue
                    </Button>
                </View>
            </Surface>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        padding: Spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%'
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.m,
        zIndex: 1,
        alignItems: 'flex-start'
    },
    closeBtn: {
        marginLeft: -10
    },
    receiptCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: Spacing.l,
        alignItems: 'center',
        marginTop: 60
    },
    iconWrapper: {
        marginBottom: Spacing.m,
        marginTop: Spacing.s
    },
    amount: {
        fontWeight: 'bold',
        marginBottom: 4
    },
    status: {
        color: Colors.textSecondary,
        marginBottom: 8,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        color: Colors.success,
        overflow: 'hidden',
        fontWeight: 'bold'
    },
    timestamp: {
        color: Colors.textSecondary,
        marginBottom: Spacing.l
    },
    divider: {
        width: '100%',
        marginVertical: Spacing.m
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12
    },
    label: {
        color: Colors.textSecondary
    },
    value: {
        color: Colors.text,
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 20
    },
    actions: {
        width: '100%',
        marginTop: Spacing.s,
        gap: 10
    },
    actionBtn: {
        borderColor: Colors.border
    }
});