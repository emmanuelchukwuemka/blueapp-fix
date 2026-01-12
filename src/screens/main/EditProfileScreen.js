import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, Alert } from 'react-native';
import { TextInput, Button, Avatar, Text, Surface } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function EditProfileScreen({ navigation }) {
    const { user, updateUser } = useUser();
    const [name, setName] = useState(user?.full_name || user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const [image, setImage] = useState(user?.profileImage);
    const [originalImage, setOriginalImage] = useState(user?.profileImage);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const pickImage = async (fromCamera = false) => {
        setImageLoading(true);
        try {
            let result;
            if (fromCamera) {
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            }

            if (!result.canceled) {
                // Save the image locally immediately after selection
                const localImagePath = await saveImageLocally(result.assets[0].uri);
                setImage(localImagePath);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        } finally {
            setImageLoading(false);
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Choose Photo',
            'Select an option',
            [
                { text: 'Take Photo', onPress: () => pickImage(true) },
                { text: 'Choose from Gallery', onPress: () => pickImage(false) },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }
        
        setLoading(true);
        try {
            const profileData = {
                full_name: name,
                phone,
            };
            
            // Update profile data on server
            const response = await apiService.updateProfile(profileData);
            
            // Handle image locally if it has changed
            let updatedUser = { ...response.user };
            if (image && originalImage && image !== originalImage) {
                // Save image locally and update user context with local image path
                const localImagePath = await saveImageLocally(image);
                updatedUser.profileImage = localImagePath;
            } else if (image && !originalImage) {
                // If user added a new image
                const localImagePath = await saveImageLocally(image);
                updatedUser.profileImage = localImagePath;
            } else if (!image && originalImage) {
                // If user removed the image
                updatedUser.profileImage = null;
            }
            
            // Update user context with the new data including local image
            updateUser(updatedUser);
            
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
    
    const saveImageLocally = async (imageUri) => {
        try {
            // Create a unique filename
            const filename = `profile_image_${Date.now()}.jpg`;
            const localFilePath = `${FileSystem.documentDirectory}${filename}`;
            
            // Copy image to local storage using legacy API
            await FileSystem.copyAsync({
                from: imageUri,
                to: localFilePath,
            });
            
            return localFilePath;
        } catch (error) {
            console.error('Error saving image locally:', error);
            // If saving locally fails, return the original URI
            return imageUri;
        }
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
                        <TouchableOpacity onPress={showImageOptions} style={styles.avatarContainer}>
                            {imageLoading ? (
                                <View style={styles.avatarLoadingContainer}>
                                    <Avatar.Image size={110} source={{ uri: image || '' }} style={{ backgroundColor: Colors.surface, opacity: 0.5 }} />
                                    <View style={styles.loadingOverlay}>
                                        <MaterialCommunityIcons name="progress-clock" size={30} color={Colors.primary} />
                                    </View>
                                </View>
                            ) : (
                                image ? (
                                    <Avatar.Image size={110} source={{ uri: image }} style={{ backgroundColor: Colors.surface }} />
                                ) : (
                                    <Avatar.Text size={110} label={name ? name.substring(0, 2).toUpperCase() : 'BP'} style={{ backgroundColor: Colors.primary }} />
                                )
                            )}
                            <Surface style={styles.editBadge} elevation={2}>
                                <MaterialCommunityIcons name="camera" size={20} color={Colors.primary} />
                            </Surface>
                        </TouchableOpacity>
                        <Text style={styles.changePhotoText}>Tap to change photo</Text>
                        {image && (
                            <TouchableOpacity onPress={() => {
                                Alert.alert(
                                    'Remove Photo',
                                    'Are you sure you want to remove your profile photo?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Remove', style: 'destructive', onPress: () => setImage(null) },
                                    ],
                                    { cancelable: true }
                                );
                            }} style={styles.removePhotoBtn}>
                                <Text style={styles.removePhotoText}>Remove Photo</Text>
                            </TouchableOpacity>
                        )}
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
                            editable={false} // Email should not be editable for security reasons
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
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
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
    avatarLoadingContainer: {
        position: 'relative',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 55, // half of size 110
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
    removePhotoBtn: {
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: Colors.error,
    },
    removePhotoText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
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
