import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function TermsPrivacyScreen() {
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.m }}>
            <Text variant="headlineSmall" style={styles.header}>BLUEPOINT TERMS & CONDITIONS</Text>
            <Text style={[styles.text, { marginBottom: Spacing.m }]}>Last Updated: 26 December 2025</Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.title}>1. About BluePoint</Text>
                    <Text style={styles.text}>
                        BluePoint is a points-based distributor reward app designed exclusively for authorized distributors of Bluefig Healthcare Limited products.
                        {'\n'}It is not a general rewards platform or financial service.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>2. Eligibility & Access</Text>
                    <Text style={styles.text}>
                        Access is limited to authorized Bluefig Healthcare distributors.
                        {'\n\n'}Bluefig Healthcare Limited may approve, suspend, or revoke access at its discretion.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>3. Points System</Text>
                    <Text style={styles.text}>
                        Points are gained through approved distributor activities.
                        {'\n\n'}Points have no cash value.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>4. Use of Points</Text>
                    <Text style={styles.text}>
                        Points:
                        {'\n\n'}Are not cash
                        {'\n'}Are not cryptocurrency
                        {'\n'}Are not a payment method
                        {'\n'}Cannot be converted to cash
                        {'\n\n'}Points may be redeemed only for:
                        {'\n\n'}Product discounts
                        {'\n'}Branded company items (e.g. T-shirts, caps)
                        {'\n'}Approved gift items
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>5. Rewards & Redemption</Text>
                    <Text style={styles.text}>
                        Rewards are managed solely by Bluefig Healthcare Limited.
                        {'\n\n'}Submitting a redemption request does not guarantee approval.
                        {'\n\n'}Reward availability may change without notice.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>6. Prohibited Activities</Text>
                    <Text style={styles.text}>
                        Users must not:
                        {'\n\n'}Share or sell codes
                        {'\n'}Manipulate points
                        {'\n'}Use bots or fraudulent methods
                        {'\n'}Misrepresent distributor status
                        {'\n\n'}Violations may lead to suspension or termination.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>7. Account & Data</Text>
                    <Text style={styles.text}>
                        Users must keep accurate account details.
                        {'\n\n'}BluePoint does not collect financial or banking information.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>8. No Financial or Investment Services</Text>
                    <Text style={styles.text}>
                        BluePoint does not provide income, salary, investment, or financial services.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>9. App Changes</Text>
                    <Text style={styles.text}>
                        Bluefig Healthcare Limited may update, suspend, or discontinue features at any time.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>10. Limitation of Liability</Text>
                    <Text style={styles.text}>
                        Bluefig Healthcare Limited is not liable for:
                        {'\n\n'}Misuse of the app
                        {'\n'}Loss of points due to violations
                        {'\n'}Service interruptions
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>11. Termination</Text>
                    <Text style={styles.text}>
                        Accounts may be suspended or terminated if these terms are violated.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>12. Governing Law</Text>
                    <Text style={styles.text}>
                        These Terms are governed by the laws of the Federal Republic of Nigeria.
                    </Text>

                    <Text variant="titleMedium" style={styles.title}>13. Contact Information</Text>
                    <Text style={styles.text}>
                        Bluefig Healthcare Limited
                        {'\n'}📧 Email: distributors@bluefighealthcare.com
                        {'\n\n'}📍 Address: Kamola Plaza, 31 Okota Road, Isolo, Lagos, Nigeria
                    </Text>
                </Card.Content>
            </Card>

            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.title}>Privacy Policy</Text>
                        <Text style={styles.text}>
                            For our complete Privacy Policy, tap here to view it.
                        </Text>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
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
