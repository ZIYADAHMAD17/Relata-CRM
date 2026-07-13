import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart3, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background bg-aurora flex flex-col items-center w-full">
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Relata</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link to="/register" className="bg-white/10 hover:bg-white/20 text-foreground border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-20 mb-32 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Introducing Relata 1.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Build Better <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Relationships.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            The premium personal relationship intelligence platform. Combine CRM, tasks, meetings, and analytics into one beautiful ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1">
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 glass-panel text-foreground">
              Book a demo
            </button>
          </div>
        </motion.div>

        {/* Dashboard Mockup Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="mt-24 w-full max-w-5xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 bottom-0 h-1/2 pointer-events-none" />
          <div className="glass-panel p-4 rounded-3xl border border-border/50 shadow-2xl relative bg-background/50 backdrop-blur-3xl">
            <div className="bg-muted/30 rounded-2xl overflow-hidden border border-border/50 aspect-video relative flex items-center justify-center group cursor-pointer shadow-inner">
               {/* Decorative Abstract Elements */}
               <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
               <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
               
               <div className="flex flex-col items-center gap-4 text-muted-foreground group-hover:text-primary transition-colors z-10 bg-background/80 backdrop-blur-md px-8 py-6 rounded-2xl border border-border/50 shadow-sm">
                 <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                   <Sparkles className="w-8 h-8 text-primary animate-pulse-slow" />
                 </div>
                 <p className="font-semibold">Interactive Dashboard Preview</p>
                 <p className="text-xs opacity-70">Hover to explore</p>
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Feature Snippets */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        {[
          { icon: Users, title: "Relationship Intelligence", desc: "Track every interaction and score relationship health automatically." },
          { icon: Calendar, title: "Smart Scheduling", desc: "Seamless meeting management and intelligent follow-up reminders." },
          { icon: BarChart3, title: "Deep Analytics", desc: "Visualize your network growth with beautiful, interactive charts." }
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-2xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
