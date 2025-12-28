import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Clipboard } from 'react-native';
import { Text, Button, Surface, TextInput, Divider } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReferralScreen({ navigation }) {
  const { user } = useUser();
  const [referralStats, setReferralStats] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);

  useEffect(() => {
    fetchReferralStats();
    fetchReferralLink();
  }, []);

  const fetchReferralStats = async () => {
    setLoading(true);
    try {
      const response = await apiService.getReferralStats();
      setReferralStats(response);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load referral stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralLink = async () => {
    setLoadingLink(true);
    try {
      const response = await apiService.getReferralLink();
      setReferralLink(response.referral_link);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load referral link');
    } finally {
      setLoadingLink(false);
    }
  };

  const copyToClipboard = () => {
    if (referralLink) {
      Clipboard.setString(referralLink);
      Alert.alert('Success', 'Referral link copied to clipboard!');
    }
  };

  return (
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
            <Text variant="headlineSmall" style={styles.headerTitle}>Referral Program</Text>
            <View style={{ width: 30 }} />
          </View>
        </LinearGradient>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Surface style={styles.card} elevation={2}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons name="account-multiple" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>
                {referralStats?.referred_users_count || 0}
              </Text>
              <Text style={styles.statLabel}>Users Referred</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons name="cash-multiple" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>
                {referralStats?.total_referral_earnings || 0}
              </Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons name="gift" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>
                {referralStats?.total_referral_points || 0}
              </Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </View>
          </View>
        </Surface>
      </View>

      {/* Referral Link Section */}
      <View style={styles.section}>
        <Surface style={styles.card} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Your Referral Link</Text>
          
          <View style={styles.linkContainer}>
            <TextInput
              label="Your Referral Link"
              value={referralLink}
              mode="outlined"
              style={styles.linkInput}
              editable={false}
              right={
                <TextInput.Affix 
                  text={loadingLink ? 'Generating...' : 'Copy'} 
                  onPress={copyToClipboard}
                  disabled={loadingLink || !referralLink}
                />
              }
              onPressOut={copyToClipboard}
            />
          </View>
          
          <Text style={styles.helperText}>
            Share this link with friends. When they sign up using your link, 
            you'll earn points and rewards!
          </Text>
        </Surface>
      </View>

      {/* How It Works Section */}
      <View style={styles.section}>
        <Surface style={styles.card} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Share your referral link with friends</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>They sign up using your link</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>You earn points and rewards</Text>
            </View>
          </View>
        </Surface>
      </View>

      {/* Referral Benefits */}
      <View style={styles.section}>
        <Surface style={styles.card} elevation={2}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Referral Benefits</Text>
          
          <View style={styles.benefitContainer}>
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.benefitText}>Earn points for each successful referral</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.benefitText}>Bonus rewards for top referrers</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.benefitText}>Exclusive referral bonuses</Text>
            </View>
          </View>
        </Surface>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  headerContainer: {
    height: 150,
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
  section: {
    paddingHorizontal: Spacing.m,
    marginBottom: 16
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  divider: {
    height: 40,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  linkContainer: {
    marginBottom: 16,
  },
  linkInput: {
    backgroundColor: Colors.white,
  },
  helperText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepText: {
    color: Colors.text,
    fontSize: 14,
    flex: 1,
  },
  benefitContainer: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    color: Colors.text,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});