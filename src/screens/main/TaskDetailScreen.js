import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Card, Divider, TextInput, Surface } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function TaskDetailScreen({ navigation, route }) {
    const { task } = route.params || { task: { title: 'Sample Task', points: 100, description: 'Complete this task to earn points.' } };
    const [image, setImage] = useState(null);
    const [comment, setComment] = useState('');

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!image) {
            Alert.alert("Proof Required", "Please upload a screenshot to verify your task completion.");
            return;
        }

        // Mock submission
        Alert.alert("Success", "Task submitted! Points will be credited after review.", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>{task.title}</Text>
                <View style={styles.pointsBadge}>
                    <Text style={styles.pointsText}>+{task.points} PTS</Text>
                </View>
            </View>

            <Surface style={styles.card} elevation={1}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
                <Text style={styles.text}>{task.description}</Text>
                <Text style={styles.text}>Follow the steps below to complete the task and earn your reward.</Text>

                <Divider style={{ marginVertical: Spacing.m }} />

                <Text variant="titleMedium" style={styles.sectionTitle}>Requirements</Text>
                <View style={styles.requirementItem}>
                    <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.primary} />
                    <Text style={styles.reqText}>Step 1: Perform the required action.</Text>
                </View>
                <View style={styles.requirementItem}>
                    <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.primary} />
                    <Text style={styles.reqText}>Step 2: Take a clear screenshot.</Text>
                </View>
                <View style={styles.requirementItem}>
                    <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.primary} />
                    <Text style={styles.reqText}>Step 3: Upload proof below.</Text>
                </View>
            </Surface>

            <Surface style={styles.card} elevation={1}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Submit Proof</Text>

                {image ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                        <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
                            <MaterialCommunityIcons name="close-circle" size={24} color={Colors.error} />
                        </TouchableOpacity>
                        <Button mode="text" onPress={pickImage} style={{ marginTop: 8 }}>Change Image</Button>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.uploadPlaceholder} onPress={pickImage}>
                        <MaterialCommunityIcons name="cloud-upload-outline" size={48} color={Colors.primary} />
                        <Text style={styles.uploadText}>Tap to Upload Screenshot</Text>
                    </TouchableOpacity>
                )}

                <TextInput
                    label="Add a comment (optional)"
                    mode="outlined"
                    style={{ marginTop: Spacing.m, backgroundColor: 'white' }}
                    multiline
                    numberOfLines={3}
                    value={comment}
                    onChangeText={setComment}
                    activeOutlineColor={Colors.primary}
                />
            </Surface>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitBtn}
                    contentStyle={{ paddingVertical: 6 }}
                >
                    Submit Task
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        padding: Spacing.m,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    title: {
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
        color: Colors.text
    },
    pointsBadge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16
    },
    pointsText: {
        color: '#E65100',
        fontWeight: 'bold'
    },
    card: {
        margin: Spacing.m,
        marginTop: Spacing.m,
        marginBottom: 0,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: Spacing.s,
        color: Colors.text
    },
    text: {
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 8
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    reqText: {
        marginLeft: 10,
        color: Colors.text,
        fontSize: 13
    },
    uploadPlaceholder: {
        height: 150,
        borderWidth: 2,
        borderColor: '#E3F2FD',
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FAFE'
    },
    uploadText: {
        marginTop: 10,
        color: Colors.primary,
        fontWeight: '600'
    },
    imagePreviewContainer: {
        alignItems: 'center',
        position: 'relative'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        resizeMode: 'cover'
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 12
    },
    footer: {
        padding: Spacing.m,
        paddingBottom: Spacing.xl
    },
    submitBtn: {
        borderRadius: 12,
        backgroundColor: Colors.primary
    }
});
