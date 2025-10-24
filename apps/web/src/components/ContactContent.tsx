'use client';

export default function ContactContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">📮</div>
        <p className="text-lg text-gray-300">
          Questions? Suggestions? Found a dead link from 2012?
        </p>
      </div>

      {/* Intro */}
      <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
        <p className="text-base text-gray-300 leading-relaxed">
          YK Buddy is a community resource, and it gets better with your input. Whether you've spotted something wrong, have a great idea, or just want to say hi, we'd love to hear from you.
        </p>
      </section>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 backdrop-blur-sm rounded-xl p-6 border-2 border-aurora-green/30 hover:border-aurora-green/50 transition-all">
          <div className="text-3xl mb-3 text-center">✉️</div>
          <h2 className="text-xl font-bold text-white mb-2 text-center">Email Us</h2>
          <p className="text-gray-400 text-sm mb-3 text-center">
            The old-fashioned way (but it works)
          </p>
          <a
            href="mailto:hello@ykbuddy.ca"
            className="block text-aurora-green hover:text-aurora-blue transition-colors text-center font-mono text-base"
          >
            hello@ykbuddy.ca
          </a>
        </div>

        {/* Feedback Form */}
        <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 backdrop-blur-sm rounded-xl p-6 border-2 border-aurora-blue/30 hover:border-aurora-blue/50 transition-all">
          <div className="text-3xl mb-3 text-center">💬</div>
          <h2 className="text-xl font-bold text-white mb-2 text-center">Quick Feedback</h2>
          <p className="text-gray-400 text-sm mb-3 text-center">
            Got a quick suggestion?
          </p>
          <button className="w-full px-5 py-2 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-semibold rounded-lg hover:shadow-glow transition-all text-sm">
            Send Feedback
          </button>
        </div>
      </div>

      {/* What to Contact About */}
      <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-4 text-center">What Can You Contact Us About?</h2>
        <div className="space-y-3 text-gray-300 text-sm">
          <div className="flex gap-2">
            <span className="text-xl flex-shrink-0">🐛</span>
            <div>
              <strong className="text-white">Bug Reports:</strong> Found something broken? Links not working? Aurora forecast showing sunshine in January? Let us know!
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <strong className="text-white">Feature Ideas:</strong> Have an idea that would make YK Buddy better? We're all ears.
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xl flex-shrink-0">📝</span>
            <div>
              <strong className="text-white">Content Updates:</strong> Know about an event, garage sale, or local tip that should be added? Share it!
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xl flex-shrink-0">🤝</span>
            <div>
              <strong className="text-white">Partnerships:</strong> Run a local business or tourism operation? Let's chat about how we can work together.
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xl flex-shrink-0">❤️</span>
            <div>
              <strong className="text-white">Just Saying Hi:</strong> Seriously, we love hearing from people who use YK Buddy. Your stories make this worthwhile.
            </div>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center">
        <p className="text-sm text-gray-400">
          <strong className="text-gray-300">Response Time:</strong> We're not a huge team (read: it's just a few people who also have day jobs), but we typically respond within 24-48 hours. If it's urgent, please say so in the subject line.
        </p>
      </section>

      {/* Community Note */}
      <section className="bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 backdrop-blur-sm rounded-xl p-6 border-2 border-aurora-purple/30 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Built by the Community, For the Community</h3>
        <p className="text-gray-300 leading-relaxed text-sm">
          YK Buddy exists because we believe Yellowknife deserves better digital resources. Every message, suggestion, and piece of feedback helps make this tool more useful for everyone. So thank you for taking the time to reach out.
        </p>
      </section>
    </div>
  );
}
