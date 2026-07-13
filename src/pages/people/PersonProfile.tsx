import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar as CalendarIcon,
  Link as LinkIcon, Edit3, MessageSquare, Briefcase, FileText, Clock,
  CheckCircle2, TrendingUp, Trash2
} from 'lucide-react';
import { getPersonById, updatePerson, getMeetings, createMeeting, getTasks, getNotesByPersonId, createNote, deleteNote } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const PersonProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);

  // Dialog states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  // Form states
  const [editData, setEditData] = useState<any>({
    name: '', email: '', role: '', company: '',
    phone: '', location: '', birthday: '', linkedin: '', website: '', tags: ''
  });
  const [meetForm, setMeetForm] = useState({ title: '', date: '', time: '', location: '', type: 'video' });
  const [logForm, setLogForm] = useState({ title: '', date: '', time: '' });
  const [noteText, setNoteText] = useState('');

  const loadAllData = async () => {
    if (!id) return;
    try {
      const personData = await getPersonById(id);
      setPerson(personData);

      setEditData({
        name: personData.name || '',
        email: personData.email || '',
        role: personData.role || '',
        company: personData.company || '',
        phone: personData.phone || '',
        location: personData.location || '',
        birthday: personData.birthday || '',
        linkedin: personData.linkedin || '',
        website: personData.website || '',
        tags: (personData.tags || []).join(', '),
      });

      // Fetch meetings, tasks, notes
      const [meetingsData, tasksData, notesData] = await Promise.all([
        getMeetings(),
        getTasks(),
        getNotesByPersonId(id),
      ]);

      const items: any[] = [];

      // Add meetings where this person is an attendee
      meetingsData.forEach((m: any) => {
        const hasAttendee = (m.attendees || []).some(
          (a: any) => a.name?.toLowerCase() === personData.name?.toLowerCase()
        );
        if (hasAttendee) {
          items.push({
            id: m.id,
            type: 'meeting',
            title: `Meeting: ${m.title} [${m.status}]`,
            date: `${m.date} at ${m.time}`,
            icon: MessageSquare,
            color: 'text-primary',
            bg: 'bg-primary/10',
            timestamp: new Date(m.created_at || Date.now()),
          });
        }
      });

      // Add tasks assigned to this person
      tasksData.forEach((t: any) => {
        if (t.assignee?.toLowerCase() === personData.name?.toLowerCase()) {
          items.push({
            id: t.id,
            type: 'task',
            title: `Task: ${t.title} [${t.status}]`,
            date: `Due ${t.dueDate || 'No date'}`,
            icon: CheckCircle2,
            color: 'text-success',
            bg: 'bg-success/10',
            timestamp: new Date(t.created_at || Date.now()),
          });
        }
      });

      // Add notes from Supabase
      notesData.forEach((n: any) => {
        items.push({
          id: n.id,
          type: 'note',
          title: `Note: "${n.content}"`,
          date: new Date(n.created_at).toLocaleDateString(),
          icon: FileText,
          color: 'text-warning',
          bg: 'bg-warning/10',
          timestamp: new Date(n.created_at || Date.now()),
          noteId: n.id,
        });
      });

      // CRM addition event
      items.push({
        id: 'crm-added',
        type: 'system',
        title: `${personData.name} added to CRM`,
        date: new Date(personData.created_at).toLocaleDateString(),
        icon: Clock,
        color: 'text-muted-foreground',
        bg: 'bg-muted',
        timestamp: new Date(personData.created_at || Date.now()),
      });

      items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setTimeline(items);
    } catch (e) {
      console.error('Error loading profile data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [id]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !person) return;
    try {
      const updatedPerson = await updatePerson(id, {
        name: editData.name,
        email: editData.email,
        role: editData.role,
        company: editData.company,
        phone: editData.phone,
        location: editData.location,
        birthday: editData.birthday,
        linkedin: editData.linkedin,
        website: editData.website,
        tags: editData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      });
      setPerson(updatedPerson);
      setIsEditOpen(false);
      loadAllData();
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person || !id) return;
    try {
      await createMeeting({
        title: meetForm.title,
        date: meetForm.date,
        time: meetForm.time,
        location: meetForm.location,
        type: meetForm.type,
        priority: 'Medium',
        status: 'Upcoming',
        attendees: [{ name: person.name, avatar: person.avatar }],
      });
      setIsScheduleOpen(false);
      setMeetForm({ title: '', date: '', time: '', location: '', type: 'video' });
      loadAllData();
    } catch (e) {
      console.error('Error scheduling meeting:', e);
    }
  };

  const handleLogMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person || !id) return;
    try {
      await createMeeting({
        title: logForm.title,
        date: logForm.date,
        time: logForm.time,
        location: 'In Person',
        type: 'in-person',
        priority: 'Medium',
        status: 'Attended',
        attendees: [{ name: person.name, avatar: person.avatar }],
      });
      // Also update last_contact on person
      await updatePerson(id, { last_contact: logForm.date });
      setIsLogOpen(false);
      setLogForm({ title: '', date: '', time: '' });
      loadAllData();
    } catch (e) {
      console.error('Error logging meeting:', e);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !noteText.trim()) return;
    try {
      await createNote({ person_id: id, content: noteText });
      setNoteText('');
      setIsNoteOpen(false);
      loadAllData();
    } catch (e) {
      console.error('Error adding note:', e);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      loadAllData();
    } catch (e) {
      console.error('Error deleting note:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <div className="text-muted-foreground text-lg">Person not found</div>
        <Link to="/people">
          <Button variant="outline" className="rounded-full">Back to People</Button>
        </Link>
      </div>
    );
  }

  const lastContact = person.last_contact || 'Never';
  const nextFollowUp = person.next_follow_up || 'No follow up scheduled';

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
          {/* Edit Profile */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full bg-card/50 backdrop-blur-sm shadow-sm h-9 px-4">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input id="edit-name" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" type="email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-role">Role</Label>
                    <Input id="edit-role" value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-company">Company</Label>
                    <Input id="edit-company" value={editData.company} onChange={e => setEditData({ ...editData, company: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input id="edit-phone" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input id="edit-location" value={editData.location} onChange={e => setEditData({ ...editData, location: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-birthday">Birthday</Label>
                    <Input id="edit-birthday" value={editData.birthday} onChange={e => setEditData({ ...editData, birthday: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-linkedin">LinkedIn</Label>
                    <Input id="edit-linkedin" value={editData.linkedin} onChange={e => setEditData({ ...editData, linkedin: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-website">Website</Label>
                    <Input id="edit-website" value={editData.website} onChange={e => setEditData({ ...editData, website: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                    <Input id="edit-tags" value={editData.tags} onChange={e => setEditData({ ...editData, tags: e.target.value })} />
                  </div>
                </div>
                <Button type="submit" className="mt-4 bg-primary text-white">Save Changes</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Schedule Meeting */}
          <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 h-9 px-4 bg-primary text-white">
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule Meeting with {person.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleScheduleMeeting} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="meet-title">Meeting Title</Label>
                  <Input id="meet-title" required value={meetForm.title} onChange={e => setMeetForm({ ...meetForm, title: e.target.value })} placeholder="Project Sync" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="meet-date">Date</Label>
                    <Input id="meet-date" type="date" required value={meetForm.date} onChange={e => setMeetForm({ ...meetForm, date: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="meet-time">Time</Label>
                    <Input id="meet-time" required value={meetForm.time} onChange={e => setMeetForm({ ...meetForm, time: e.target.value })} placeholder="e.g. 11:00 AM" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="meet-location">Location / Link</Label>
                  <Input id="meet-location" value={meetForm.location} onChange={e => setMeetForm({ ...meetForm, location: e.target.value })} placeholder="Google Meet link or address" />
                </div>
                <Button type="submit" className="mt-4 bg-primary text-white">Schedule</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
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
              <AvatarImage src={person.avatar} />
              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold z-10">{person.name}</h2>
            <p className="text-muted-foreground font-medium z-10 flex items-center gap-1.5 mt-1">
              <Briefcase className="w-4 h-4" />
              {person.role} at {person.company}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4 z-10">
              {(person.tags || []).map((tag: string) => (
                <span key={tag} className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-muted/80 text-muted-foreground rounded-full border border-border/50">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-full flex justify-around mt-8 pt-6 border-t border-border/50 z-10">
              <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.open(`mailto:${person.email}`)}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium mt-2 text-muted-foreground">Email</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer" onClick={() => person.phone && window.open(`tel:${person.phone}`)}>
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium mt-2 text-muted-foreground">Call</span>
              </div>
              <div className="flex flex-col items-center group cursor-pointer" onClick={() => setIsScheduleOpen(true)}>
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
              <span className="truncate font-medium">{person.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="truncate font-medium">{person.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="truncate font-medium">{person.location || 'Not provided'}</span>
            </div>
            {person.linkedin && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span
                  className="truncate font-medium text-primary hover:underline cursor-pointer"
                  onClick={() => window.open(person.linkedin.startsWith('http') ? person.linkedin : `https://${person.linkedin}`, '_blank')}
                >
                  {person.linkedin}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          {/* Score & Follow-up Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-success/10 rounded-full blur-2xl group-hover:bg-success/20 transition-all pointer-events-none" />
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Relationship Score</p>
              <div className="flex items-end gap-3 mt-1">
                <span className="text-4xl font-bold tracking-tight text-success">{person.score || 50}</span>
                <span className="text-sm font-medium text-muted-foreground mb-1">/ 100</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">{person.status || 'Good'} Health</span>
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all pointer-events-none" />
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Follow Up</p>
              <div className="flex flex-col mt-1 gap-1">
                <span className="text-lg font-bold">{nextFollowUp}</span>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Last contact: {lastContact}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel p-6 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-lg">Activity Timeline</h3>
              <div className="flex gap-2">
                {/* Log Meeting */}
                <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-full bg-card/50">Log Meeting</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Log Past Meeting with {person.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogMeeting} className="flex flex-col gap-4 mt-2">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="log-title">Meeting Title</Label>
                        <Input id="log-title" required value={logForm.title} onChange={e => setLogForm({ ...logForm, title: e.target.value })} placeholder="Product Demo / Discussion" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="log-date">Date</Label>
                          <Input id="log-date" type="date" required value={logForm.date} onChange={e => setLogForm({ ...logForm, date: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="log-time">Time</Label>
                          <Input id="log-time" required value={logForm.time} onChange={e => setLogForm({ ...logForm, time: e.target.value })} placeholder="e.g. 2:00 PM" />
                        </div>
                      </div>
                      <Button type="submit" className="mt-4 bg-primary text-white">Log Meeting</Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Add Note */}
                <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-full bg-card/50">Add Note</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Note for {person.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddNote} className="flex flex-col gap-4 mt-2">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="note-content">Note Content</Label>
                        <textarea
                          id="note-content"
                          required
                          rows={3}
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="e.g. Interested in the enterprise tier"
                          className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <Button type="submit" className="mt-4 bg-primary text-white">Add Note</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex flex-col gap-8 ml-2">
              {timeline.map((event, index) => (
                <div key={event.id} className="flex gap-6 relative group">
                  {index !== timeline.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-32px] w-px bg-border/80" />
                  )}
                  <div className={`w-10 h-10 rounded-full ${event.bg} flex items-center justify-center shrink-0 z-10 shadow-sm border border-background`}>
                    <event.icon className={`w-5 h-5 ${event.color}`} />
                  </div>
                  <div className="flex flex-col pt-1.5 flex-1">
                    <p className="font-semibold text-sm mb-1">{event.title}</p>
                    <span className="text-xs font-medium text-muted-foreground">{event.date}</span>
                  </div>
                  {event.type === 'note' && event.noteId && (
                    <button
                      onClick={() => handleDeleteNote(event.noteId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-danger p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {timeline.length === 0 && (
                <div className="text-center text-muted-foreground p-8">No activity logged yet.</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonProfile;
