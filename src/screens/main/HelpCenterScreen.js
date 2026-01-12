import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { List, Text } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HelpCenterScreen({ navigation }) {
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


            </List.Section>

            <TouchableOpacity style={styles.contactBtn} onPress={() => navigation.navigate('SupportTicket')} activeOpacity={0.8}>
                <View style={styles.contactContainer}>
                    <View style={styles.contactIcon}>
                        <MaterialCommunityIcons name="message-processing-outline" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.contactContent}>
                        <Text style={styles.contactTitle}>Contact Support</Text>
                        <Text style={styles.contactSubtitle}>Need more help? Create a support ticket</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                </View>
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
        padding: Spacing.l,
        alignItems: 'center',
        backgroundColor: Colors.surface
    },
    contactBtn: {
        margin: Spacing.m,
        borderRadius: 16,
        overflow: 'hidden'
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
    },
    contactIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    contactContent: {
        flex: 1
    },
    contactTitle: {
        fontWeight: 'bold',
        color: Colors.text,
        fontSize: 16,
        marginBottom: 4
    },
    contactSubtitle: {
        color: Colors.textSecondary,
        fontSize: 14
    }
});