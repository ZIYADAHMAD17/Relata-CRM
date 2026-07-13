import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, ExternalLink, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPeople, createPerson, deletePerson } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Excellent': return 'bg-success/10 text-success border-success/20';
    case 'Good': return 'bg-primary/10 text-primary border-primary/20';
    case 'Needs Attention': return 'bg-warning/10 text-warning border-warning/20';
    default: return 'bg-muted text-muted-foreground border-border/50';
  }
};

const PeopleList = () => {
  const [search, setSearch] = useState('');
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', company: '', email: '', avatar: '' });

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const data = await getPeople();
      setPeople(data);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPerson = {
        ...formData,
        score: Math.floor(Math.random() * 100),
        status: 'Good',
        avatar: formData.avatar || `https://i.pravatar.cc/150?u=${formData.email}`,
      };
      await createPerson(newPerson);
      setIsDialogOpen(false);
      setFormData({ name: '', role: '', company: '', email: '', avatar: '' });
      fetchPeople();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    }
  };
  const handleDeletePerson = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deletePerson(id);
        fetchPeople();
      } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    }
    }
  };

  const filteredPeople = people.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.company?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0 h-full">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 bg-danger/90 text-white border border-danger shadow-xl rounded-xl px-5 py-3 text-sm font-medium"
        >
          {toast}
        </motion.div>
      )}

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">People</h1>
          <p className="text-muted-foreground">Manage your relationships and connections.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white rounded-full px-6 flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Plus className="w-4 h-4" />
              Add Person
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePerson} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="CEO" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Acme Corp" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="avatar">Profile Picture URL (Optional)</Label>
                <Input id="avatar" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} placeholder="https://example.com/photo.jpg" />
              </div>
              <Button type="submit" className="mt-4">Save Person</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search people by name, company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card/50 backdrop-blur-sm border-border/50 rounded-full focus-visible:ring-primary"
          />
        </div>
        <Button variant="outline" className="rounded-full bg-card/50 backdrop-blur-sm border-border/50 hover:bg-muted">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      {/* People Grid */}
      {loading ? (
        <div>Loading people...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <div className="glass-panel p-5 flex flex-col gap-4 group hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-12 h-12 border border-border/50 shadow-sm group-hover:ring-2 group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={`/people/${person.id}`} className="font-semibold hover:text-primary transition-colors text-lg line-clamp-1">
                        {person.name}
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-1">{person.role} at {person.company}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/people/${person.id}`}>View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePerson(person.id, person.name)} className="text-danger focus:text-danger cursor-pointer">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1.5 ${getStatusColor(person.status)}`}>
                    <Activity className="w-3 h-3" />
                    {person.status} • {person.score}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2 pt-4 border-t border-border/50">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                  <Link to={`/people/${person.id}`} className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                    View Profile <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredPeople.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground p-8">
              No people found. Add someone to get started!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeopleList;
