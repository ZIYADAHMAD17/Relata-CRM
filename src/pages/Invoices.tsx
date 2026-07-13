import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Download, MoreHorizontal, CheckCircle2, Clock, AlertCircle, Send, Trash2 } from 'lucide-react';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const statusConfig = {
  Paid: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10 border-success/20' },
  Pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
  Overdue: { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
  Draft: { icon: Send, color: 'text-muted-foreground', bg: 'bg-muted border-border/50' },
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ client_name: '', amount: '', due_date: '', status: 'Pending' });
  const [toast, setToast] = useState<string | null>(null);
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newInvoice = {
        invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        client_name: formData.client_name,
        amount: parseFloat(formData.amount),
        due_date: formData.due_date,
        status: formData.status
      };
      await createInvoice(newInvoice);
      setIsDialogOpen(false);
      setFormData({ client_name: '', amount: '', due_date: '', status: 'Pending' });
      fetchInvoices();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    try {
      await updateInvoice(id, { status: newStatus });
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    }
  };

  const handleDeleteInvoice = async (id: string, name: string) => {
    if (!window.confirm(`Delete invoice for "${name}"?`)) return;
    try {
      await deleteInvoice(id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'An error occurred. Please check database permissions.');
    }
  };

  const handleDownloadInvoice = (inv: any) => {
    // Generate a simple text-based invoice download
    const content = [
      `INVOICE: ${inv.invoice_number}`,
      `Client: ${inv.client_name}`,
      `Amount: $${Number(inv.amount).toLocaleString()}`,
      `Due Date: ${inv.due_date}`,
      `Status: ${inv.status}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.invoice_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloading ${inv.invoice_number}...`);
  };

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const overdueRevenue = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + Number(curr.amount), 0);

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'Paid invoices', color: 'text-success', bg: 'bg-success/10' },
    { label: 'Pending', value: `$${pendingRevenue.toLocaleString()}`, sub: `${invoices.filter(i => i.status === 'Pending').length} invoices`, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Overdue', value: `$${overdueRevenue.toLocaleString()}`, sub: 'Requires action', color: 'text-danger', bg: 'bg-danger/10' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0 max-w-6xl mx-auto relative">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 bg-card border border-border shadow-xl rounded-xl px-5 py-3 text-sm font-medium"
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
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Generate, track, and manage all your invoices.</p>
        </div>

        {!isEmployee && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white rounded-full px-6 flex items-center gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateInvoice} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input id="client_name" required value={formData.client_name} onChange={e => setFormData({ ...formData, client_name: e.target.value })} placeholder="Acme Corp" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input id="amount" type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="1000" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input id="due_date" type="date" required value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <Button type="submit" className="mt-4">Save Invoice</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
            <div className="glass-panel p-5 flex items-center gap-4 relative overflow-hidden">
              <div className={`absolute right-0 top-0 w-32 h-32 rounded-full ${stat.bg} blur-2xl opacity-50 pointer-events-none`} />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <span className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</span>
                <span className="text-xs text-muted-foreground mt-1">{stat.sub}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div>Loading invoices...</div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="glass-panel overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-border/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span className="col-span-2">Invoice</span>
              <span>Status</span>
              <span>Amount</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="flex flex-col divide-y divide-border/50">
              {invoices.map((inv, i) => {
                const cfg = statusConfig[(inv.status as keyof typeof statusConfig) || 'Draft'];
                return (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                    className="grid grid-cols-5 gap-4 items-center px-5 py-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="col-span-2">
                      <p className="font-semibold text-sm">{inv.invoice_number}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{inv.client_name} · Due {inv.due_date}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        {inv.status}
                      </span>
                    </div>
                    <div className="font-bold text-base">${Number(inv.amount).toLocaleString()}</div>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isEmployee ? (
                        <button
                          onClick={() => handleToggleStatus(inv.id, inv.status)}
                          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${inv.status === 'Paid' ? 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20' : 'bg-success/10 text-success border-success/20 hover:bg-success/20'}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {inv.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}
                        </button>
                      ) : (
                        <>
                          <Button onClick={() => handleDownloadInvoice(inv)} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                            <Download className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleToggleStatus(inv.id, inv.status)}>
                                {inv.status === 'Paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteInvoice(inv.id, inv.client_name)} className="text-danger flex items-center gap-2">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {invoices.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">No invoices generated yet.</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Invoices;
