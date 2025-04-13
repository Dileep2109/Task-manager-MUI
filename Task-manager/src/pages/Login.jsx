import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { users, setCurrentUser, isAuthenticated } = useTaskContext();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get the current theme

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple authentication logic - in a real app this would be more secure
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    // Demo credentials
    if (username === 'smdileep@gmail.com' && password === 'admin123') {
      // Admin user login
      const adminUser = users.find(user => user.role === 'admin');
      if (adminUser) {
        setCurrentUser(adminUser);
        toast.success('Logged in as Admin');
        navigate('/');
      }
    } else if (username === 'user@gmail.com' && password === 'user123') {
      // Regular user login
      const regularUser = users.find(user => user.role === 'user');
      if (regularUser) {
        setCurrentUser(regularUser);
        toast.success('Logged in successfully');
        navigate('/');
      }
    } else {
      toast.error('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"> {/* Added dark mode class */}
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg"> {/* Added dark mode class */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Task Manager</CardTitle> {/* Added dark mode class */}
          <CardDescription className="text-center text-gray-500 dark:text-gray-400">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-900 dark:text-white">Username</Label> {/* Added dark mode class */}
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" // Added dark mode classes
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 dark:text-white">Password</Label>  {/* Added dark mode class */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"  // Added dark mode classes
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">Sign In</Button> {/* Added dark mode classes */}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            <p>Demo Credentials:</p>
            <p>Admin: username: <strong>smdileep@gmail.com</strong>, password: <strong>admin123</strong></p>
            <p>User: username: <strong>user@gmail.com</strong>, password: <strong>user123</strong></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
