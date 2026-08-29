import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { SettingsProvider } from '../context/SettingsContext';

const MainLayout = () => {
  return (
    <SettingsProvider>
      <div className="min-h-screen flex flex-col bg-ivory">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SettingsProvider>
  );
};

export default MainLayout;
