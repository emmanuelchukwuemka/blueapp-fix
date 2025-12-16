import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card, Divider, TextInput } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TaskDetailScreen({ navigation, route }) {
    const { task } = route.params || { task: { title: 'Sample Task', points: 100, description: 'Complete this task to earn points.' } };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>{task.title}</Text>
                <View style={styles.pointsBadge}>
                    <Text style={styles.pointsText}>+{task.points} PTS</Text>
                </View>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.text}>{task.description}</Text>
                    <Text style={styles.text}>Follow the steps below to complete the task and earn your reward.</Text>

                    <Divider style={{ marginVertical: Spacing.m }} />

                    <Text variant="titleMedium" style={styles.sectionTitle}>Requirements</Text>
                    <View style={styles.requirementItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.primary} />
                        <Text style={styles.reqText}>Step 1: Watch the full video.</Text>
                    </View>
                    <View style={styles.requirementItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.primary} />
                        <Text style={styles.reqText}>Step 2: Take a screenshot of the end screen.</Text>
                    </View>
                    <View style={styles.requirementItem}>
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.primary} />
                        <Text style={styles.reqText}>Step 3: Upload proof below.</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Submit Proof</Text>
                    <Button mode="outlined" icon="camera" onPress={() => { }} style={styles.uploadBtn}>
                        Upload Screenshot
                    </Button>

                    <TextInput
                        label="Add a comment (optional)"
                        mode="outlined"
                        style={{ marginTop: Spacing.m }}
                        multiline
                    />
                </Card.Content>
            </Card>

            <View style={styles.footer}>
                <Button mode="contained" onPress={() => navigation.goBack()} style={styles.submitBtn}>
                    Submit Task
                </Button>
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
        padding: Spacing.m,
        backgroundColor: Colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10
    },
    pointsBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16
    },
    pointsText: {
        color: Colors.success,
        fontWeight: 'bold'
    },
    card: {
        margin: Spacing.m,
        marginTop: 0,
        marginBottom: Spacing.m,
        backgroundColor: Colors.surface
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: Spacing.s
    },
    text: {
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 10
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    reqText: {
        marginLeft: 10,
        color: Colors.text
    },
    uploadBtn: {
        marginTop: Spacing.s,
        borderStyle: 'dashed'
    },
    footer: {
        padding: Spacing.m,
        paddingBottom: Spacing.xl
    },
    submitBtn: {
        paddingVertical: 6
    }
});
