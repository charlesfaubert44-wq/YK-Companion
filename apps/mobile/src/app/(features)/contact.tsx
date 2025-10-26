import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

interface ContactMethod {
  icon: string;
  title: string;
  subtitle: string;
  action: () => void;
  color: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I add my business to YK Buddy?',
    answer: 'Send us an email at hello@ykbuddy.com with your business details. We support local businesses and Indigenous-owned enterprises.',
  },
  {
    question: 'Can I contribute local knowledge?',
    answer: 'Absolutely! We love hearing from locals. Share your favorite spots, tips, or corrections through the contact form or email.',
  },
  {
    question: 'How do I report incorrect information?',
    answer: 'Use the contact form below or email us at hello@ykbuddy.com. We\'ll update it as quickly as possible.',
  },
  {
    question: 'Do you have a newsletter?',
    answer: 'Yes! We send weekly updates about aurora forecasts, upcoming events, and new activities. Sign up on our website.',
  },
  {
    question: 'How can I support YK Buddy?',
    answer: 'Share the app with friends, leave a review, and support our local partners. We\'re community-funded!',
  },
];

export default function ContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const contactMethods: ContactMethod[] = [
    {
      icon: '📧',
      title: 'Email Us',
      subtitle: 'hello@ykbuddy.com',
      action: () => Linking.openURL('mailto:hello@ykbuddy.com'),
      color: '#10B981',
    },
    {
      icon: '💬',
      title: 'Live Chat',
      subtitle: 'Chat with our team',
      action: () => Alert.alert('Live Chat', 'Opening chat... (Feature coming soon!)'),
      color: '#3B82F6',
    },
    {
      icon: '📱',
      title: 'Social Media',
      subtitle: '@YKBuddy',
      action: () => Linking.openURL('https://instagram.com/ykbuddy'),
      color: '#EC4899',
    },
    {
      icon: '📍',
      title: 'Visit Us',
      subtitle: 'Yellowknife, NT',
      action: () => Alert.alert('Location', 'We\'re based in downtown Yellowknife!'),
      color: '#F59E0B',
    },
  ];

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
      'Thank you for contacting us! We\'ll get back to you within 24 hours.',
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

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>👋</Text>
          <Text style={styles.heroTitle}>Let's Connect!</Text>
          <Text style={styles.heroSubtitle}>
            We'd love to hear from you. Whether you have a question, suggestion,
            or just want to say hi—we're here!
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <View style={styles.methodsGrid}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.methodCard, { borderColor: method.color }]}
                onPress={method.action}
                activeOpacity={0.7}
              >
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Us a Message</Text>
          <View style={styles.formCard}>
            {/* Name Input */}
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

            {/* Email Input */}
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

            {/* Subject Input */}
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

            {/* Message Input */}
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

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Message</Text>
              <Text style={styles.submitButtonIcon}>→</Text>
            </TouchableOpacity>

            <Text style={styles.formNote}>
              * Required fields. We typically respond within 24 hours.
            </Text>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqCard}
              onPress={() => toggleFAQ(index)}
              activeOpacity={0.7}
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

        {/* Office Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Response Times</Text>
          <View style={styles.hoursCard}>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursEmoji}>📧</Text>
              <View style={styles.hoursContent}>
                <Text style={styles.hoursTitle}>Email</Text>
                <Text style={styles.hoursText}>Within 24 hours</Text>
              </View>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursEmoji}>💬</Text>
              <View style={styles.hoursContent}>
                <Text style={styles.hoursTitle}>Live Chat</Text>
                <Text style={styles.hoursText}>9 AM - 5 PM MST, Mon-Fri</Text>
              </View>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursEmoji}>📱</Text>
              <View style={styles.hoursContent}>
                <Text style={styles.hoursTitle}>Social Media</Text>
                <Text style={styles.hoursText}>Within 48 hours</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emergency Notice */}
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyIcon}>⚠️</Text>
          <Text style={styles.emergencyTitle}>Emergency Services</Text>
          <Text style={styles.emergencyText}>
            For emergencies, dial 911. For non-emergency city services in Yellowknife, call 311.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Made with ❤️ in Yellowknife
          </Text>
          <Text style={styles.footerSubtext}>
            We're here to make your Northern experience unforgettable!
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#10B981',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  // Hero Section
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
  // Sections
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
  // Contact Methods Grid
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
  // Form Card
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
  // FAQ Cards
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
  // Hours Card
  hoursCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    padding: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hoursEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  hoursContent: {
    flex: 1,
  },
  hoursTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  hoursText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // Emergency Card
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
  // Footer
  footerSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});
