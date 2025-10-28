// YK Buddy - Contact Screen Demo for Expo Snack
// Copy this entire file to https://snack.expo.dev/

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const faqs = [
  {
    question: 'How do I add my business to YK Buddy?',
    answer: 'Send us an email at hello@ykbuddy.com with your business details.',
  },
  {
    question: 'Can I contribute local knowledge?',
    answer: 'Absolutely! Share your favorite spots through the contact form.',
  },
  {
    question: 'How do I report incorrect information?',
    answer: 'Email us at hello@ykbuddy.com and we\'ll update it quickly.',
  },
];

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    Alert.alert(
      'Message Sent! 🎉',
      'Thank you! We\'ll get back to you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
          },
        },
      ]
    );
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>👋</Text>
          <Text style={styles.heroTitle}>Let's Connect!</Text>
          <Text style={styles.heroSubtitle}>
            We'd love to hear from you. Whether you have a question or just want to say hi!
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <View style={styles.methodsGrid}>
            <TouchableOpacity
              style={[styles.methodCard, { borderColor: '#10B981' }]}
              onPress={() => Alert.alert('Email', 'Opening email... hello@ykbuddy.com')}
            >
              <Text style={styles.methodIcon}>📧</Text>
              <Text style={styles.methodTitle}>Email Us</Text>
              <Text style={styles.methodSubtitle}>hello@ykbuddy.com</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, { borderColor: '#3B82F6' }]}
              onPress={() => Alert.alert('Chat', 'Opening chat...')}
            >
              <Text style={styles.methodIcon}>💬</Text>
              <Text style={styles.methodTitle}>Live Chat</Text>
              <Text style={styles.methodSubtitle}>Chat with our team</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, { borderColor: '#EC4899' }]}
              onPress={() => Alert.alert('Social', '@YKBuddy')}
            >
              <Text style={styles.methodIcon}>📱</Text>
              <Text style={styles.methodTitle}>Social Media</Text>
              <Text style={styles.methodSubtitle}>@YKBuddy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, { borderColor: '#F59E0B' }]}
              onPress={() => Alert.alert('Location', 'Yellowknife, NT')}
            >
              <Text style={styles.methodIcon}>📍</Text>
              <Text style={styles.methodTitle}>Visit Us</Text>
              <Text style={styles.methodSubtitle}>Yellowknife, NT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Us a Message</Text>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#6B7280"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="What's this about?"
                placeholderTextColor="#6B7280"
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us what's on your mind..."
                placeholderTextColor="#6B7280"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Message</Text>
              <Text style={styles.submitButtonIcon}>→</Text>
            </TouchableOpacity>

            <Text style={styles.formNote}>
              * Required. We respond within 24 hours.
            </Text>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQ</Text>
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqCard}
              onPress={() => toggleFAQ(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqIcon}>{expandedFAQ === index ? '−' : '+'}</Text>
              </View>
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Notice */}
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyIcon}>⚠️</Text>
          <Text style={styles.emergencyTitle}>Emergency Services</Text>
          <Text style={styles.emergencyText}>
            For emergencies, dial 911. Non-emergency city services: 311.
          </Text>
        </View>

        {/* Demo Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>🎨 YK Buddy Contact Screen Demo</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
  },
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    color: '#FFFFFF',
    fontSize: 15,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#0A1128',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  submitButtonIcon: {
    color: '#0A1128',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 12,
  },
  faqIcon: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  faqAnswer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  emergencyCard: {
    margin: 20,
    marginTop: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 20,
    alignItems: 'center',
  },
  emergencyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  demoInfo: {
    padding: 8,
    marginBottom: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
  },
  demoText: {
    color: '#9CA3AF',
    fontSize: 11,
  },
});
