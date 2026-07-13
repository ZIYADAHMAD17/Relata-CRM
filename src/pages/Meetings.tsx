import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Video, Clock, Plus, ChevronRight, MapPin, MoreHorizontal, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { getMeetings, createMeeting, updateMeeting, deleteMeeting } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const Meetings = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', date: '', time: '', type: 'video', location: '', priority: 'Medium' });
  const [toast, setToast] = useState<string | null>(null);
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMeeting = { ...formData, attendees: [], status: 'Upcoming' };
      await createMeeting(newMeeting);
      setIsDialogOpen(false);
      setFormData({ title: '', date: '', time: '', type: 'video', location: '', priority: 'Medium' });
      fetchMeetings();
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const handleMarkAttended = async (meetingId: string) => {
    try {
      await updateMeeting(meetingId, { status: 'Attended' });
      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, status: 'Attended' } : m));
    } catch (error) {
      console.error('Error marking attended:', error);
    }
  };

  const handleDeleteMeeting = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteMeeting(id);
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const openEditDialog = (meeting: any) => {
    setEditingMeeting(meeting);
    setIsEditOpen(true);
  };

  const handleEditMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeeting) return;
    try {
      await updateMeeting(editingMeeting.id, {
        title: editingMeeting.title,
        date: editingMeeting.date,
        time: editingMeeting.time,
        location: editingMeeting.location,
        type: editingMeeting.type,
        priority: editingMeeting.priority,
      });
      setIsEditOpen(false);
      fetchMeetings();
    } catch (error) {
      console.error('Error editing meeting:', error);
    }
  };

  const handleJoinCall = (meeting: any) => {
    if (meeting.location && (meeting.location.startsWith('http') || meeting.location.startsWith('meet'))) {
      window.open(meeting.location.startsWith('http') ? meeting.location : `https://${meeting.location}`, '_blank');
    } else {
      showToast('No video link set for this meeting.');
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full max-w-7xl mx-auto relative">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-6 right-6 z-50 bg-card border border-border shadow-xl rounded-xl px-5 py-3 text-sm font-medium"
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
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            {isEmployee ? 'Join your scheduled meetings and mark attendance.' : 'Manage your schedule, agendas, and meeting notes.'}
          </p>
        </div>
        {!isEmployee && (
          <div className="flex gap-2">
            <Button
              onClick={() => showToast('Calendar sync complete! ✓')}
              variant="outline"
              className="rounded-full bg-card/50 backdrop-blur-sm shadow-sm px-6"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Sync Calendar
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white rounded-full px-6 flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                  <Plus className="w-4 h-4" />
                  Schedule Meeting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Meeting</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateMeeting} className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Meeting Title</Label>
                    <Input id="title" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Project Sync" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} placeholder="10:00 AM - 11:00 AM" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location">Location / Video Link</Label>
                    <Input id="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="https://meet.google.com/... or Office" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="type">Type</Label>
                      <select id="type" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
                        <option value="video">Video Call</option>
                        <option value="in-person">In Person</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select id="priority" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit" className="mt-4">Save Meeting</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </motion.div>

      {/* Edit Meeting Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
          </DialogHeader>
          {editingMeeting && (
            <form onSubmit={handleEditMeeting} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label>Meeting Title</Label>
                <Input required value={editingMeeting.title} onChange={e => setEditingMeeting({ ...editingMeeting, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Date</Label>
                  <Input type="date" required value={editingMeeting.date} onChange={e => setEditingMeeting({ ...editingMeeting, date: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Time</Label>
                  <Input required value={editingMeeting.time} onChange={e => setEditingMeeting({ ...editingMeeting, time: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Location / Video Link</Label>
                <Input value={editingMeeting.location} onChange={e => setEditingMeeting({ ...editingMeeting, location: e.target.value })} />
              </div>
              <Button type="submit" className="mt-2">Update Meeting</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Meeting Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Meeting Timeline</h2>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-full">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {loading ? (
            <div className="text-muted-foreground">Loading meetings...</div>
          ) : meetings.length === 0 ? (
            <div className="text-muted-foreground glass-panel p-8 text-center">No meetings yet. {!isEmployee && 'Schedule one!'}</div>
          ) : (
            <div className="flex flex-col gap-4">
              {meetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className={`glass-panel p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group cursor-pointer hover:border-primary/30 ${meeting.status === 'Attended' ? 'opacity-60' : ''}`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${meeting.status === 'Attended' ? 'bg-success' : meeting.priority === 'High' ? 'bg-danger' : meeting.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`} />

                  <div className="flex flex-col justify-center min-w-[120px] md:pr-6 md:border-r border-border/50">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{meeting.date}</span>
                    <span className="text-lg font-bold">{meeting.time?.split(' - ')[0] || meeting.time}</span>
                    <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {meeting.time}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{meeting.title}</h3>
                        {meeting.status === 'Attended' && (
                          <span className="flex items-center gap-1 text-xs text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Attended
                          </span>
                        )}
                      </div>
                      {!isEmployee && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(meeting)} className="flex items-center gap-2">
                              <Edit2 className="w-3.5 h-3.5" /> Edit Meeting
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMeeting(meeting.id, meeting.title)} className="text-danger flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                        {meeting.type === 'video' ? <Video className="w-3.5 h-3.5 text-accent" /> : <MapPin className="w-3.5 h-3.5 text-warning" />}
                        {meeting.location || 'No location set'}
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center justify-between md:justify-center md:pl-6 md:border-l border-border/50 gap-3 mt-4 md:mt-0">
                    {meeting.type === 'video' && meeting.status !== 'Attended' && (
                      <Button
                        onClick={() => handleJoinCall(meeting)}
                        size="sm"
                        className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors border-transparent h-8"
                      >
                        Join Call
                      </Button>
                    )}
                    {meeting.status !== 'Attended' && (
                      <Button
                        onClick={() => handleMarkAttended(meeting.id)}
                        size="sm"
                        variant="outline"
                        className="rounded-full h-8 text-success border-success/30 hover:bg-success/10 hover:text-success"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Mark Attended
                      </Button>
                    )}
                    {meeting.status === 'Attended' && (
                      <span className="text-xs text-success font-medium">✓ Done</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 flex flex-col gap-6"
        >
          <div className="glass-panel p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="font-semibold text-lg">Meeting Insights</h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Meetings</p>
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                  </div>
                </div>
                <span className="font-bold text-lg">{meetings.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Attended</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                <span className="font-bold text-lg">{meetings.filter(m => m.status === 'Attended').length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Video Calls</p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                </div>
                <span className="font-bold text-lg">{meetings.filter(m => m.type === 'video' && m.status !== 'Attended').length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Meetings;
