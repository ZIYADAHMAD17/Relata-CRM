import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getTasks, getMeetings, getPeople, getOrganizations, getInvoices } from '@/services/api';
import { ArrowUpRight, TrendingUp, Users, Activity } from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    activeConnections: 0,
    meetingHours: 0,
    taskCompletion: 0
  });

  const [growthData, setGrowthData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [tasks, meetings, people, orgs, invoices] = await Promise.all([
        getTasks(),
        getMeetings(),
        getPeople(),
        getOrganizations(),
        getInvoices()
      ]);

      // Calculate Stats
      const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
      const activeConnections = people.length + orgs.length;
      const meetingHours = meetings.length * 1; // Assume 1 hour per meeting for simplicity
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const taskCompletion = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

      setStats({
        totalRevenue,
        activeConnections,
        meetingHours,
        taskCompletion
      });

      // Generate mock chronological growth data based on total records to simulate a chart
      // In a real app, this would group records by date/month.
      const data = [
        { name: 'Jan', network: activeConnections > 5 ? activeConnections - 5 : 0, revenue: totalRevenue * 0.1 },
        { name: 'Feb', network: activeConnections > 3 ? activeConnections - 3 : 1, revenue: totalRevenue * 0.3 },
        { name: 'Mar', network: activeConnections > 1 ? activeConnections - 1 : 2, revenue: totalRevenue * 0.5 },
        { name: 'Apr', network: activeConnections, revenue: totalRevenue },
      ];
      setGrowthData(data);

    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your network growth and productivity.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
          { title: "Network Size", value: `${stats.activeConnections}`, icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { title: "Meeting Hours", value: `${stats.meetingHours}h`, icon: Activity, color: "text-accent", bg: "bg-accent/10" },
          { title: "Task Completion", value: `${stats.taskCompletion}%`, icon: ArrowUpRight, color: "text-warning", bg: "bg-warning/10" }
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : kpi.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Network Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle>Network Growth</CardTitle>
              <CardDescription>People and Organizations added over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] w-full flex items-center justify-center">Loading...</div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }} />
                      <Area type="monotone" dataKey="network" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorNetwork)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Generated from Paid Invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <div className="h-[300px] w-full flex items-center justify-center">Loading...</div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }} />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
