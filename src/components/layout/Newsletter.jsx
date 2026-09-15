import { useState } from 'react';
import Button from '../ui/Button';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

const Newsletter = ({
  subtitle = 'Join our mailing list for exclusive previews and luxury fashion insights.',
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { getSection } = useHomepageSettings();
  const newsletter = getSection('newsletter') || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch( 'https://botique-backend-k8f1.onrender.com/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to subscribe. Please try again.');
        return;
      }

      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Unable to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-4">
            {newsletter.title || 'The Loom & Luster Letter'}
          </h2>

          <p className="text-gray-500 mb-6">
            {newsletter.description || subtitle}
          </p>

          {subscribed ? (
            <div className="text-center py-8">
              <p className="text-lg text-charcoal font-medium">
                Thank you for subscribing. A welcome note is on its way.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full px-4 py-3 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-burgundy disabled:opacity-60"
                />

                {error && (
                  <p className="text-burgundy text-sm text-left mt-2">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="whitespace-nowrap"
              >
                {loading
                  ? 'Subscribing...'
                  : newsletter.buttonText || 'Subscribe'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;