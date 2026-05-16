import { HomeNav } from '../components/home/HomeNav';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ContactSection } from '../components/home/ContactSection';
import { HomeFooter } from '../components/home/HomeFooter';

const Home = () => (
  <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
    <HomeNav />
    <HeroSection />
    <AboutSection />
    <HowItWorksSection />
    <ContactSection />
    <HomeFooter />
  </div>
);

export default Home;