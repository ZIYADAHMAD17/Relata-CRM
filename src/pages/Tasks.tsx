import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MoreHorizontal, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { getTasks, createTask, updateTask } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', dueDate: '', priority: 'Medium', status: 'To Do', assignee: '' });
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
      setIsDialogOpen(false);
      setFormData({ title: '', dueDate: '', priority: 'Medium', status: 'To Do', assignee: '' });
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

  return (
    <div className="flex flex-col gap-8 h-full">
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
          <Button variant="outline" className="rounded-full bg-card/50 backdrop-blur-sm shadow-sm">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
          
          {!isEmployee && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white rounded-full px-6 flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <Plus className="w-4 h-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Prepare slide deck" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} placeholder="Tomorrow" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input id="assignee" value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} placeholder="Ziyad" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select 
                    id="priority" 
                    value={formData.priority} 
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <Button type="submit" className="mt-4">Save Task</Button>
              </form>
            </DialogContent>
          </Dialog>
          )}
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        {loading ? (
          <div>Loading tasks...</div>
        ) : (
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
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
                          className="glass-panel p-4 flex flex-col gap-3 group cursor-grab active:cursor-grabbing hover:border-primary/30"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityColor(task.priority || 'Medium')}`}>
                              {task.priority || 'Medium'}
                            </span>
                            {task.status === 'Completed' && (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            )}
                          </div>
                          
                          <h4 className="font-medium text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
                            {task.title}
                          </h4>
                                                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/50">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-6 h-6 border border-border/50">
                                <AvatarFallback>{task.assignee ? task.assignee.charAt(0) : 'U'}</AvatarFallback>
                              </Avatar>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {isEmployee && task.status !== 'Completed' && (
                                <button
                                  onClick={() => handleMarkComplete(task.id)}
                                  className="flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-1 rounded-full hover:bg-success/20 transition-colors"
                                >
                                  <CheckCircle2 className="w-3 h-3" /> Mark Complete
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
                    <Button variant="ghost" onClick={() => setIsDialogOpen(true)} className="w-full text-muted-foreground hover:text-foreground justify-start text-xs border border-dashed border-border/50 rounded-xl py-6 hover:bg-card/50">
                      <Plus className="w-4 h-4 mr-2" /> Add Task
                    </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
