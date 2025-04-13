
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import { 
  Box, 
  Button, 
  TextField, 
  Chip, 
  Typography, 
  Grid, 
  Paper,
  InputAdornment,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as ClockIcon,
  HourglassEmpty as HourglassIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const Tasks = () => {
  const { tasks, currentUser } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter tasks for the current user
  const userTasks = currentUser?.role === 'admin'
    ? tasks
    : tasks.filter(task => task.createdBy === currentUser?.id);

  // Apply search and status filters
  const filteredTasks = userTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const toggleStatusFilter = (status) => {
    setStatusFilter(currentStatus => currentStatus === status ? 'all' : status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return statusFilter === status ? 'success' : 'default';
      case 'rejected': return statusFilter === status ? 'error' : 'default';
      case 'submitted': return statusFilter === status ? 'warning' : 'default';
      case 'in-progress': return statusFilter === status ? 'primary' : 'default';
      case 'pending': return statusFilter === status ? 'secondary' : 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon fontSize="small" />;
      case 'rejected': return <WarningIcon fontSize="small" />;
      case 'submitted': return <HourglassIcon fontSize="small" />;
      case 'in-progress': 
      case 'pending':
        return <ClockIcon fontSize="small" />;
      default: return null;
    }
  };

  // Calculate task completion stats
  const completedTasks = userTasks.filter(task => task.status === 'approved').length;
  const totalTasks = userTasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">My Tasks</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Task
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ width: { sm: '300px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <CloseIcon 
                    fontSize="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setSearchTerm('')}
                  />
                </InputAdornment>
              )
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', pb: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
            <FilterListIcon fontSize="small" color="action" />
            <Chip 
              label="All" 
              onClick={() => setStatusFilter('all')}
              color={statusFilter === 'all' ? 'primary' : 'default'}
              variant={statusFilter === 'all' ? 'filled' : 'outlined'}
            />
            <Chip 
              icon={getStatusIcon('pending')}
              label="Pending" 
              onClick={() => toggleStatusFilter('pending')}
              color={getStatusColor('pending')}
              variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
            />
            <Chip 
              icon={getStatusIcon('in-progress')}
              label="In Progress" 
              onClick={() => toggleStatusFilter('in-progress')}
              color={getStatusColor('in-progress')}
              variant={statusFilter === 'in-progress' ? 'filled' : 'outlined'}
            />
            <Chip 
              icon={getStatusIcon('submitted')}
              label="Submitted" 
              onClick={() => toggleStatusFilter('submitted')}
              color={getStatusColor('submitted')}
              variant={statusFilter === 'submitted' ? 'filled' : 'outlined'}
            />
            <Chip 
              icon={getStatusIcon('approved')}
              label="Approved" 
              onClick={() => toggleStatusFilter('approved')}
              color={getStatusColor('approved')}
              variant={statusFilter === 'approved' ? 'filled' : 'outlined'}
            />
            <Chip 
              icon={getStatusIcon('rejected')}
              label="Rejected" 
              onClick={() => toggleStatusFilter('rejected')}
              color={getStatusColor('rejected')}
              variant={statusFilter === 'rejected' ? 'filled' : 'outlined'}
            />
          </Box>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight="medium">Task Completion</Typography>
          <Typography variant="body2" fontWeight="medium">{completedTasks} of {totalTasks} complete</Typography>
        </Box>
        <LinearProgress variant="determinate" value={completionPercentage} />
      </Paper>

      <Grid container spacing={2}>
        {filteredTasks.map(task => (
          <Grid item xs={12} md={6} lg={4} key={task.id}>
            <Box position="relative">
              <TaskCard task={task} onView={handleViewTask} />
              {(task.status === 'pending' || task.status === 'in-progress') && (
                <Box position="absolute" bottom={8} right={8}>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.95)' } 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
        {filteredTasks.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="textSecondary" mb={2}>No tasks match your search criteria</Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <TaskModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
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

export default Tasks;
