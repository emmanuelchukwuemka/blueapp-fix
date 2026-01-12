import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';

export default function PrivacyPolicyScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.m }}>
            <Text variant="headlineSmall" style={styles.header}>BLUEPOINT PRIVACY POLICY</Text>
            <Text style={[styles.text, { marginBottom: Spacing.m }]}>Last Updated: 26 December 2025</Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.text}>
                        This Privacy Policy explains how Bluefig Healthcare Limited collects, uses, and protects information when you use the BluePoint app.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>1. Information We Collect</Text>
                    <Text style={styles.text}>
                        User-provided information:
                        {'\n\n'}Name
                        {'\n'}Phone number or email
                        {'\n'}Distributor identification
                        {'\n\n'}Usage information:
                        {'\n\n'}Points balance
                        {'\n'}Code redemption activity
                        {'\n'}App interaction data
                        {'\n'}Device information (for security)
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>2. Information We Do NOT Collect</Text>
                    <Text style={styles.text}>
                        We do not collect:
                        {'\n\n'}Bank details
                        {'\n'}ATM or card information
                        {'\n'}CVV, PINs, or OTPs
                        {'\n'}Cryptocurrency wallet data
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>3. How We Use Information</Text>
                    <Text style={styles.text}>
                        We use data to:
                        {'\n\n'}Verify distributor status
                        {'\n'}Manage points and rewards
                        {'\n'}Provide support and app functionality
                        {'\n'}Improve system performance
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>4. Points & Rewards Data</Text>
                    <Text style={styles.text}>
                        Points are for participation tracking only.
                        {'\n\n'}Points have no cash value.
                        {'\n\n'}Rewards are managed internally by Bluefig Healthcare Limited.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>5. Data Sharing</Text>
                    <Text style={styles.text}>
                        We do not sell or trade user data.
                        Data may be shared only:
                        {'\n\n'}Internally within Bluefig Healthcare Limited
                        {'\n'}When required by law
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>6. Data Security</Text>
                    <Text style={styles.text}>
                        We apply reasonable security measures to protect user data, though no system is fully secure.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>7. Data Retention</Text>
                    <Text style={styles.text}>
                        Data is retained only as long as necessary for app operation or legal requirements.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>8. User Rights</Text>
                    <Text style={styles.text}>
                        Users may request:
                        {'\n\n'}Access to their data
                        {'\n'}Corrections
                        {'\n'}Account deactivation
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>9. Children's Privacy</Text>
                    <Text style={styles.text}>
                        BluePoint is intended for users 18 years and above.
                        {'\n\n'}We do not knowingly collect data from minors.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>10. Policy Updates</Text>
                    <Text style={styles.text}>
                        This Privacy Policy may be updated periodically. Continued use of the app implies acceptance.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>11. Contact Information</Text>
                    <Text style={styles.text}>
                        Bluefig Healthcare Limited
                        {'\n'}📧 Email: distributors@bluefighealthcare.com
                        {'\n\n'}📍 Address: Kamola Plaza, 31 Okota Road, Isolo, Lagos, Nigeria
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