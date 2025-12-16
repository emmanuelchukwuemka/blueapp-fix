import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Avatar, Text } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../context/UserContext';

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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {image ? (
                        <Avatar.Image size={100} source={{ uri: image }} />
                    ) : (
                        <Avatar.Text size={100} label={name ? name.substring(0, 2).toUpperCase() : 'BP'} />
                    )}
                </TouchableOpacity>
                <Button mode="text" onPress={pickImage}>Change Photo</Button>
            </View>

            <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
            />
            <TextInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
            />

            <Button mode="contained" onPress={handleSave} style={styles.button}>
                Save Changes
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: Spacing.m,
        backgroundColor: Colors.background,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: Spacing.l
    },
    input: {
        marginBottom: Spacing.m,
        backgroundColor: Colors.surface
    },
    button: {
        marginTop: Spacing.m
    }
});
