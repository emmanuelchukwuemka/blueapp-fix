import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, IconButton, Divider } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NOTIFICATIONS = [
    { id: '1', title: 'Task Approved', message: 'Your "Daily Login" task has been approved. +50 PTS.', time: '2 mins ago', type: 'success', read: false },
    { id: '2', title: 'New Reward Available', message: 'Check out the new Gift Cards in the Redeem section!', time: '2 hours ago', type: 'info', read: true },
    { id: '3', title: 'Redemption Processed', message: 'Your request for 500 PTS redemption was successful.', time: '1 day ago', type: 'success', read: true },
    { id: '4', title: 'System Maintenance', message: 'App will be down for maintenance on Sunday 2am.', time: '2 days ago', type: 'warning', read: true },
];

export default function NotificationScreen({ navigation }) {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text variant="headlineSmall" style={styles.title}>Notifications</Text>
                <IconButton icon="check-all" size={24} onPress={() => setNotifications(notifications.map(n => ({ ...n, read: true })))} />
            </View>

            <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card style={[styles.card, !item.read && styles.unreadCard]} onPress={() => markAsRead(item.id)}>
                        <Card.Content style={styles.cardContent}>
                            <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) }]}>
                                <MaterialCommunityIcons name={getIconName(item.type)} size={24} color="white" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text variant="titleMedium" style={{ fontWeight: item.read ? 'normal' : 'bold' }}>{item.title}</Text>
                                <Text variant="bodyMedium" numberOfLines={2} style={styles.message}>{item.message}</Text>
                                <Text variant="bodySmall" style={styles.time}>{item.time}</Text>
                            </View>
                            <IconButton icon="close" size={16} onPress={() => deleteNotification(item.id)} />
                        </Card.Content>
                    </Card>
                )}
                contentContainerStyle={{ padding: Spacing.m }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialCommunityIcons name="bell-off-outline" size={64} color={Colors.textSecondary} />
                        <Text style={{ marginTop: 10, color: Colors.textSecondary }}>No notifications</Text>
                    </View>
                }
            />
        </View>
    );
}

function getIconColor(type) {
    switch (type) {
        case 'success': return Colors.success;
        case 'error': return Colors.error;
        case 'warning': return Colors.warning;
        default: return Colors.info;
    }
}

function getIconName(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'alert-circle';
        case 'warning': return 'alert';
        default: return 'information';
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Spacing.l,
        paddingHorizontal: Spacing.s,
        backgroundColor: Colors.surface,
        elevation: 2,
        justifyContent: 'space-between'
    },
    title: {
        fontWeight: 'bold',
        color: Colors.primary
    },
    card: {
        marginBottom: Spacing.s,
        backgroundColor: Colors.surface,
    },
    unreadCard: {
        backgroundColor: '#E3F2FD'
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m
    },
    textContainer: {
        flex: 1
    },
    message: {
        color: Colors.text,
        marginTop: 2
    },
    time: {
        color: Colors.textSecondary,
        marginTop: 4
    },
    empty: {
        alignItems: 'center',
        marginTop: 100
    }
});
