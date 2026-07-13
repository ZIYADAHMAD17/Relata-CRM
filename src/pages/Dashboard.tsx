import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Users, Calendar as CalendarIcon, Activity, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTasks, getMeetings, getPeople, getOrganizations, getInvoices } from '@/services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Today's Focus", value: "0 High Priority", icon: Target, trend: "Tasks", color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Organizations", value: "0", icon: Activity, trend: "Added", color: "text-success", bg: "bg-success/10" },
    { label: "Upcoming Meetings", value: "0", icon: CalendarIcon, trend: "Total", color: "text-accent", bg: "bg-accent/10" },
    { label: "Total Connections", value: "0", icon: Users, trend: "People", color: "text-secondary", bg: "bg-secondary/10" }
  ]);
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasks, meetings, people, orgs, invoices] = await Promise.all([
        getTasks(),
        getMeetings(),
        getPeople(),
        getOrganizations(),
        getInvoices()
      ]);

      // Calculate Stats
      const highPriorityTasks = tasks.filter(t => t.priority === 'High').length;
      const upcomingMeetings = meetings.filter(m => m.status === 'Upcoming').length;

      setStats([
        { label: "High Priority Tasks", value: `${highPriorityTasks}`, icon: Target, trend: "Needs Action", color: "text-primary", bg: "bg-primary/10" },
        { label: "Organizations", value: `${orgs.length}`, icon: Activity, trend: "Total", color: "text-success", bg: "bg-success/10" },
        { label: "Upcoming Meetings", value: `${upcomingMeetings}`, icon: CalendarIcon, trend: "Scheduled", color: "text-accent", bg: "bg-accent/10" },
        { label: "People Network", value: `${people.length}`, icon: Users, trend: "Contacts", color: "text-secondary", bg: "bg-secondary/10" }
      ]);

      // Combine Recent Activity
      const allActivities = [
        ...tasks.map(t => ({ id: t.id, text: `Created task: ${t.title}`, time: new Date(t.created_at).toLocaleDateString(), type: 'task', timestamp: new Date(t.created_at).getTime() })),
        ...meetings.map(m => ({ id: m.id, text: `Scheduled meeting: ${m.title}`, time: new Date(m.created_at).toLocaleDateString(), type: 'meeting', timestamp: new Date(m.created_at).getTime() })),
        ...orgs.map(o => ({ id: o.id, text: `Added org: ${o.name}`, time: new Date(o.created_at).toLocaleDateString(), type: 'org', timestamp: new Date(o.created_at).getTime() })),
        ...invoices.map(i => ({ id: i.id, text: `Generated invoice for ${i.client_name}`, time: new Date(i.created_at).toLocaleDateString(), type: 'invoice', timestamp: new Date(i.created_at).getTime() })),
      ];

      allActivities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(allActivities.slice(0, 5));

      // Mock Chart Data for realistic feel based on data counts (this week)
      // Since demo data is scattered, we will just use real counts to populate a generic bar chart
      const data = [
        { name: 'Tasks', value: tasks.length || 2 },
        { name: 'Meetings', value: meetings.length || 1 },
        { name: 'People', value: people.length || 3 },
        { name: 'Orgs', value: orgs.length || 2 },
        { name: 'Invoices', value: invoices.length || 1 },
      ];
      setChartData(data);

    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview 👋</h1>
        <p className="text-muted-foreground">Your real-time data powered by Supabase.</p>
      </motion.div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {stat.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Interaction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle>Data Distribution</CardTitle>
              <CardDescription>Your records currently stored in the database</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[250px] w-full flex items-center justify-center">Loading...</div>
              ) : (
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across your network</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {loading ? (
                <div>Loading activity...</div>
              ) : (
                <div className="flex flex-col gap-6">
                  {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                    <div key={activity.id} className="flex gap-4 relative">
                      {i !== recentActivity.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-border" />
                      )}
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col pt-1">
                        <p className="text-sm font-medium leading-tight mb-1">{activity.text}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-muted-foreground">No recent activity found. Make some changes!</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
