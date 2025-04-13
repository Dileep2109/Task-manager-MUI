import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  Event as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertTriangleIcon,
  HourglassEmpty as HourglassIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const TaskCard = ({ task, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'submitted':
        return 'warning';
      case 'in-progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon fontSize="small" />;
      case 'rejected':
        return <AlertTriangleIcon fontSize="small" />;
      case 'submitted':
      case 'pending':
        return <HourglassIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const calculateDaysRemaining = () => {
    const today = new Date();
    const deadline = new Date(task.deadline);
    const timeDifference = deadline.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const remainingDays = calculateDaysRemaining();
  const isOverdue = remainingDays < 0;

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 6 },
        borderRadius: 0,
      }}
      onClick={() => onView(task)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" gutterBottom noWrap sx={{ maxWidth: '70%' }}>
            {task.title}
          </Typography>
          <Chip
            icon={getStatusIcon(task.status)}
            label={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            color={getStatusColor(task.status)}
            size="small"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            height: 40,
          }}
        >
          {task.description}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {task.progress}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={task.progress} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(task.deadline), 'MMM dd, yyyy')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClockIcon fontSize="small" color="action" />
            <Typography
              variant="body2"
              color={isOverdue ? 'error' : remainingDays <= 3 ? 'warning.main' : 'text.secondary'}
            >
              {isOverdue
                ? `Overdue by ${Math.abs(remainingDays)} day${Math.abs(remainingDays) !== 1 ? 's' : ''}`
                : `${remainingDays} day${remainingDays !== 1 ? 's' : ''} remaining`}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;