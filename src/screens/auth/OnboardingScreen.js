import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Earn Points Daily',
        description: 'Complete simple tasks and earn points that you can redeem for exciting rewards.',
        image: require('../../../assets/splash images/earn.jpg'),
    },
    {
        id: '2',
        title: 'Track Your Progress',
        description: 'Monitor your achievements and see how close you are to your next reward.',
        image: require('../../../assets/splash images/track.jpg'),
    },
    {
        id: '3',
        title: 'Redeem & Enjoy',
        description: 'Exchange your points easily and enjoy the benefits of your hard work.',
        image: require('../../../assets/splash images/redem.jpg'),
    },
];

export default function OnboardingScreen({ navigation }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const ScrollNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.replace('Register');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={SLIDES}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <ImageBackground
                            source={item.image}
                            style={styles.backgroundImage}
                            imageStyle={{ opacity: 0.2 }} // Small opacity as requested
                        >
                            <View style={styles.contentContainer}>
                                <Image
                                    source={require('../../../assets/logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={flatListRef}
            />

            <View style={styles.footer}>
                <View style={styles.indicatorContainer}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                { backgroundColor: currentIndex === index ? Colors.primary : '#CCC', width: currentIndex === index ? 20 : 10 },
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    {currentIndex === SLIDES.length - 1 ? (
                        <Button mode="contained" onPress={() => navigation.replace('Register')} style={styles.button}>
                            Get Started
                        </Button>
                    ) : (
                        <Button mode="contained" onPress={ScrollNext} style={styles.button}>
                            Next
                        </Button>
                    )}
                    <TouchableOpacity onPress={() => navigation.replace('Login')}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    slide: {
        width,
        height: height, // Full height
    },
    backgroundImage: {
        width: width,
        height: height * 0.75, // Take up most of the screen
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * 0.25,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'transparent'
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    indicator: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonContainer: {
        alignItems: 'center',
        gap: 15
    },
    button: {
        width: '80%',
        paddingVertical: 5
    },
    skipText: {
        color: Colors.textSecondary
    }
});
