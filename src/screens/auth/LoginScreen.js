import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { useUser } from '../../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
    require('../../../assets/splash images/earn.jpg'),
    require('../../../assets/splash images/track.jpg'),
    require('../../../assets/splash images/redem.jpg'),
];

export default function LoginScreen({ navigation }) {
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const handleLogin = () => {
        // In a real app, validate and hit API
        login('Alex Doe'); // Mock login
        navigation.replace('Main');
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
                            Welcome Back
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Sign in to continue your journey.
                        </Text>
                    </View>

                    <View style={styles.formCard}>
                        {/* Logo - Circular & Centered */}
                        <View style={styles.logoContainer}>
                            <View style={styles.logoWrapper}>
                                <Avatar.Image size={80} source={require('../../../assets/logo.png')} style={{ backgroundColor: 'transparent' }} />
                            </View>
                        </View>

                        {/* Form Inputs */}
                        <View style={styles.inputsContainer}>
                            <TextInput
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                mode="flat"
                                underlineColor="transparent"
                                keyboardType="email-address"
                                activeUnderlineColor={Colors.primary}
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
                                activeUnderlineColor={Colors.primary}
                            />
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPass}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            style={styles.button}
                            contentStyle={{ paddingVertical: 8 }}
                        >
                            Login
                        </Button>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ alignItems: 'center', marginTop: 15 }}>
                            <Text style={{ color: Colors.textSecondary }}>Don't have an account? <Text style={{ fontWeight: 'bold', color: Colors.primary }}>Register</Text></Text>
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
        opacity: 0.85,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
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
    logoContainer: {
        alignItems: 'center',
        marginTop: -60, // Overlap
        marginBottom: 20,
    },
    logoWrapper: {
        backgroundColor: Colors.white,
        elevation: 5,
        borderRadius: 50,
        padding: 5,
    },
    inputsContainer: {
        gap: 12,
        marginTop: 10
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    forgotPass: {
        alignSelf: 'flex-end',
        marginVertical: 15,
    },
    forgotText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 13
    },
    button: {
        borderRadius: 12,
        backgroundColor: Colors.primary
    }
});
