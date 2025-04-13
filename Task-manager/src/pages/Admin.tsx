import React, { useState } from 'react';
import { useTaskContext, Task } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TaskModal from '@/components/TaskModal';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle2, AlertTriangle, Clock, Hourglass, Plus, X, Trash2, Eye, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const Admin = () => {
  const { tasks, users, deleteTask } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(task => task.status === 'pending' || task.status === 'in-progress');
  const submittedTasks = filteredTasks.filter(task => task.status === 'submitted');
  const approvedTasks = filteredTasks.filter(task => task.status === 'approved');
  const rejectedTasks = filteredTasks.filter(task => task.status === 'rejected');

  const getUserNameById = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const showTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const removeTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this task?')) {
      deleteTask(taskId);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      approved: <CheckCircle2 className="h-4 w-4 text-success" />,
      rejected: <AlertTriangle className="h-4 w-4 text-error" />,
      submitted: <Hourglass className="h-4 w-4 text-warning" />,
      'in-progress': <Clock className="h-4 w-4 text-primary" />,
      pending: <Clock className="h-4 w-4 text-gray-500" />, // Added pending
    };
    return icons[status] || <Clock className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-xl">Task Management</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="submitted">
            <TabsList className="mb-4">
              <TabsTrigger value="submitted" className="flex items-center gap-2">
                <Hourglass className="h-4 w-4" />
                Submitted
                <span className="ml-1 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">{submittedTasks.length}</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                In Progress
                <span className="ml-1 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">{pendingTasks.length}</span>
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Approved
                <span className="ml-1 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">{approvedTasks.length}</span>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Rejected
                <span className="ml-1 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">{rejectedTasks.length}</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                All Tasks
                <span className="ml-1 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">{filteredTasks.length}</span>
              </TabsTrigger>
            </TabsList>

            {['submitted', 'pending', 'approved', 'rejected', 'all'].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="border rounded-md">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(tabValue === 'all' ? filteredTasks :
                        tabValue === 'submitted' ? submittedTasks :
                          tabValue === 'pending' ? pendingTasks :
                            tabValue === 'approved' ? approvedTasks : rejectedTasks
                      ).map(task => (
                        <TableRow
                          key={task.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => showTaskDetails(task)}
                        >
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(task.status)}
                              <span className="capitalize">{task.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>{task.progress}%</TableCell>
                          <TableCell>{getUserNameById(task.createdBy)}</TableCell>
                          <TableCell>{format(new Date(task.deadline), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); showTaskDetails(task); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="text-error hover:text-error" onClick={(e) => removeTask(task.id, e)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {((tabValue === 'all' && filteredTasks.length === 0) ||
                        (tabValue === 'submitted' && submittedTasks.length === 0) ||
                        (tabValue === 'pending' && pendingTasks.length === 0) ||
                        (tabValue === 'approved' && approvedTasks.length === 0) ||
                        (tabValue === 'rejected' && rejectedTasks.length === 0)) && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                            No tasks found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default Admin;
