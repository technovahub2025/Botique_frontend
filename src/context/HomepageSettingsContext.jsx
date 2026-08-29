import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';

const HomepageSettingsContext = createContext();

export const HomepageSettingsProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await api.get('/homepage');
        if (res.data.success && res.data.sections) {
          setSections(res.data.sections);
        }
      } catch (err) {
        console.error('Failed to fetch homepage settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  const getSection = useMemo(
    () =>
      (key) => {
        const section = sections.find((s) => s && s.key === key);
        if (!section || !section.enabled) return {};
        return section.data || {};
      },
    [sections]
  );

  const isSectionEnabled = useMemo(
    () =>
      (key) => {
        const section = sections.find((s) => s && s.key === key);
        return section ? section.enabled !== false : true;
      },
    [sections]
  );

  const value = useMemo(
    () => ({
      sections,
      loading,
      getSection,
      isSectionEnabled,
    }),
    [sections, loading, getSection, isSectionEnabled]
  );

  return (
    <HomepageSettingsContext.Provider value={value}>
      {children}
    </HomepageSettingsContext.Provider>
  );
};

export const useHomepageSettings = () => {
  const context = useContext(HomepageSettingsContext);
  if (!context) {
    throw new Error('useHomepageSettings must be used within a HomepageSettingsProvider');
  }
  return context;
};

export default HomepageSettingsContext;
