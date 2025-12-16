import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, Avatar } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RedeemScreen({ navigation }) {
    const [points, setPoints] = useState('');
    const [code, setCode] = useState('');

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
                            <Text variant="headlineSmall" style={styles.headerTitle}>Redeemption</Text>
                            <Text style={styles.headerSubtitle}>Convert your hard-earned points</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Floating Balance Card */}
                <View style={styles.cardWrapper}>
                    <Surface style={styles.balanceCard} elevation={4}>
                        <LinearGradient
                            colors={[Colors.secondary, Colors.primary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientCard}
                        >
                            <ImageBackground
                                source={require('../../../assets/splash images/redem.jpg')}
                                imageStyle={{ opacity: 0.15 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <View>
                                <Text style={styles.balanceLabel}>Available for Redemption</Text>
                                <Text style={styles.balanceValue}>12,450 <Text style={styles.ptsUnit}>PTS</Text></Text>
                            </View>
                            <View style={styles.minBadge}>
                                <Text style={styles.minText}>Min. 1,000 pts</Text>
                            </View>
                        </LinearGradient>
                    </Surface>
                </View>

                {/* Redemption Form */}
                <View style={styles.section}>
                    <Surface style={styles.formCard} elevation={1}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                <MaterialCommunityIcons name="cash-fast" size={24} color={Colors.secondary} />
                            </View>
                            <Text variant="titleMedium" style={styles.cardTitle}>Withdraw Points</Text>
                        </View>

                        <TextInput
                            label="Points to redeem"
                            value={points}
                            onChangeText={setPoints}
                            mode="outlined"
                            keyboardType="number-pad"
                            style={styles.input}
                            outlineColor={Colors.border}
                            activeOutlineColor={Colors.primary}
                            right={<TextInput.Affix text="PTS" />}
                        />

                        <View style={styles.warningBox}>
                            <MaterialCommunityIcons name="information-outline" size={20} color={Colors.warning} />
                            <Text style={styles.warningText}>
                                Please ensure your bank details are updated on our <Text style={{ fontWeight: 'bold' }}>web portal</Text> before proceeding.
                            </Text>
                        </View>

                        <Button
                            mode="contained"
                            onPress={() => { }}
                            style={styles.submitBtn}
                            contentStyle={{ paddingVertical: 6 }}
                        >
                            Request Withdrawal
                        </Button>
                    </Surface>
                </View>

                {/* Gift Code Section */}
                <View style={styles.section}>
                    <Surface style={styles.formCard} elevation={1}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                                <MaterialCommunityIcons name="ticket-confirmation" size={24} color="#8E24AA" />
                            </View>
                            <Text variant="titleMedium" style={styles.cardTitle}>Have a Gift Code?</Text>
                        </View>

                        <Text style={styles.helperText}>Enter your special code to add points instantly to your balance.</Text>

                        <View style={styles.codeRow}>
                            <TextInput
                                placeholder="ENTER CODE"
                                value={code}
                                onChangeText={(text) => setCode(text.toUpperCase())}
                                mode="outlined"
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                outlineColor={Colors.border}
                                activeOutlineColor={Colors.primary}
                            />
                            <Button
                                mode="contained"
                                onPress={() => { }}
                                style={[styles.codeBtn, { backgroundColor: code ? Colors.primary : Colors.disabled }]}
                                disabled={!code}
                            >
                                Apply
                            </Button>
                        </View>
                    </Surface>
                </View>

                <View style={{ height: 40 }} />
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
        height: 180,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'relative',
        zIndex: 1
    },
    gradientHeader: {
        flex: 1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        justifyContent: 'center',
        paddingHorizontal: Spacing.l,
        paddingBottom: 20
    },
    headerContent: {
        alignItems: 'center'
    },
    headerTitle: {
        color: Colors.white,
        fontWeight: 'bold',
        marginBottom: 4
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14
    },
    cardWrapper: {
        marginTop: -50,
        paddingHorizontal: Spacing.m,
        zIndex: 2,
        marginBottom: 20
    },
    balanceCard: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    gradientCard: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 140
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        marginBottom: 5,
        textAlign: 'center'
    },
    balanceValue: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    ptsUnit: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    minBadge: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 10
    },
    minText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600'
    },
    section: {
        paddingHorizontal: Spacing.m,
        marginBottom: 16
    },
    formCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    cardTitle: {
        fontWeight: 'bold',
        color: Colors.text
    },
    input: {
        backgroundColor: Colors.white,
        marginBottom: 15,
        fontSize: 14
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF8E1',
        padding: 12,
        borderRadius: 8,
        alignItems: 'flex-start',
        marginBottom: 20
    },
    warningText: {
        color: '#F57C00',
        fontSize: 12,
        marginLeft: 10,
        flex: 1,
        lineHeight: 18
    },
    submitBtn: {
        borderRadius: 12,
        backgroundColor: Colors.primary
    },
    helperText: {
        color: Colors.textSecondary,
        marginBottom: 15,
        fontSize: 13,
        lineHeight: 18
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    codeBtn: {
        marginTop: 6, // Align with input
        borderRadius: 8,
        height: 50,
        justifyContent: 'center'
    }
});
