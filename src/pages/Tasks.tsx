import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MoreHorizontal, Calendar as CalendarIcon, Clock, CheckCircle2, Edit2, Trash2, LayoutList } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

type TaskStatus = 'To Do' | 'In Progress' | 'Waiting' | 'Completed';
const columns: TaskStatus[] = ['To Do', 'In Progress', 'Waiting', 'Completed'];

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case 'High': return 'bg-danger/10 text-danger border-danger/20';
    case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
    case 'Low': return 'bg-success/10 text-success border-success/20';
    default: return 'bg-muted text-muted-foreground border-border/50';
  }
};

const emptyForm = { title: '', dueDate: '', priority: 'Medium', status: 'To Do', assignee: '' };

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [calendarView, setCalendarView] = useState(false);
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(formData);
      setIsCreateOpen(false);
      setFormData({ ...emptyForm });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      await updateTask(taskId, { status: 'Completed' });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  const handleDeleteTask = async (id: string, title: string) => {
    if (!window.confirm(`Delete task "${title}"?`)) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openEditDialog = (task: any) => {
    setEditingTask({ ...task });
    setIsEditOpen(true);
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, {
        title: editingTask.title,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority,
        status: editingTask.status,
        assignee: editingTask.assignee,
      });
      setIsEditOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const TaskFormFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <>
      <div className="flex flex-col gap-2">
        <Label>Task Title</Label>
        <Input required value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} placeholder="Prepare slide deck" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Due Date</Label>
          <Input type="date" value={data.dueDate} onChange={e => onChange({ ...data, dueDate: e.target.value })} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Assignee</Label>
          <Input value={data.assignee} onChange={e => onChange({ ...data, assignee: e.target.value })} placeholder="Ziyad" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <select value={data.status} onChange={e => onChange({ ...data, status: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
            {columns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Priority</Label>
          <select value={data.priority} onChange={e => onChange({ ...data, priority: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Modern Kanban board to track your objectives.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCalendarView(v => !v)}
            className={`rounded-full bg-card/50 backdrop-blur-sm shadow-sm ${calendarView ? 'border-primary text-primary' : ''}`}
          >
            {calendarView ? <LayoutList className="w-4 h-4 mr-2" /> : <CalendarIcon className="w-4 h-4 mr-2" />}
            {calendarView ? 'Kanban View' : 'Calendar View'}
          </Button>

          {!isEmployee && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white rounded-full px-6 flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateTask} className="flex flex-col gap-4 mt-4">
                  <TaskFormFields data={formData} onChange={setFormData} />
                  <Button type="submit" className="mt-4">Save Task</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
          {editingTask && (
            <form onSubmit={handleEditTask} className="flex flex-col gap-4 mt-4">
              <TaskFormFields data={editingTask} onChange={setEditingTask} />
              <Button type="submit" className="mt-2">Update Task</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Calendar / Kanban toggle */}
      {loading ? (
        <div>Loading tasks...</div>
      ) : calendarView ? (
        // Calendar / date-grouped list view
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          {['High', 'Medium', 'Low'].map(priority => {
            const grouped = tasks.filter(t => t.priority === priority);
            if (!grouped.length) return null;
            return (
              <div key={priority}>
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${priority === 'High' ? 'text-danger' : priority === 'Medium' ? 'text-warning' : 'text-success'}`}>
                  {priority} Priority
                </h3>
                <div className="flex flex-col gap-2">
                  {grouped.map(task => (
                    <div key={task.id} className="glass-panel px-5 py-4 flex items-center gap-4 group">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${priority === 'High' ? 'bg-danger' : priority === 'Medium' ? 'bg-warning' : 'bg-success'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.assignee || 'Unassigned'} · Due {task.dueDate || 'No date'}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>{task.status}</span>
                      {!isEmployee && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(task)} className="flex items-center gap-2"><Edit2 className="w-3.5 h-3.5" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTask(task.id, task.title)} className="text-danger flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      ) : (
        // Kanban View
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max h-full">
            {columns.map((column, index) => {
              const columnTasks = tasks.filter(t => (t.status || 'To Do') === column);
              return (
                <motion.div
                  key={column}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-80 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground/80 uppercase tracking-wider text-sm">{column}</h3>
                      <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-4 min-h-[200px] p-2 -mx-2 rounded-2xl bg-muted/20 border border-transparent hover:bg-muted/30 transition-colors">
                    <AnimatePresence>
                      {columnTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="glass-panel p-4 flex flex-col gap-3 group hover:border-primary/30"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityColor(task.priority || 'Medium')}`}>
                              {task.priority || 'Medium'}
                            </span>
                            <div className="flex items-center gap-1">
                              {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4 text-success" />}
                              {!isEmployee && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditDialog(task)} className="flex items-center gap-2 text-sm">
                                      <Edit2 className="w-3.5 h-3.5" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteTask(task.id, task.title)} className="text-danger flex items-center gap-2 text-sm">
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>

                          <h4 className="font-medium text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
                            {task.title}
                          </h4>

                          <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/50">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6 border border-border/50">
                                <AvatarFallback>{task.assignee ? task.assignee.charAt(0) : 'U'}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground truncate max-w-[80px]">{task.assignee || 'Unassigned'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isEmployee && task.status !== 'Completed' && (
                                <button
                                  onClick={() => handleMarkComplete(task.id)}
                                  className="flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-1 rounded-full hover:bg-success/20 transition-colors"
                                >
                                  <CheckCircle2 className="w-3 h-3" /> Complete
                                </button>
                              )}
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span className={task.dueDate === 'Today' || task.dueDate === 'Tomorrow' ? 'text-warning font-medium' : ''}>
                                  {task.dueDate || 'No date'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {!isEmployee && (
                      <Button
                        variant="ghost"
                        onClick={() => { setFormData({ ...emptyForm, status: column }); setIsCreateOpen(true); }}
                        className="w-full text-muted-foreground hover:text-foreground justify-start text-xs border border-dashed border-border/50 rounded-xl py-6 hover:bg-card/50"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Task
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
