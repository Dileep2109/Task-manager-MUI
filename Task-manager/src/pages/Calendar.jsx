import React, { useState } from 'react';
import { Calendar as ReactBigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useTaskContext } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskModal from '@/components/TaskModal';
import { CalendarDays, Users, Filter, Edit } from 'lucide-react';
import '../styles/calendar-styles.css';


const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { tasks, users, currentUser } = useTaskContext();
  const { theme } = useTheme();
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Format tasks for calendar display
  const getCalendarEvents = () => {
    let filteredTasks = tasks;

    if (currentUser?.role !== 'admin') {
      filteredTasks = tasks.filter(task => task.createdBy === currentUser?.id);
    } else if (selectedUser !== 'all') {
      filteredTasks = tasks.filter(task => task.createdBy === selectedUser);
    }

    if (selectedStatus !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === selectedStatus);
    }

    return filteredTasks.map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.deadline),
      end: new Date(task.deadline),
      task: task,
      className: `${task.status}-event`
    }));
  };

  const handleSelectEvent = (event) => {
    setSelectedTask(event.task);
    if (event.task.status === 'pending' || event.task.status === 'in-progress') {
      setIsEditModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // Custom components for calendar
  const components = {
    event: (props) => {
      const { event } = props;
      const canEdit = event.task.status === 'pending' || event.task.status === 'in-progress';

      return (
        <div className={`rbc-event-content event-box ${event.className}`}>
          <div className="event-title">{event.title}</div>
          {canEdit && (
            <div className="event-edit-button">
              <Edit size={12} />
            </div>
          )}
        </div>
      );
    },
    dateHeader: ({ label, date }) => {
      const dayName = moment(date).format('ddd');
      return (
        <div className="rbc-date-header">
          <div className="text-xs text-gray-500">{dayName}</div>
          <div>{label}</div>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Task Calendar</h1>

        {currentUser?.role === 'admin' && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-primary" />
            {currentUser?.role === 'admin' ? 'All Tasks Calendar' : 'My Tasks Calendar'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex flex-wrap gap-3 mb-4 bg-gray-50 p-3 rounded-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-[#64748b] mr-2"></div>
                <span className="text-xs">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-[#3b82f6] mr-2"></div>
                <span className="text-xs">In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-[#f59e0b] mr-2"></div>
                <span className="text-xs">Submitted</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-[#10b981] mr-2"></div>
                <span className="text-xs">Approved</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-[#ef4444] mr-2"></div>
                <span className="text-xs">Rejected</span>
              </div>
              <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 italic">
                Click on any event to edit or view details
              </div>
            </div>

            <ReactBigCalendar
              localizer={localizer}
              events={getCalendarEvents()}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
              eventPropGetter={(event) => ({
                className: event.className
              })}
              components={components}
            />
          </div>
        </CardContent>
      </Card>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        mode="view"
      />

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        mode="edit"
      />
    </div>
  );
};

export default Calendar;