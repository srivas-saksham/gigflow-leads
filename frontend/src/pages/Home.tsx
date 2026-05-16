import { HomeNav } from '../components/home/HomeNav';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { HowitWorksSection } from '../components/home/HowitWorksSection';
import { ContactSection } from '../components/home/ContactSection';
import { HomeFooter } from '../components/home/HomeFooter';

const Home = () => (
  <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
    <HomeNav />
    <HeroSection />
    <AboutSection />
    <HowitWorksSection />
    <ContactSection />
    <HomeFooter />
  </div>
);

export default Home;