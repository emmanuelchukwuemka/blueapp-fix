import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, IconButton, Divider } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';

const mapApiNotificationToScreenNotification = (apiNotification) => {
    // Map API notification type to app notification type
    let type = 'info';
    if (apiNotification.type.includes('task')) type = 'success';
    else if (apiNotification.type.includes('reward') || apiNotification.type.includes('point')) type = 'success';
    else if (apiNotification.type.includes('error') || apiNotification.type.includes('warning')) type = 'warning';
    else if (apiNotification.type.includes('system')) type = 'info';
    
    return {
        id: apiNotification.id.toString(),
        title: apiNotification.title,
        message: apiNotification.message,
        time: new Date(apiNotification.created_at).toLocaleString(),
        type: type,
        read: apiNotification.is_read,
        notification: apiNotification // Store the full notification object for API operations
    };
};

export default function NotificationScreen({ navigation }) {
    const { user } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchNotifications();
    }, []);
    
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await apiService.getNotifications({ unread_only: false });
            const mappedNotifications = response.notifications.map(mapApiNotificationToScreenNotification);
            setNotifications(mappedNotifications);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to load notifications');
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await apiService.markNotificationAsRead(id);
            
            // Update the notification in the local state
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read: true, notification: response.notification } : n
            ));
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to mark notification as read');
        }
    };

    const deleteNotification = (id) => {
        // In a real app, you might want to call an API to delete the notification
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAllAsRead = async () => {
        try {
            await apiService.markAllNotificationsAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to mark all notifications as read');
        }
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text variant="headlineSmall" style={styles.title}>Notifications</Text>
                <IconButton icon="check-all" size={24} onPress={markAllAsRead} />
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
