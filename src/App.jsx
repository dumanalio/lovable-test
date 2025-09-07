import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Trophy,
  Target,
  Code,
  Palette,
  Rocket,
  Menu,
  X
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import BuilderPage from './components/BuilderPage';
import { LogoProvider } from './contexts/LogoContext';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  useEffect(() => {
    const handler = () => setCurrentPage('builder');
    window.addEventListener('open-builder', handler);
    return () => window.removeEventListener('open-builder', handler);
  }, []);

  return (
    <LogoProvider>
      {currentPage === 'home' ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
          {/* Animated Background */}
          <motion.div
            className="fixed inset-0 opacity-30"
            style={{ y: backgroundY }}
          >
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </motion.div>

          <Navbar
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onAdminClick={() => setCurrentPage('admin')}
            onDashboardClick={() => setCurrentPage('dashboard')}
          />
          <main className="relative z-10">
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <CTA />
          </main>
          <Footer />
        </div>
      ) : currentPage === 'admin' ? (
        <AdminPanel onBackClick={() => setCurrentPage('home')} />
      ) : currentPage === 'dashboard' ? (
        <Dashboard onBackClick={() => setCurrentPage('home')} />
      ) : (
        <BuilderPage />
      )}
    </LogoProvider>
  );
}

export default App;
