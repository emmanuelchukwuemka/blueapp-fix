import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Checkbox, Avatar } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
    require('../../../assets/splash images/earn.jpg'),
    require('../../../assets/splash images/track.jpg'),
    require('../../../assets/splash images/redem.jpg'),
];

export default function RegisterScreen({ navigation }) {
    const { updateUser } = useUser();
    const [accountType, setAccountType] = useState('user');
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(false);
    const [image, setImage] = useState(null);

    // Slideshow Animation
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current; // Opacity of the current image

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
                // Fade in
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            });
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

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

    const handleRegister = () => {
        const registrationData = {
            name: accountType === 'partner' ? companyName : name,
            email,
            profileImage: image,
            type: accountType
        };
        updateUser(registrationData);
        navigation.navigate('Main');
    };

    return (
        <View style={styles.mainContainer}>
            {/* Background Slideshow */}
            <View style={styles.backgroundContainer}>
                <Animated.Image
                    source={BACKGROUND_IMAGES[currentImageIndex]}
                    style={[styles.backgroundImage, { opacity: fadeAnim }]}
                    resizeMode="cover"
                />
                {/* Next Image (Preloaded underneath for smoothness, though opaque fade works well enough for static bg) */}
                {/* For true crossfade we need two layers, but simple fade out/in effect with primary bg behind looks nice too */}
            </View>

            {/* Primary Color Overlay */}
            <View style={styles.overlay} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.headerContainer}>
                        <Text variant="headlineMedium" style={styles.headerTitle}>
                            {accountType === 'partner' ? 'Partner Registration' : 'Create Account'}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Join BluePoint today and start earning.
                        </Text>
                    </View>

                    <View style={styles.formCard}>
                        {/* Image Upload - Circular & Centered */}
                        <View style={styles.uploadContainer}>
                            <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
                                {image ? (
                                    <Avatar.Image size={100} source={{ uri: image }} style={{ backgroundColor: 'transparent' }} />
                                ) : (
                                    <View style={[styles.placeholderAvatar, { borderColor: accountType === 'partner' ? Colors.secondary : Colors.primary }]}>
                                        <Avatar.Icon
                                            size={60}
                                            icon={accountType === 'partner' ? "briefcase-plus" : "camera-plus"}
                                            style={{ backgroundColor: 'transparent' }}
                                            color={accountType === 'partner' ? Colors.secondary : Colors.primary}
                                        />
                                    </View>
                                )}
                                <View style={styles.editBadge}>
                                    <Avatar.Icon size={24} icon="pencil" style={{ backgroundColor: Colors.white }} color={Colors.text} />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.uploadText}>
                                {accountType === 'partner' ? 'Company Logo' : 'Profile Picture'}
                            </Text>
                        </View>

                        <SegmentedButtons
                            value={accountType}
                            onValueChange={setAccountType}
                            buttons={[
                                { value: 'user', label: 'User', icon: 'account' },
                                { value: 'partner', label: 'Partner', icon: 'briefcase' },
                            ]}
                            style={styles.segment}
                            theme={{ colors: { secondaryContainer: accountType === 'partner' ? Colors.secondary + '30' : Colors.primary + '30' } }}
                        />

                        {/* Form Inputs */}
                        <View style={styles.inputsContainer}>
                            {accountType === 'partner' ? (
                                <>
                                    <TextInput
                                        label="Company Name"
                                        value={companyName}
                                        onChangeText={setCompanyName}
                                        style={styles.input}
                                        mode="flat"
                                        underlineColor="transparent"
                                        activeUnderlineColor={Colors.secondary}
                                    />
                                    <TextInput
                                        label="Business Type"
                                        value={businessType}
                                        onChangeText={setBusinessType}
                                        style={styles.input}
                                        mode="flat"
                                        underlineColor="transparent"
                                        activeUnderlineColor={Colors.secondary}
                                    />
                                </>
                            ) : (
                                <TextInput
                                    label="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    style={styles.input}
                                    mode="flat"
                                    underlineColor="transparent"
                                    activeUnderlineColor={Colors.primary}
                                />
                            )}

                            <TextInput
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                mode="flat"
                                underlineColor="transparent"
                                keyboardType="email-address"
                                activeUnderlineColor={accountType === 'partner' ? Colors.secondary : Colors.primary}
                            />

                            <TextInput
                                label="Phone Number"
                                value={phone}
                                onChangeText={setPhone}
                                style={styles.input}
                                mode="flat"
                                underlineColor="transparent"
                                keyboardType="phone-pad"
                                activeUnderlineColor={accountType === 'partner' ? Colors.secondary : Colors.primary}
                            />

                            <TextInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                style={styles.input}
                                mode="flat"
                                underlineColor="transparent"
                                activeUnderlineColor={accountType === 'partner' ? Colors.secondary : Colors.primary}
                            />

                            <TextInput
                                label="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                                style={styles.input}
                                mode="flat"
                                underlineColor="transparent"
                                activeUnderlineColor={accountType === 'partner' ? Colors.secondary : Colors.primary}
                            />
                        </View>

                        <View style={styles.termsContainer}>
                            <Checkbox.Android
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => setChecked(!checked)}
                                color={accountType === 'partner' ? Colors.secondary : Colors.primary}
                            />
                            <TouchableOpacity onPress={() => setChecked(!checked)}>
                                <Text style={styles.termsText}>I agree to the Terms & Conditions</Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            style={[styles.button, { backgroundColor: accountType === 'partner' ? Colors.secondary : Colors.primary }]}
                            disabled={!checked}
                            contentStyle={{ paddingVertical: 8 }}
                        >
                            Create Account
                        </Button>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ alignItems: 'center', marginTop: 15 }}>
                            <Text style={{ color: Colors.textSecondary }}>Already have an account? <Text style={{ fontWeight: 'bold', color: accountType === 'partner' ? Colors.secondary : Colors.primary }}>Login</Text></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.primary, // Fallback
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000', // Behind images
    },
    backgroundImage: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.primary,
        opacity: 0.85, // Strong overlay as requested
    },
    scrollContent: {
        paddingTop: 80, // Moved down to avoid "too up"
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        color: Colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtitle: {
        color: Colors.white,
        opacity: 0.8,
        marginTop: 5,
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    uploadContainer: {
        alignItems: 'center',
        marginTop: -60, // Overlap the card top
        marginBottom: 20,
    },
    imageWrapper: {
        position: 'relative',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        borderRadius: 50, // Circular
    },
    placeholderAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    uploadText: {
        marginTop: 10,
        color: Colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    segment: {
        marginBottom: 20,
    },
    inputsContainer: {
        gap: 12,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderTopLeftRadius: 8, // Fix paper default
        borderTopRightRadius: 8, // Fix paper default
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    termsText: {
        color: Colors.text,
        fontSize: 13,
        marginLeft: 8,
    },
    button: {
        borderRadius: 12,
    }
});
