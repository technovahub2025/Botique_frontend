import { useState } from 'react';
import Button from '../ui/Button';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

const Newsletter = ({ subtitle = 'Join our mailing list for exclusive previews and luxury fashion insights.' }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { getSection } = useHomepageSettings();
  const newsletter = getSection('newsletter');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-4">
            {newsletter.title || 'The Loom & Luster Letter'}
          </h2>
          <p className="text-gray-500 mb-6">{newsletter.description || subtitle}</p>

          {subscribed ? (
            <div className="text-center py-8">
              <p className="text-lg text-charcoal font-medium">
                Thank you for subscribing. A welcome note is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              {error && <p className="text-burgundy text-sm">{error}</p>}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
               <Button type="submit" variant="primary" size="md" className="whitespace-nowrap">
                 {newsletter.buttonText || 'Subscribe'}
               </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
