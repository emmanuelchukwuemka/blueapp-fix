import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChangePasswordScreen({ navigation }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleChangePassword = () => {
        // Mock successful change
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
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
                            <Text variant="headlineSmall" style={styles.headerTitle}>Change Password</Text>
                            <View style={{ width: 30 }} />
                        </View>
                    </LinearGradient>
                </View>

                {/* Form Card */}
                <View style={styles.contentWrapper}>
                    <Surface style={styles.card} elevation={2}>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons name="lock-reset" size={32} color={Colors.primary} />
                            </View>
                            <Text style={styles.helperText}>
                                Ensure your account is using a strong password.
                            </Text>
                        </View>

                        <TextInput
                            label="Current Password"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry={!showOldPass}
                            right={<TextInput.Icon icon={showOldPass ? "eye-off" : "eye"} onPress={() => setShowOldPass(!showOldPass)} />}
                            mode="outlined"
                            style={styles.input}
                            outlineColor={Colors.border}
                            activeOutlineColor={Colors.primary}
                        />

                        <TextInput
                            label="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPass}
                            right={<TextInput.Icon icon={showNewPass ? "eye-off" : "eye"} onPress={() => setShowNewPass(!showNewPass)} />}
                            mode="outlined"
                            style={styles.input}
                            outlineColor={Colors.border}
                            activeOutlineColor={Colors.primary}
                        />

                        <TextInput
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPass}
                            right={<TextInput.Icon icon={showConfirmPass ? "eye-off" : "eye"} onPress={() => setShowConfirmPass(!showConfirmPass)} />}
                            mode="outlined"
                            style={styles.input}
                            outlineColor={Colors.border}
                            activeOutlineColor={Colors.primary}
                        />

                        <View style={styles.requirementsBox}>
                            <Text style={styles.reqTitle}>Password Requirements:</Text>
                            <Text style={styles.reqItem}>• Minimum 8 characters</Text>
                            <Text style={styles.reqItem}>• At least one number</Text>
                            <Text style={styles.reqItem}>• At least one special character</Text>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleChangePassword}
                            style={styles.button}
                            contentStyle={{ paddingVertical: 8 }}
                        >
                            Update Password
                        </Button>
                    </Surface>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        borderRadius: 24,
        padding: 24,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    helperText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: 14
    },
    input: {
        backgroundColor: Colors.white,
        marginBottom: 16,
    },
    requirementsBox: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20
    },
    reqTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4
    },
    reqItem: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginLeft: 4
    },
    button: {
        borderRadius: 12,
        backgroundColor: Colors.primary
    }
});
