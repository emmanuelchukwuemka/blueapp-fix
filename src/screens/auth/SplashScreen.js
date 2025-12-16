import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        // Navigate to Onboarding after 2 seconds
        const timer = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.version}>v1.0.0</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface, // Changed to white/surface to match logo bg usually
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    version: {
        position: 'absolute',
        bottom: 50,
        color: Colors.textSecondary,
        opacity: 0.8,
    },
});
