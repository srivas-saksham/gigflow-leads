import { HomeNav } from '../components/home/HomeNav';
import { HeroSection } from '../components/home/HeroSection';
import { ContactSection } from '../components/home/ContactSection';
import { AboutSection } from '../components/home/AboutSection';
import { HomeFooter } from '../components/home/HomeFooter';

const Home = () => (
  <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
    <HomeNav />
    <HeroSection />
    <ContactSection />
    <AboutSection />
    <HomeFooter />
  </div>
);

export default Home;