'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I add my business to YK Buddy?',
    answer:
      'Send us an email at hello@ykbuddy.ca with your business details, including what you offer, your location, and any special features (like being Indigenous-owned). We support local businesses and are always excited to add new partners!',
  },
  {
    question: 'Can I contribute local knowledge?',
    answer:
      'Absolutely! We love hearing from locals. Share your favorite spots, insider tips, or corrections through the contact form or email. The more community knowledge we gather, the better YK Buddy becomes for everyone.',
  },
  {
    question: 'How do I report incorrect information?',
    answer:
      "Use the contact form below or email us at hello@ykbuddy.ca with details about what's wrong. We'll update it as quickly as possible. We're committed to keeping information accurate and current.",
  },
  {
    question: 'Do you have a newsletter or updates?',
    answer:
      'Yes! We send weekly updates about aurora forecasts, upcoming events, new activities, and community news. You can sign up for our newsletter through the website or by requesting it via email.',
  },
  {
    question: 'How can I support YK Buddy?',
    answer:
      "Share the platform with friends, leave feedback to help us improve, support our local partners, and spread the word! We're community-funded and every bit of support helps us continue serving Yellowknife.",
  },
];

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields (Name, Email, and Message)');
      return;
    }

    if (!formData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1000);
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
      {/* Top Navigation */}
      <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
        <Link
          href="/"
          className="text-gray-400 hover:text-aurora-green transition-colors text-sm flex items-center gap-2"
        >
          <span>←</span> Back to Home
        </Link>
        <LanguageSelector />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-7xl mb-6 animate-bounce">👋</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
            Let's Connect!
          </h1>
          <p className="text-xl text-gray-300">
            Questions? Suggestions? Found a dead link from 2012? We'd love to hear from you!
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Intro */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
            <p className="text-lg text-gray-300 leading-relaxed">
              YK Buddy is a community resource, and it gets better with your input. Whether you've
              spotted something wrong, have a great idea, or just want to say hi, we'd love to hear
              from you.
            </p>
          </section>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Email */}
            <a
              href="mailto:hello@ykbuddy.ca"
              className="bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-aurora-green/30 hover:border-aurora-green/50 transition-all group text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📧</div>
              <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
              <p className="text-sm text-gray-400 mb-2">Quick response</p>
              <p className="text-aurora-green text-sm font-mono">hello@ykbuddy.ca</p>
            </a>

            {/* Live Chat */}
            <button
              onClick={() => alert('Live chat feature coming soon!')}
              className="bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-aurora-blue/30 hover:border-aurora-blue/50 transition-all group text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💬</div>
              <h3 className="text-lg font-bold text-white mb-2">Live Chat</h3>
              <p className="text-sm text-gray-400 mb-2">Coming soon</p>
              <p className="text-aurora-blue text-sm">9 AM - 5 PM MST</p>
            </button>

            {/* Social Media */}
            <a
              href="https://instagram.com/ykbuddy"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-aurora-purple/20 to-aurora-purple/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-aurora-purple/30 hover:border-aurora-purple/50 transition-all group text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📱</div>
              <h3 className="text-lg font-bold text-white mb-2">Social Media</h3>
              <p className="text-sm text-gray-400 mb-2">Follow us</p>
              <p className="text-aurora-purple text-sm">@YKBuddy</p>
            </a>

            {/* Location */}
            <button
              onClick={() => alert("We're based in downtown Yellowknife!")}
              className="bg-gradient-to-br from-aurora-pink/20 to-aurora-pink/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-aurora-pink/30 hover:border-aurora-pink/50 transition-all group text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📍</div>
              <h3 className="text-lg font-bold text-white mb-2">Visit Us</h3>
              <p className="text-sm text-gray-400 mb-2">Downtown</p>
              <p className="text-aurora-pink text-sm">Yellowknife, NT</p>
            </button>
          </div>

          {/* Contact Form */}
          <section className="bg-gradient-to-br from-aurora-green/10 to-aurora-blue/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-aurora-green/30">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Send Us a Message</h2>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-aurora-green/20 border-2 border-aurora-green rounded-lg text-center">
                <p className="text-aurora-green font-semibold">
                  ✓ Message sent successfully! We'll get back to you within 24-48 hours.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                    Name <span className="text-aurora-green">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                    Email <span className="text-aurora-green">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                  Message <span className="text-aurora-green">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors resize-none"
                  placeholder="Tell us what's on your mind..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="text-xl">→</span>
                  </>
                )}
              </button>

              <p className="text-sm text-gray-400 text-center">
                * Required fields. We typically respond within 24-48 hours.
              </p>
            </form>
          </section>

          {/* FAQ Section */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    expandedFAQ === index
                      ? 'border-aurora-green bg-aurora-green/5'
                      : 'border-gray-700/50 hover:border-gray-600'
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white flex-1">{faq.question}</h3>
                    <span
                      className={`text-2xl font-bold transition-transform ${
                        expandedFAQ === index ? 'text-aurora-green rotate-45' : 'text-gray-500'
                      }`}
                    >
                      +
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFAQ === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-400 leading-relaxed border-t border-gray-700/50 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What to Contact About */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              What Can You Contact Us About?
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                <span className="text-2xl flex-shrink-0">🐛</span>
                <div>
                  <strong className="text-white">Bug Reports:</strong> Found something broken? Links
                  not working? Let us know!
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <strong className="text-white">Feature Ideas:</strong> Have an idea that would
                  make YK Buddy better? We're all ears.
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                <span className="text-2xl flex-shrink-0">📝</span>
                <div>
                  <strong className="text-white">Content Updates:</strong> Know about an event or
                  local tip that should be added? Share it!
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                <span className="text-2xl flex-shrink-0">🤝</span>
                <div>
                  <strong className="text-white">Partnerships:</strong> Run a local business? Let's
                  chat about how we can work together.
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors md:col-span-2">
                <span className="text-2xl flex-shrink-0">❤️</span>
                <div>
                  <strong className="text-white">Just Saying Hi:</strong> Seriously, we love hearing
                  from people who use YK Buddy. Your stories make this worthwhile.
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Notice */}
          <section className="bg-gradient-to-br from-red-500/20 to-red-500/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-500/30 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-400 mb-3">Emergency Services</h3>
            <p className="text-gray-300 leading-relaxed">
              For emergencies, dial <strong className="text-white">911</strong>. For non-emergency
              city services in Yellowknife, call <strong className="text-white">311</strong>.
            </p>
          </section>

          {/* Community Note */}
          <section className="bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-aurora-purple/30 text-center">
            <h3 className="text-xl font-bold text-white mb-3">
              Built by the Community, For the Community
            </h3>
            <p className="text-gray-300 leading-relaxed">
              YK Buddy exists because we believe Yellowknife deserves better digital resources.
              Every message, suggestion, and piece of feedback helps make this tool more useful for
              everyone. So thank you for taking the time to reach out. ❤️
            </p>
          </section>
        </div>

        {/* Styled Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Made with ❤️ in Yellowknife, Northwest Territories
            </p>
            <p className="text-xs text-gray-500">
              On the traditional territory of the Yellowknives Dene First Nation
            </p>
            <p className="text-xs text-gray-500 mt-2">© 2025 YK Buddy. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
