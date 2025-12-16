import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VerificationScreen({ navigation, route }) {
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleVerify = () => {
        // Verify code logic here
        navigation.replace('Main');
    };

    const handleResend = () => {
        setTimeLeft(30);
        // Resend logic
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <Text variant="headlineMedium" style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to your phone/email.</Text>

            <TextInput
                label="OTP Code"
                value={code}
                onChangeText={(text) => {
                    setCode(text);
                    if (text.length === 6) {
                        // Auto verify could trigger here
                    }
                }}
                style={styles.input}
                mode="outlined"
                keyboardType="number-pad"
                maxLength={6}
            />

            <Button mode="contained" onPress={handleVerify} disabled={code.length < 6} style={styles.button}>
                Verify Account
            </Button>

            <View style={styles.resendContainer}>
                <Text variant="bodyMedium">Didn't receive code? </Text>
                {timeLeft > 0 ? (
                    <Text style={{ color: Colors.textSecondary }}>Resend in {timeLeft}s</Text>
                ) : (
                    <TouchableOpacity onPress={handleResend}>
                        <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Resend</Text>
                    </TouchableOpacity>
                )}
            </View>
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
        textAlign: 'center',
    },
    button: {
        marginTop: Spacing.s,
        paddingVertical: 6,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.l,
    },
});
