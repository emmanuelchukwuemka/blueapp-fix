import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import apiService from '../../services/api';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    
    const handleSendCode = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }
        
        setLoading(true);
        try {
            await apiService.forgotPassword({ email });
            setStep(2);
            Alert.alert('Success', 'Password reset link sent to your email');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!code) {
            Alert.alert('Error', 'Please enter the verification code');
            return;
        }
        
        setLoading(true);
        try {
            // In the actual API, we would validate the code here
            // For now, we'll just proceed to the next step
            setStep(3);
        } catch (error) {
            Alert.alert('Error', error.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!newPassword || !confirmNewPassword) {
            Alert.alert('Error', 'Please enter new password and confirm it');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        
        setLoading(true);
        try {
            // Send the reset token and new password to the API
            await apiService.resetPassword({
                token: code, // In a real app, this would be the actual reset token
                password: newPassword
            });
            
            Alert.alert('Success', 'Password reset successfully', [
                { text: 'OK', onPress: () => navigation.replace('Login') }
            ]);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <Text variant="headlineMedium" style={styles.title}>
                {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify Code' : 'Reset Password'}
            </Text>
            <Text style={styles.subtitle}>
                {step === 1
                    ? 'Enter your email to receive a reset code.'
                    : step === 2
                        ? 'Enter the 6-digit code sent to your email.'
                        : 'Create a new password.'}
            </Text>

            {step === 1 && (
                <>
                    <TextInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="email-address"
                        disabled={loading}
                    />
                    <Button mode="contained" onPress={handleSendCode} style={styles.button} loading={loading} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Code'}
                    </Button>
                </>
            )}

            {step === 2 && (
                <>
                    <TextInput
                        label="6-Digit Code"
                        value={code}
                        onChangeText={setCode}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="number-pad"
                        maxLength={6}
                        disabled={loading}
                    />
                    <Button mode="contained" onPress={handleVerify} style={styles.button} loading={loading} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify'}
                    </Button>
                </>
            )}

            {step === 3 && (
                <>
                    <TextInput
                        label="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry
                        disabled={loading}
                    />
                    <TextInput
                        label="Confirm Password"
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry
                        disabled={loading}
                    />
                    <Button mode="contained" onPress={handleReset} style={styles.button} loading={loading} disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.m,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: Spacing.s,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: Spacing.xl,
        color: Colors.textSecondary,
    },
    input: {
        marginBottom: Spacing.m,
    },
    button: {
        marginTop: Spacing.s,
        paddingVertical: 6,
    },
});
