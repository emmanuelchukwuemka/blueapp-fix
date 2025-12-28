import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Surface, HelperText } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function SupportTicketScreen({ navigation }) {
  const { user } = useUser();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const ticketData = {
        subject,
        description,
        category,
      };

      await apiService.createSupportTicket(ticketData);

      Alert.alert(
        'Success',
        'Your support ticket has been submitted successfully. We will get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSubject('');
              setDescription('');
              setCategory('general');
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit support ticket');
    } finally {
      setLoading(false);
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
            <Text variant="headlineSmall" style={styles.headerTitle}>Support Ticket</Text>
            <Text style={styles.headerSubtitle}>Contact our support team</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.contentWrapper}>
        <Surface style={styles.formCard} elevation={2}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="ticket-confirmation" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.helperText}>
              Fill out the form below to submit a support ticket.
            </Text>
          </View>

          {/* Subject Input */}
          <TextInput
            label="Subject"
            value={subject}
            onChangeText={setSubject}
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
            error={!!errors.subject}
            left={<TextInput.Icon icon="text" color={Colors.textSecondary} />}
          />
          {errors.subject && (
            <HelperText type="error" style={styles.errorText}>
              {errors.subject}
            </HelperText>
          )}

          {/* Category Selection */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {[
              { value: 'general', label: 'General', icon: 'help-circle' },
              { value: 'technical', label: 'Technical', icon: 'cog' },
              { value: 'billing', label: 'Billing', icon: 'cash' },
              { value: 'account', label: 'Account', icon: 'account' },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.categoryOption,
                  category === item.value && styles.categoryOptionSelected,
                ]}
                onPress={() => setCategory(item.value)}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={category === item.value ? Colors.primary : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    category === item.value && styles.categoryTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description Input */}
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.textArea}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
            multiline
            numberOfLines={6}
            error={!!errors.description}
            left={<TextInput.Icon icon="comment-text" color={Colors.textSecondary} />}
          />
          {errors.description && (
            <HelperText type="error" style={styles.errorText}>
              {errors.description}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitBtn}
            contentStyle={{ paddingVertical: 8 }}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </Surface>
      </View>
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
    paddingHorizontal: Spacing.l,
    paddingTop: 50,
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center'
  },
  headerTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 20
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4
  },
  contentWrapper: {
    paddingHorizontal: Spacing.m,
    marginTop: -50,
    zIndex: 2,
    marginBottom: 20
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  helperText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 18
  },
  input: {
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  categoryTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    marginBottom: 12,
  },
  submitBtn: {
    borderRadius: 12,
    backgroundColor: Colors.primary,
    elevation: 2
  }
});