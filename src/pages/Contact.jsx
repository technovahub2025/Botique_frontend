import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { email: settingsEmail, phone: settingsPhone, address: settingsAddress } = useSettings();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: settingsEmail },
    { icon: Phone, label: 'Phone', value: settingsPhone },
    { icon: MapPin, label: 'Address', value: settingsAddress },
  ];

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <Send className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-4">Thank You!</h2>
          <p className="text-gray-600">
            Your message has been sent. We'll get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <h1 className="text-3xl font-heading font-bold mb-6 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <p className="text-gray-600">
            Have a question about an order, a product inquiry, or just want to say hello?
            We'd love to hear from you.
          </p>
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-burgundy mt-0.5" />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-gray-600">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-charcoal text-ivory py-2 rounded-md font-medium hover:bg-deep-brown transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
