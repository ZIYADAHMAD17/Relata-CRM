import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background bg-aurora flex flex-col md:flex-row w-full text-foreground">
      {/* Left side - Auth Form */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-8 flex flex-col justify-center relative z-10 bg-background/50 backdrop-blur-3xl border-r border-white/5">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Relata</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto mt-16 md:mt-0"
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Right side - Abstract Graphic */}
      <div className="hidden md:flex flex-1 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-2xl aspect-square"
        >
          {/* Abstract decorative blobs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/30 rounded-full blur-[100px] animate-float" />
          
          <div className="glass-panel w-full h-full rounded-[2rem] border border-white/10 shadow-2xl flex flex-col p-12 justify-center items-start text-left">
            <h2 className="text-4xl font-bold mb-6">Build a network that works for you.</h2>
            <p className="text-xl text-muted-foreground">Relata brings all your relationship context into one beautiful, intelligent workspace.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
