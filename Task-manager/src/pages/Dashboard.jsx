
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import { CalendarCheck, AlertCircle, Clock, Edit, Plus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  IconButton, 
  Paper,
  Divider
} from '@mui/material';

const Dashboard = () => {
  const { tasks, currentUser } = useTaskContext();
  const { theme } = useTheme();
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter tasks for the current user or all tasks for admin
  const userTasks = currentUser?.role === 'admin' 
    ? tasks 
    : tasks.filter(task => task.createdBy === currentUser?.id);

  // Get tasks with upcoming deadlines (within 3 days)
  const upcomingDeadlines = userTasks.filter(task => {
    const deadline = new Date(task.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0 && task.status !== 'approved' && task.status !== 'rejected';
  });

  // Get pending tasks (not started or in progress)
  const pendingTasks = userTasks.filter(
    task => task.status === 'pending' || task.status === 'in-progress'
  );

  // Get tasks awaiting approval
  const awaitingApproval = userTasks.filter(task => task.status === 'submitted');

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // Stat Card component
  const StatCard = ({ title, value, icon, color, description }) => (
    <Card elevation={1} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              bgcolor: `${color}.light`, 
              color: `${color}.main`,
              borderRadius: '50%',
              p: 1,
              display: 'flex'
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Task
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Pending Tasks" 
            value={pendingTasks.length}
            icon={<Clock size={24} />}
            color="info"
            description={
              pendingTasks.length === 0
                ? "No pending tasks"
                : `You have ${pendingTasks.length} task${pendingTasks.length !== 1 ? 's' : ''} in progress`
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Upcoming Deadlines" 
            value={upcomingDeadlines.length}
            icon={<AlertCircle size={24} />}
            color="warning"
            description={
              upcomingDeadlines.length === 0
                ? "No upcoming deadlines"
                : `${upcomingDeadlines.length} task${upcomingDeadlines.length !== 1 ? 's' : ''} due in the next 3 days`
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Awaiting Approval" 
            value={awaitingApproval.length}
            icon={<CalendarCheck size={24} />}
            color="success"
            description={
              awaitingApproval.length === 0
                ? "No tasks awaiting approval"
                : `${awaitingApproval.length} task${awaitingApproval.length !== 1 ? 's' : ''} submitted for review`
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
          Recent Tasks
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          {userTasks.slice(0, 6).map(task => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Box sx={{ position: 'relative' }} onClick={() => handleViewTask(task)}>
                <TaskCard task={task} onView={handleViewTask} />
                {(task.status === 'pending' || task.status === 'in-progress') && (
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTask(task);
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
          
          {userTasks.length === 0 && (
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  py: 4, 
                  px: 2, 
                  textAlign: 'center',
                  bgcolor: 'background.default'
                }}
              >
                <Typography color="text.secondary">
                  No tasks available. Create a new task to get started.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        mode="view"
      />

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        mode="edit"
      />
    </Box>
  );
};

export default Dashboard;
