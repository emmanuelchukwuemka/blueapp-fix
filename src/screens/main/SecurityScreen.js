import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SecurityScreen({ navigation }) {
    const [biometrics, setBiometrics] = useState(false);
    const [twoFactor, setTwoFactor] = useState(true);
    const [loginAlerts, setLoginAlerts] = useState(true);

    const SecurityItem = ({ icon, title, subtitle, onPress, showToggle, value, onToggle }) => (
        <TouchableOpacity onPress={onPress} disabled={!!showToggle}>
            <View style={styles.itemContainer}>
                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                    <MaterialCommunityIcons name={icon} size={24} color="#5B9FFF" />
                </View>
                <View style={styles.itemContent}>
                    <Text variant="titleMedium" style={styles.itemTitle}>{title}</Text>
                    {subtitle && <Text variant="bodySmall" style={styles.itemSubtitle}>{subtitle}</Text>}
                </View>
                {showToggle ? (
                    <Switch value={value} onValueChange={onToggle} color={Colors.primary} />
                ) : (
                    <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.disabled} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={[Colors.primary, '#0B0B5C']}
                    style={styles.gradientHeader}
                >
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.white} />
                        </TouchableOpacity>
                        <Text variant="headlineSmall" style={styles.headerTitle}>Security Settings</Text>
                        <View style={{ width: 30 }} />
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.contentWrapper}>
                <Surface style={styles.card} elevation={1}>
                    <Text style={styles.sectionTitle}>Login Security</Text>

                    <SecurityItem
                        icon="shield-lock"
                        title="Change Password"
                        subtitle="Update your account password"
                        onPress={() => navigation.navigate('ChangePassword')}
                    />

                    <View style={styles.divider} />

                    <SecurityItem
                        icon="fingerprint"
                        title="Biometric Login"
                        subtitle="Use Fingerprint or FaceID"
                        showToggle
                        value={biometrics}
                        onToggle={setBiometrics}
                    />

                    <View style={styles.divider} />

                    <SecurityItem
                        icon="cellphone-key"
                        title="2-Factor Authentication"
                        subtitle="Detailed verification steps"
                        showToggle
                        value={twoFactor}
                        onToggle={setTwoFactor}
                    />
                </Surface>

                <Surface style={styles.card} elevation={1}>
                    <Text style={styles.sectionTitle}>Account Activity</Text>

                    <SecurityItem
                        icon="bell-alert"
                        title="Login Alerts"
                        subtitle="Notify me of new logins"
                        showToggle
                        value={loginAlerts}
                        onToggle={setLoginAlerts}
                    />

                    <View style={styles.divider} />

                    <SecurityItem
                        icon="devices"
                        title="Device Management"
                        subtitle="Manage logged in devices"
                        onPress={() => { }}
                    />
                </Surface>

                <Surface style={[styles.card, { backgroundColor: '#FFF0F0' }]} elevation={0}>
                    <SecurityItem
                        icon="delete-alert"
                        title="Delete Account"
                        subtitle="Permanently delete your data"
                        onPress={() => { }}
                    />
                </Surface>
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
        height: 150,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        zIndex: 1
    },
    gradientHeader: {
        flex: 1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: Spacing.m,
        paddingTop: 50,
        justifyContent: 'flex-start',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12
    },
    headerTitle: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 20
    },
    contentWrapper: {
        paddingHorizontal: Spacing.m,
        marginTop: -50,
        zIndex: 2,
        marginBottom: 20
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 16,
        marginLeft: 4
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    itemContent: {
        flex: 1
    },
    itemTitle: {
        fontWeight: '600',
        color: Colors.text,
        fontSize: 16
    },
    itemSubtitle: {
        color: Colors.textSecondary,
        fontSize: 12
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
        marginLeft: 60 // Align with text
    }
});
