import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Globe, MapPin, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

const industryColors: Record<string, string> = {
  Technology: 'bg-primary/10 text-primary',
  SaaS: 'bg-secondary/10 text-secondary',
  Finance: 'bg-success/10 text-success',
  Design: 'bg-accent/10 text-accent',
};

const Organizations = () => {
  const [search, setSearch] = useState('');
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', industry: '', website: '', location: '' });

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const data = await getOrganizations();
      setOrgs(data);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOrg = {
        ...formData,
        employees: Math.floor(Math.random() * 500) + 10,
        contacts: Math.floor(Math.random() * 20) + 1,
        revenue: `$${(Math.random() * 10).toFixed(1)}M ARR`,
        logo: formData.name.substring(0, 2).toUpperCase()
      };
      await createOrganization(newOrg);
      setIsCreateOpen(false);
      setFormData({ name: '', industry: '', website: '', location: '' });
      fetchOrgs();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    }
  };

  const openEditDialog = (org: any) => {
    setEditingOrg({ ...org });
    setIsEditOpen(true);
  };

  const handleEditOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    try {
      await updateOrganization(editingOrg.id, {
        name: editingOrg.name,
        industry: editingOrg.industry,
        website: editingOrg.website,
        location: editingOrg.location,
      });
      setIsEditOpen(false);
      fetchOrgs();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    }
  };

  const handleDeleteOrg = async (id: string, name: string) => {
    if (!window.confirm(`Delete organization "${name}"?`)) return;
    try {
      await deleteOrganization(id);
      setOrgs(prev => prev.filter(o => o.id !== id));
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    }
  };

  const filteredOrgs = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.industry?.toLowerCase().includes(search.toLowerCase())
  );

  const OrgFormFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <>
      <div className="flex flex-col gap-2">
        <Label>Company Name</Label>
        <Input required value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} placeholder="TechCorp" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Industry</Label>
        <Input required value={data.industry} onChange={e => onChange({ ...data, industry: e.target.value })} placeholder="Technology" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Website</Label>
        <Input value={data.website} onChange={e => onChange({ ...data, website: e.target.value })} placeholder="techcorp.com" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Location</Label>
        <Input value={data.location} onChange={e => onChange({ ...data, location: e.target.value })} placeholder="San Francisco, CA" />
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0 max-w-6xl mx-auto h-full">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 bg-danger/90 text-white border border-danger shadow-xl rounded-xl px-5 py-3 text-sm font-medium"
        >
          {toast}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Track companies, partners, and business accounts.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white rounded-full px-6 flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Plus className="w-4 h-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOrg} className="flex flex-col gap-4 mt-4">
              <OrgFormFields data={formData} onChange={setFormData} />
              <Button type="submit" className="mt-4">Save Organization</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Edit Org Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          {editingOrg && (
            <form onSubmit={handleEditOrg} className="flex flex-col gap-4 mt-4">
              <OrgFormFields data={editingOrg} onChange={setEditingOrg} />
              <Button type="submit" className="mt-2">Update Organization</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card/50 backdrop-blur-sm border-border/50 rounded-full"
          />
        </div>
      </motion.div>

      {/* Org Cards */}
      {loading ? (
        <div>Loading organizations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrgs.map((org, i) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <div className="glass-panel p-6 flex flex-col gap-4 group hover:border-primary/30 hover:-translate-y-1 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {org.logo || org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{org.name}</h3>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${industryColors[org.industry] || 'bg-muted text-muted-foreground'}`}>
                        {org.industry}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(org)} className="flex items-center gap-2">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteOrg(org.id, org.name)} className="text-danger flex items-center gap-2">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{org.location || 'Unknown location'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span
                      className="text-primary hover:underline cursor-pointer"
                      onClick={() => org.website && window.open(org.website.startsWith('http') ? org.website : `https://${org.website}`, '_blank')}
                    >
                      {org.website || 'No website'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-base">{org.employees || 0}</span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Employees</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-base">{org.contacts || 0}</span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Contacts</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-xs text-success">{org.revenue || 'N/A'}</span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Revenue</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(org.contacts || 0, 3))].map((_, idx) => (
                      <Avatar key={idx} className="w-7 h-7 border-2 border-card text-[10px]">
                        <AvatarFallback>{String.fromCharCode(65 + idx)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {(org.contacts || 0) > 3 && (
                      <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        +{(org.contacts || 0) - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredOrgs.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground p-8">
              No organizations found. Add one to get started!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Organizations;
