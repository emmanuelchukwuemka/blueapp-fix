import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Text } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';

export default function HelpCenterScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: Colors.primary }}>How can we help?</Text>
            </View>

            <List.Section>
                <List.Subheader>Frequently Asked Questions</List.Subheader>
                <List.Accordion
                    title="How do I earn points?"
                    left={props => <List.Icon {...props} icon="star-circle-outline" />}
                >
                    <List.Item title="Complete tasks in the 'Tasks' tab." titleNumberOfLines={2} />
                    <List.Item title="Watch ads or daily login." />
                </List.Accordion>

                <List.Accordion
                    title="When will I get my reward?"
                    left={props => <List.Icon {...props} icon="gift-outline" />}
                >
                    <List.Item title="Redemptions are processed within 24-48 hours." titleNumberOfLines={2} />
                </List.Accordion>

                <List.Accordion
                    title="How to update bank details?"
                    left={props => <List.Icon {...props} icon="bank-outline" />}
                >
                    <List.Item title="Please visit the MyFigPoint web app to manage bank settings." titleNumberOfLines={3} />
                </List.Accordion>
            </List.Section>

            <View style={styles.contact}>
                <Text style={{ textAlign: 'center', color: Colors.textSecondary }}>Still need help? Contact support@bluepoint.com</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: Spacing.l,
        alignItems: 'center',
        backgroundColor: Colors.surface
    },
    contact: {
        padding: Spacing.xl,
        marginTop: Spacing.l
    }
});
