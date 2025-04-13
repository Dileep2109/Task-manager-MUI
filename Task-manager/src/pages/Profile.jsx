import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  User as UserIcon, 
  Phone, 
  Shield, 
  Upload,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme

const Profile = () => {
  const { currentUser, updateUser } = useTaskContext();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    role: 'user',
    photoUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
      setPhotoPreview(currentUser.photoUrl);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      
      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl);
      setFormData({ ...formData, photoUrl: imageUrl });
    }
  };

  const handleSave = () => {
    if (!currentUser || !formData.name || !formData.mobile) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateUser({
      ...currentUser,
      name: formData.name,
      mobile: formData.mobile,
      photoUrl: formData.photoUrl || currentUser.photoUrl,
    });

    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500 dark:text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">My Profile</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={photoPreview || currentUser.photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
              {isEditing && (
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <Upload size={16} />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                <UserIcon className={theme === 'light' ? "w-4 h-4 mr-2 text-gray-700" : "w-4 h-4 mr-2 text-gray-300"} />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                />
              ) : (
                <div className="py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                  {currentUser.name}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile" className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                <Phone className={theme === 'light' ? "w-4 h-4 mr-2 text-gray-700" : "w-4 h-4 mr-2 text-gray-300"} />
                Mobile Number
              </Label>
              {isEditing ? (
                <Input
                  id="mobile"
                  name="mobile"
                  value={formData.mobile || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                />
              ) : (
                <div className="py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                  {currentUser.mobile}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                <Shield className={theme === 'light' ? "w-4 h-4 mr-2 text-gray-700" : "w-4 h-4 mr-2 text-gray-300"} />
                Role
              </Label>
              <div className={`py-1 px-3 inline-block rounded-full text-sm ${
                currentUser.role === 'admin'
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white'
                }`}>
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Role cannot be changed</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-500 text-white hover:bg-blue-600">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white hover:bg-blue-600">
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
