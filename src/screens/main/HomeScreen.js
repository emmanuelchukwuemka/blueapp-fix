import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { Text, Surface, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

const ACTION_ICONS_COLOR = '#5B9FFF';

export default function HomeScreen({ navigation }) {
    const { user } = useUser();

    // Animation Values
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const slideCard = useRef(new Animated.Value(50)).current; // Start 50px down
    const fadeCard = useRef(new Animated.Value(0)).current;
    const slideActions = useRef(new Animated.Value(50)).current;
    const fadeActions = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(100, [
            Animated.timing(fadeHeader, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(fadeCard, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(slideCard, {
                    toValue: 0,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]),
            Animated.parallel([
                Animated.timing(fadeActions, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(slideActions, {
                    toValue: 0,
                    friction: 7,
                    useNativeDriver: true,
                })
            ])
        ]).start();
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section with Curve */}
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={[Colors.primary, '#0B0B5C']}
                    style={styles.gradientHeader}
                >
                    <Animated.View style={[styles.headerContent, { opacity: fadeHeader }]}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text variant="headlineMedium" style={styles.nameText}>
                                {user.name ? user.name.split(' ')[0] : 'User'}!
                            </Text>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.iconButton}>
                                <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.white} />
                                <View style={styles.badge} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
                                {user.profileImage ? (
                                    <Avatar.Image size={40} source={{ uri: user.profileImage }} />
                                ) : (
                                    <Avatar.Text size={40} label={user.name ? user.name.substring(0, 2).toUpperCase() : 'BP'} style={{ backgroundColor: Colors.secondary }} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </LinearGradient>
            </View>

            {/* Floating Points Card */}
            <View style={styles.cardContainer}>
                <Animated.View style={{ opacity: fadeCard, transform: [{ translateY: slideCard }] }}>
                    <Surface style={styles.pointsCard} elevation={4}>
                        <LinearGradient
                            colors={[Colors.primary, Colors.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientCard}
                        >
                            <ImageBackground
                                source={require('../../../assets/splash images/earn.jpg')}
                                imageStyle={{ opacity: 0.1 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.cardContent}>
                                <View>
                                    <Text style={styles.cardLabel}>Total Balance</Text>
                                    <Text style={styles.pointsValue}>12,450 <Text style={styles.ptsUnit}>PTS</Text></Text>
                                </View>
                                <View style={styles.refreshButton}>
                                    <MaterialCommunityIcons name="refresh" size={24} color="white" />
                                </View>
                            </View>
                            <View style={styles.cardFooter}>
                                <Text style={styles.footerText}>Updated just now</Text>
                                <View style={styles.levelBadge}>
                                    <MaterialCommunityIcons name="crown" size={14} color="#FFD700" style={{ marginRight: 4 }} />
                                    <Text style={styles.levelText}>Gold Member</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Surface>
                </Animated.View>
            </View>

            {/* Quick Actions */}
            <Animated.View style={[styles.section, { opacity: fadeActions, transform: [{ translateY: slideActions }] }]}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <QuickAction
                        icon="clipboard-check-outline"
                        label="Daily Tasks"
                        color="#E3F2FD"
                        iconColor={ACTION_ICONS_COLOR}
                        onPress={() => navigation.navigate('Tasks')}
                    />
                    <QuickAction
                        icon="gift-outline"
                        label="Redeem"
                        color="#FFF3E0"
                        iconColor="#FB8C00"
                        onPress={() => navigation.navigate('Redeem')}
                    />
                    <QuickAction
                        icon="history"
                        label="History"
                        color="#E8F5E9"
                        iconColor="#43A047"
                        onPress={() => navigation.navigate('History')}
                    />
                    <QuickAction
                        icon="ticket-percent-outline"
                        label="Use Code"
                        color="#F3E5F5"
                        iconColor="#8E24AA"
                        onPress={() => navigation.navigate('Redeem', { screen: 'Code' })}
                    />
                </View>
            </Animated.View>

            {/* Recent Activity */}
            <Animated.View style={[styles.section, { opacity: fadeActions, transform: [{ translateY: slideActions }] }]}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('History')}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.activityList}>
                    <ActivityCard
                        title="Daily Login"
                        subtitle="Reward for login"
                        points="+50"
                        isGain
                        time="10:00 AM"
                    />
                    <ActivityCard
                        title="Amazon Gift Card"
                        subtitle="Redeemed reward"
                        points="-500"
                        isGain={false}
                        time="Yesterday"
                    />
                    <ActivityCard
                        title="Profile Completion"
                        subtitle="One-time bonus"
                        points="+200"
                        isGain
                        time="Yesterday"
                    />
                </View>
            </Animated.View>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

const QuickAction = ({ icon, label, color, iconColor, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <Surface style={[styles.actionIcon, { backgroundColor: color }]} elevation={1}>
            <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
        </Surface>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const ActivityCard = ({ title, subtitle, points, isGain, time }) => (
    <Surface style={styles.activityCard} elevation={0}>
        <View style={[styles.activityIconContainer, { backgroundColor: isGain ? '#E8F5E9' : '#FFEBEE' }]}>
            <MaterialCommunityIcons
                name={isGain ? "arrow-down-bold" : "arrow-up-bold"}
                size={20}
                color={isGain ? Colors.success : Colors.error}
            />
        </View>
        <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>{title}</Text>
            <Text style={styles.activitySubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.activityRight}>
            <Text style={[styles.activityPoints, { color: isGain ? Colors.success : Colors.error }]}>
                {points}
            </Text>
            <Text style={styles.activityTime}>{time}</Text>
        </View>
    </Surface>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerContainer: {
        height: 160,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    gradientHeader: {
        flex: 1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: Spacing.l,
        paddingTop: 50,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '500'
    },
    nameText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    iconButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 12,
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5252'
    },
    profileButton: {
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        borderRadius: 22,
    },
    cardContainer: {
        marginTop: -60, // Pull up
        paddingHorizontal: Spacing.m,
        marginBottom: 20
    },
    pointsCard: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    gradientCard: {
        padding: 24,
        minHeight: 160,
        justifyContent: 'space-between'
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500'
    },
    pointsValue: {
        color: Colors.white,
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    ptsUnit: {
        fontSize: 16,
        fontWeight: '600'
    },
    refreshButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 50
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12
    },
    levelText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold'
    },
    section: {
        paddingHorizontal: Spacing.m,
        marginBottom: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text
    },
    viewAllText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14
    },
    actionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    actionItem: {
        alignItems: 'center',
        width: '23%',
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    actionLabel: {
        fontSize: 12,
        color: Colors.text,
        fontWeight: '500',
        textAlign: 'center'
    },
    activityList: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 10,
        elevation: 1
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: Colors.white,
        marginBottom: 0
    },
    activityIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    activityInfo: {
        flex: 1
    },
    activityTitle: {
        fontWeight: 'bold',
        color: Colors.text,
        fontSize: 14
    },
    activitySubtitle: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 2
    },
    activityRight: {
        alignItems: 'flex-end'
    },
    activityPoints: {
        fontWeight: 'bold',
        fontSize: 14
    },
    activityTime: {
        color: Colors.textSecondary,
        fontSize: 10,
        marginTop: 2
    }
});
