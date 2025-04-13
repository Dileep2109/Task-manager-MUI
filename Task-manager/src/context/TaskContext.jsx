import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export const UserRole = { ADMIN: 'admin', USER: 'user' };

const initialUsers = [
  { id: '1', name: 'Admin User', mobile: '+1234567890', role: 'admin', photoUrl: '/placeholder.svg' },
  { id: '2', name: 'Regular User', mobile: '+0987654321', role: 'user', photoUrl: '/placeholder.svg' },
];

const initialTasks = [
  { id: '1', title: 'Project Docs', description: 'Write them up.', progress: 75, deadline: '2025-04-20', status: 'in-progress', photos: [], createdBy: '2' },
  { id: '2', title: 'Landing Page Design', description: 'Create mockups.', progress: 30, deadline: '2025-04-30', status: 'pending', photos: [], createdBy: '2' },
  { id: '3', title: 'Review Pull Requests', description: 'Check recent code.', progress: 100, deadline: '2025-04-15', status: 'submitted', photos: [], createdBy: '2' },
];

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || initialTasks);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users')) || initialUsers);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');

  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); localStorage.setItem('isAuthenticated', isAuthenticated); }, [currentUser, isAuthenticated]);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
    toast.success('Task created');
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    toast.success('Task updated');
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted');
  };

  const updateUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    toast.success('Profile updated');
  };

  const approveTask = (taskId, comment) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: 'approved', adminComment: comment || task.adminComment } : task));
    toast.success('Task approved');
  };

  const rejectTask = (taskId, comment) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: 'rejected', adminComment: comment } : task));
    toast.error('Task rejected');
  };

  const submitTask = (taskId) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: 'submitted' } : task));
    toast.success('Task submitted');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.setItem('isAuthenticated', 'false');
    toast.success('Logged out');
  };

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(!!user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', !!user);
  };

  return (
    <TaskContext.Provider value={{
      tasks, users, currentUser, isAuthenticated, setCurrentUser: updateCurrentUser,
      addTask, updateTask, deleteTask, updateUser, approveTask, rejectTask, submitTask, logout
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};