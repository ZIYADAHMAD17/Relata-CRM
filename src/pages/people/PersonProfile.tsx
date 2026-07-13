import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar as CalendarIcon, 
  Link as LinkIcon, Edit3, MessageSquare, Briefcase, FileText, Clock,
  CheckCircle2, TrendingUp
} from 'lucide-react';

const mockPerson = {
  id: 1, 
  name: 'Sarah Jenkins', 
  role: 'Product Manager', 
  company: 'TechCorp', 
  email: 'sarah@techcorp.com', 
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  birthday: 'August 14',
  linkedin: 'linkedin.com/in/sarahjenkins',
  website: 'techcorp.com',
  score: 92, 
  status: 'Excellent', 
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
  tags: ['High Priority', 'Decision Maker', 'Q3 Pipeline'],
  lastContact: '2 days ago',
  nextFollowUp: 'Tomorrow at 10 AM',
};

const timeline = [
  { id: 1, type: 'meeting', title: 'Product Demo Meeting', date: '2 days ago', icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 2, type: 'task', title: 'Sent pricing proposal', date: '4 days ago', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  { id: 3, type: 'note', title: 'Added note: "Interested in the enterprise tier."', date: '1 week ago', icon: FileText, color: 'text-warning', bg: 'bg-warning/10' },
  { id: 4, type: 'system', title: 'Sarah Jenkins added to CRM', date: '2 weeks ago', icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
];

const PersonProfile = () => {
  useParams();

  return (
    <div className="flex flex-col gap-6 pb-20 md:pb-0 h-full max-w-6xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Link to="/people" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to People
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full bg-card/50 backdrop-blur-sm shadow-sm h-9 px-4">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 h-9 px-4">
            Schedule Meeting
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 flex flex-col gap-6"
        >
          {/* Main Identity Card */}
          <div className="glass-panel p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 z-0" />
            <Avatar className="w-24 h-24 border-4 border-card shadow-xl z-10 mt-8 mb-4 ring-2 ring-primary/20">
              <AvatarImage src={mockPerson.avatar} />
              <AvatarFallback>{mockPerson.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold z-10">{mockPerson.name}</h2>
            <p className="text-muted-foreground font-medium z-10 flex items-center gap-1.5 mt-1">
              <Briefcase className="w-4 h-4" />
              {mockPerson.role} at {mockPerson.company}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4 z-10">
              {mockPerson.tags.map(tag => (
                <span key={tag} className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-muted/80 text-muted-foreground rounded-full border border-border/50">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-full flex justify-around mt-8 pt-6 border-t border-border/50 z-10">
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium mt-2 text-muted-foreground">Email</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium mt-2 text-muted-foreground">Call</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success group-hover:bg-success group-hover:text-white transition-all shadow-sm">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium mt-2 text-muted-foreground">Meet</span>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="glass-panel p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Contact Details</h3>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="truncate font-medium">{mockPerson.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="truncate font-medium">{mockPerson.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="truncate font-medium">{mockPerson.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="truncate font-medium text-primary hover:underline cursor-pointer">{mockPerson.linkedin}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Relationship & Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          {/* Relationship Score Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-success/10 rounded-full blur-2xl group-hover:bg-success/20 transition-all pointer-events-none" />
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Relationship Score</p>
              <div className="flex items-end gap-3 mt-1">
                <span className="text-4xl font-bold tracking-tight text-success">{mockPerson.score}</span>
                <span className="text-sm font-medium text-muted-foreground mb-1">/ 100</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Excellent Health</span>
              </div>
            </div>
            
            <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all pointer-events-none" />
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Follow Up</p>
              <div className="flex flex-col mt-1 gap-1">
                <span className="text-lg font-bold">{mockPerson.nextFollowUp}</span>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Last contact {mockPerson.lastContact}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel p-6 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-lg">Activity Timeline</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs rounded-full bg-card/50">Log Meeting</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs rounded-full bg-card/50">Add Note</Button>
              </div>
            </div>
            
            <div className="flex flex-col gap-8 ml-2">
              {timeline.map((event, index) => (
                <div key={event.id} className="flex gap-6 relative">
                  {index !== timeline.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-32px] w-px bg-border/80" />
                  )}
                  <div className={`w-10 h-10 rounded-full ${event.bg} flex items-center justify-center shrink-0 z-10 shadow-sm border border-background`}>
                    <event.icon className={`w-5 h-5 ${event.color}`} />
                  </div>
                  <div className="flex flex-col pt-1.5">
                    <p className="font-semibold text-sm mb-1">{event.title}</p>
                    <span className="text-xs font-medium text-muted-foreground">{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default PersonProfile;
