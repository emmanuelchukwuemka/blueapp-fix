import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { TextInput, Button, Avatar, Text, Surface } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function EditProfileScreen({ navigation }) {
    const { user, updateUser } = useUser();
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [image, setImage] = useState(user.profileImage);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        updateUser({ name, email, phone, profileImage: image });
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <LinearGradient
                        colors={[Colors.primary, '#0B0B5C']}
                        style={styles.gradientHeader}
                    >
                        <View style={styles.headerContent}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.white} />
                            </TouchableOpacity>
                            <Text variant="headlineSmall" style={styles.headerTitle}>Edit Profile</Text>
                            <View style={{ width: 30 }} />
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.contentWrapper}>
                    {/* Avatar Upload */}
                    <View style={styles.avatarWrapper}>
                        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                            {image ? (
                                <Avatar.Image size={110} source={{ uri: image }} style={{ backgroundColor: Colors.surface }} />
                            ) : (
                                <Avatar.Text size={110} label={name ? name.substring(0, 2).toUpperCase() : 'BP'} style={{ backgroundColor: Colors.primary }} />
                            )}
                            <Surface style={styles.editBadge} elevation={2}>
                                <MaterialCommunityIcons name="camera" size={20} color={Colors.primary} />
                            </Surface>
                        </TouchableOpacity>
                        <Text style={styles.changePhotoText}>Tap to change photo</Text>
                    </View>

                    {/* Form Fields */}
                    <Surface style={styles.formCard} elevation={1}>
                        <TextInput
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            style={styles.input}
                            outlineColor={Colors.border}
                            activeOutlineColor={Colors.primary}
                            left={<TextInput.Icon icon="account" color={Colors.textSecondary} />}
                        />
                        <TextInput
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
                            style={styles.input}
                            outlineColor={Colors.border}
                            activeOutlineColor={Colors.primary}
                            keyboardType="email-address"
                            left={<TextInput.Icon icon="email" color={Colors.textSecondary} />}
                        />
                        <TextInput
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            mode="outlined"
                            style={styles.input}
                            outlineColor={Colors.border}
                            activeOutlineColor={Colors.primary}
                            keyboardType="phone-pad"
                            left={<TextInput.Icon icon="phone" color={Colors.textSecondary} />}
                        />

                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.saveBtn}
                            contentStyle={{ paddingVertical: 8 }}
                            icon="content-save-outline"
                        >
                            Save Changes
                        </Button>
                    </Surface>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerContainer: {
        height: 150, // Slightly shorter for sub-screens
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        zIndex: 1
    },
    gradientHeader: {
        flex: 1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: Spacing.m,
        paddingTop: 50,
        justifyContent: 'flex-start',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12
    },
    headerTitle: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 20
    },
    contentWrapper: {
        paddingHorizontal: Spacing.m,
        marginTop: -50,
        zIndex: 2,
        marginBottom: 20
    },
    avatarWrapper: {
        alignItems: 'center',
        marginBottom: 20
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 8,
    },
    changePhotoText: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontWeight: '600'
    },
    formCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
    },
    input: {
        backgroundColor: Colors.white,
        marginBottom: 16,
    },
    saveBtn: {
        marginTop: 10,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        elevation: 2
    }
});
