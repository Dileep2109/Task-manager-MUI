import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Task, useTaskContext } from '@/context/TaskContext';
import { format } from 'date-fns';
import { CalendarIcon, Trash2, Upload, Image, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  mode: 'view' | 'create' | 'edit';
}

const initialTask: Omit<Task, 'id'> = {
  title: '',
  description: '',
  progress: 0,
  deadline: format(new Date(), 'yyyy-MM-dd'),
  status: 'pending',
  photos: [],
  createdBy: '',
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, mode }) => {
  const { addTask, updateTask, submitTask, currentUser, approveTask, rejectTask } = useTaskContext();
  const { theme } = useTheme();
  const [taskData, setTaskData] = useState<Omit<Task, 'id'>>(initialTask);
  const [rejectionComment, setRejectionComment] = useState('');
  const [selectedDeadline, setSelectedDeadline] = useState<Date | undefined>(new Date());
  const [statusAction, setStatusAction] = useState<'approve' | 'reject' | null>(null);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  useEffect(() => {
    if (task && (mode === 'edit' || mode === 'view')) {
      setTaskData(task);
      setSelectedDeadline(new Date(task.deadline));
    } else {
      setTaskData({
        ...initialTask,
        createdBy: currentUser?.id || '',
      });
      setSelectedDeadline(new Date());
    }
  }, [task, mode, currentUser]);

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleProgressUpdate = (newValue: number[]) => {
    setTaskData({ ...taskData, progress: newValue[0] });
  };

  const handleDeadlineSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDeadline(date);
      setTaskData({ ...taskData, deadline: format(date, 'yyyy-MM-dd') });
    }
  };

  const handleCreateOrUpdate = () => {
    if (mode === 'create') {
      addTask({
        ...taskData,
        createdBy: currentUser?.id || '',
      });
    } else if (mode === 'edit' && task) {
      updateTask({
        ...taskData,
        id: task.id,
      });
    }
    onClose();
  };

  const handleTaskSubmission = () => {
    if (task) {
      submitTask(task.id);
      onClose();
    }
  };

  const handleStatusConfirmation = () => {
    if (!task) return;

    if (statusAction === 'approve') {
      approveTask(task.id);
    } else if (statusAction === 'reject') {
      rejectTask(task.id, rejectionComment);
    }

    setStatusAction(null);
    onClose();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhotos(true);

    // Simulate file upload delay
    setTimeout(() => {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setTaskData({
        ...taskData,
        photos: [...taskData.photos, ...newPhotos],
      });
      setIsUploadingPhotos(false);
    }, 1000);
  };

  const removeUploadedPhoto = (index: number) => {
    const updatedPhotos = [...taskData.photos];
    updatedPhotos.splice(index, 1);
    setTaskData({
      ...taskData,
      photos: updatedPhotos,
    });
  };

  const isInteractionDisabled =
    mode === 'view' || (currentUser?.role !== 'admin' && task?.status === 'submitted');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[600px] max-h-[90vh] overflow-y-auto ${
          theme === 'dark' ? 'dark bg-gray-800 text-white' : ''
        }`}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Create New Task'
              : mode === 'edit'
              ? 'Edit Task'
              : 'Task Details'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Provide the necessary information to create a new task.'
              : mode === 'edit'
              ? 'Modify the existing task details here.'
              : 'Review the complete details of this task.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleFieldChange}
              className="col-span-3"
              readOnly={isInteractionDisabled}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleFieldChange}
              className="col-span-3"
              readOnly={isInteractionDisabled}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="progress" className="text-right">
              Progress ({taskData.progress}%)
            </Label>
            <div className="col-span-3">
              {isInteractionDisabled ? (
                <Progress value={taskData.progress} className="h-2" />
              ) : (
                <Slider
                  id="progress"
                  min={0}
                  max={100}
                  step={5}
                  value={[taskData.progress]}
                  onValueChange={handleProgressUpdate}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Deadline
            </Label>
            <div className="col-span-3">
              {isInteractionDisabled ? (
                <span>{format(new Date(taskData.deadline), 'MMMM dd, yyyy')}</span>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDeadline && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDeadline ? format(selectedDeadline, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={selectedDeadline}
                      onSelect={handleDeadlineSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {(mode === 'view' || mode === 'edit') && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="col-span-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    taskData.status === 'approved'
                      ? 'bg-success text-white'
                      : taskData.status === 'rejected'
                      ? 'bg-error text-white'
                      : taskData.status === 'submitted'
                      ? 'bg-warning text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {taskData.status.charAt(0).toUpperCase() + taskData.status.slice(1)}
                </span>
              </div>
            </div>
          )}

          {taskData.adminComment && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Admin Comment</Label>
              <div className="col-span-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
                {taskData.adminComment}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Photos</Label>
            <div className="col-span-3">
              {taskData.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {taskData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Task photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      {!isInteractionDisabled && (
                        <button
                          onClick={() => removeUploadedPhoto(index)}
                          className="absolute top-1 right-1 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No photos uploaded</p>
                </div>
              )}

              {!isInteractionDisabled && (
                <div className="mt-4">
                  <Label htmlFor="photo-upload" className="cursor-pointer w-full">
                    <div className="flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center">
                      {isUploadingPhotos ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Upload photos</span>
                        </>
                      )}
                    </div>
                    <Input
                      id="photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhotos}
                    />
                  </Label>
                </div>
              )}
            </div>
          </div>

          {statusAction === 'reject' && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="reject-comment" className="text-right">
                Rejection Reason
              </Label>
              <Textarea
                id="reject-comment"
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                placeholder="Explain why this task is being rejected"
                className="col-span-3"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {statusAction ? (
            <>
              <Button variant="outline" onClick={() => setStatusAction(null)}>
                Cancel
              </Button>
              <Button onClick={handleStatusConfirmation}>
                {statusAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </Button>
            </>
          ) : (
            <>
              {mode === 'view' && currentUser?.role === 'admin' && task?.status === 'submitted' && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStatusAction('reject')}>
                    Reject
                  </Button>
                  <Button onClick={() => setStatusAction('approve')}>
                    Approve
                  </Button>
                </div>
              )}

              {mode === 'view' &&
                currentUser?.id === task?.createdBy &&
                task?.status !== 'approved' &&
                task?.status !== 'submitted' &&
                task?.status !== 'rejected' && (
                  <Button onClick={handleTaskSubmission}>Submit for Approval</Button>
                )}

              {(mode === 'create' || mode === 'edit') && !isInteractionDisabled && (
                <Button onClick={handleCreateOrUpdate} disabled={isUploadingPhotos}>
                  {mode === 'create' ? 'Create Task' : 'Update Task'}
                </Button>
              )}

              <Button variant="outline" onClick={onClose}>
                {(mode === 'create' || mode === 'edit') && !isInteractionDisabled ? 'Cancel' : 'Close'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;