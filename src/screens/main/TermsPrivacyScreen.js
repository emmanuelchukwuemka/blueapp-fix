import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';

export default function TermsPrivacyScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.m }}>
            <Text variant="headlineSmall" style={styles.header}>Terms & Privacy</Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.title}>1. Terms of Service</Text>
                    <Text style={styles.text}>
                        By using BluePoint, you agree to follow our community guidelines. Points have no cash value and are used solely for rewards within the platform.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>2. Privacy Policy</Text>
                    <Text style={styles.text}>
                        We value your privacy. Your data is encrypted and never shared with third parties without consent. We collect minimal data required for account management.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>3. User Responsibilities</Text>
                    <Text style={styles.text}>
                        Users are responsible for maintaining the confidentiality of their account credentials.
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        fontWeight: 'bold',
        marginBottom: Spacing.m,
        color: Colors.primary
    },
    card: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.l
    },
    title: {
        fontWeight: 'bold',
        marginTop: Spacing.m,
        marginBottom: Spacing.s
    },
    text: {
        color: Colors.textSecondary,
        lineHeight: 20
    }
});
