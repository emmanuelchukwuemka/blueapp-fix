import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, Divider, Switch, Surface } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
    const { user } = useUser();
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const MenuItem = ({ icon, title, subtitle, onPress, showChevron = true, isDestructive = false }) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: isDestructive ? '#FFEBEE' : '#E3F2FD' }]}>
                    <MaterialCommunityIcons name={icon} size={22} color={isDestructive ? Colors.error : '#5B9FFF'} />
                </View>
                <View style={styles.menuContent}>
                    <Text variant="titleMedium" style={{ fontWeight: '500', color: isDestructive ? Colors.error : Colors.text }}>{title}</Text>
                    {subtitle && <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>{subtitle}</Text>}
                </View>
                {showChevron && <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.disabled} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Custom Header with Curve */}
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={[Colors.primary, '#0B0B5C']} // Deep blue gradient
                    style={styles.gradientHeader}
                >
                    <View style={styles.headerContent}>
                        <Text variant="headlineSmall" style={styles.headerTitle}>Profile</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                            <Surface style={styles.bellButton} elevation={0}>
                                <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.white} />
                                <View style={styles.notificationBadge} />
                            </Surface>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <View style={styles.curveMask} />
            </View>

            {/* Profile Info Card - Floats over header */}
            <View style={styles.profileCardWrapper}>
                <Surface style={styles.profileCard} elevation={3}>
                    <View style={styles.avatarRow}>
                        <View style={styles.avatarContainer}>
                            {user.profileImage ? (
                                <Avatar.Image size={80} source={{ uri: user.profileImage }} style={{ backgroundColor: Colors.surface }} />
                            ) : (
                                <Avatar.Text size={80} label={user.name ? user.name.substring(0, 2).toUpperCase() : 'BP'} style={{ backgroundColor: Colors.primary }} />
                            )}
                            <TouchableOpacity style={styles.editBadge} onPress={() => navigation.navigate('EditProfile')}>
                                <MaterialCommunityIcons name="pencil" size={16} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userInfo}>
                            <Text variant="headlineSmall" style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <View style={styles.roleBadge}>
                                <Text style={styles.roleText}>{user.type === 'partner' ? 'Partner Account' : 'User Account'}</Text>
                            </View>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    {/* Quick Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>2.4k</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>45</Text>
                            <Text style={styles.statLabel}>Done</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Redeemed</Text>
                        </View>
                    </View>
                </Surface>
            </View>

            {/* Menu Sections */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Account</Text>
                <Surface style={styles.menuCard} elevation={1}>
                    <MenuItem
                        icon="account-outline"
                        title="Personal Information"
                        subtitle="Change your account details"
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <Divider style={{ marginLeft: 50 }} />
                    <MenuItem
                        icon="shield-lock-outline"
                        title="Security"
                        subtitle="Password, 2FA, Biometrics"
                        onPress={() => navigation.navigate('Security')}
                    />
                </Surface>

                <Text style={styles.sectionTitle}>Preferences</Text>
                <Surface style={styles.menuCard} elevation={1}>
                    <View style={styles.menuItem}>
                        <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
                            <MaterialCommunityIcons name="theme-light-dark" size={22} color='#5B9FFF' />
                        </View>
                        <View style={styles.menuContent}>
                            <Text variant="titleMedium" style={{ fontWeight: '500' }}>Dark Mode</Text>
                        </View>
                        <Switch value={isDarkMode} onValueChange={setIsDarkMode} color={Colors.primary} />
                    </View>
                    <Divider style={{ marginLeft: 50 }} />
                    <MenuItem
                        icon="bell-ring-outline"
                        title="Notifications"
                        onPress={() => navigation.navigate('Notifications')}
                    />
                </Surface>

                <Text style={styles.sectionTitle}>Support</Text>
                <Surface style={styles.menuCard} elevation={1}>
                    <MenuItem
                        icon="help-circle-outline"
                        title="Help Center"
                        onPress={() => navigation.navigate('HelpCenter')}
                    />
                    <Divider style={{ marginLeft: 50 }} />
                    <MenuItem
                        icon="file-document-outline"
                        title="Terms & Privacy"
                        onPress={() => navigation.navigate('TermsPrivacy')}
                    />
                    <Divider style={{ marginLeft: 50 }} />
                    <MenuItem
                        icon="logout"
                        title="Log Out"
                        isDestructive
                        onPress={() => navigation.replace('Auth')}
                        showChevron={false}
                    />
                </Surface>

                <Text style={styles.versionText}>Version 1.0.0 • BluePoint</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerContainer: {
        height: 180,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'relative',
        zIndex: 1
    },
    gradientHeader: {
        flex: 1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: Spacing.l,
        paddingTop: 60,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    bellButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 12,
        position: 'relative'
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5252'
    },
    profileCardWrapper: {
        paddingHorizontal: Spacing.m,
        marginTop: -60, // Pull up to overlap header
        zIndex: 2,
        marginBottom: 20
    },
    profileCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 20,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5 // space for stats
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 15
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 4,
        borderWidth: 2,
        borderColor: Colors.white
    },
    userInfo: {
        flex: 1
    },
    userName: {
        fontWeight: 'bold',
        color: Colors.text,
        fontSize: 20
    },
    userEmail: {
        color: Colors.textSecondary,
        marginBottom: 8
    },
    roleBadge: {
        backgroundColor: '#E3F2FD',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6
    },
    roleText: {
        color: '#1565C0',
        fontSize: 10,
        fontWeight: 'bold'
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    statItem: {
        alignItems: 'center'
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.primary
    },
    statLabel: {
        color: Colors.textSecondary,
        fontSize: 12
    },
    verticalDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#F0F0F0'
    },
    sectionContainer: {
        paddingHorizontal: Spacing.m,
        paddingBottom: 40
    },
    sectionTitle: {
        marginVertical: 12,
        marginLeft: 4,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        fontSize: 14,
        textTransform: 'uppercase'
    },
    menuCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden'
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    menuContent: {
        flex: 1
    },
    versionText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        marginTop: 30,
        fontSize: 12
    }
});
