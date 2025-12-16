import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

    const handleSendCode = () => {
        // Navigate to Verification or simulate sending code
        setStep(2);
    };

    const handleVerify = () => {
        setStep(3);
    };

    const handleReset = () => {
        navigation.replace('Login');
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
                    />
                    <Button mode="contained" onPress={handleSendCode} style={styles.button}>
                        Send Code
                    </Button>
                </>
            )}

            {step === 2 && (
                <>
                    <TextInput
                        label="6-Digit Code"
                        style={styles.input}
                        mode="outlined"
                        keyboardType="number-pad"
                        maxLength={6}
                    />
                    <Button mode="contained" onPress={handleVerify} style={styles.button}>
                        Verify
                    </Button>
                </>
            )}

            {step === 3 && (
                <>
                    <TextInput
                        label="New Password"
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry
                    />
                    <TextInput
                        label="Confirm Password"
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry
                    />
                    <Button mode="contained" onPress={handleReset} style={styles.button}>
                        Reset Password
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
