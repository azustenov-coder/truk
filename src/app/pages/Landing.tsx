import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Truck, Globe, Shield, Zap, ArrowRight, BarChart3, Users, Star } from 'lucide-react';

export function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Abstract Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-600/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Truck size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Logistik AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">{t('landing.features_nav', 'Features')}</a>
          <a href="#solutions" className="hover:text-white transition-colors">{t('landing.solutions_nav', 'Solutions')}</a>
          <a href="#about" className="hover:text-white transition-colors">{t('landing.about_nav', 'About')}</a>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all font-semibold"
        >
          {t('landing.portal_access')}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            {t('landing.hero_badge')}
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            {t('landing.hero_title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              {t('landing.hero_title_accent')}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
            {t('landing.hero_desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-500/25 flex items-center gap-2"
            >
              {t('landing.get_started')}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-lg border border-white/10 transition-all">
              {t('landing.view_demo')}
            </button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 relative"
        >
          <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full h-1/2 w-1/2 mx-auto"></div>
          <div className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-blue-500/10">
            <img 
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop" 
              alt="Logistik AI Dashboard"
              className="w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Globe className="text-blue-400" />}
            title={t('landing.features.global_title')}
            desc={t('landing.features.global_desc')}
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-400" />}
            title={t('landing.features.dispatch_title')}
            desc={t('landing.features.dispatch_desc')}
          />
          <FeatureCard 
            icon={<Shield className="text-green-400" />}
            title={t('landing.features.security_title')}
            desc={t('landing.features.security_desc')}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="text-4xl font-black mb-2">10k+</h3>
            <p className="text-gray-500 font-medium">{t('landing.stats.trucks')}</p>
          </div>
          <div>
            <h3 className="text-4xl font-black mb-2">500k+</h3>
            <p className="text-gray-500 font-medium">{t('landing.stats.deliveries')}</p>
          </div>
          <div>
            <h3 className="text-4xl font-black mb-2">99.9%</h3>
            <p className="text-gray-500 font-medium">{t('landing.stats.on_time')}</p>
          </div>
          <div>
            <h3 className="text-4xl font-black mb-2">24/7</h3>
            <p className="text-gray-500 font-medium">{t('landing.stats.support')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 max-w-7xl mx-auto text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold">Logistik AI</span>
        </div>
        <p className="text-gray-500 text-sm">© 2024 Logistik AI Logistics Solutions. {t('landing.footer')}</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}
