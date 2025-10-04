import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileSettingsModal = ({ isOpen, onClose, user }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: user?.name || 'Sarah Johnson',
    email: user?.email || 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'March 15, 2024'
  });

  if (!isOpen) return null;

  const handleLogout = () => {
    alert('Logging out...');
    onClose();
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAccount = () => {
    alert('Account deleted. All child profiles have been removed.');
    setIsDeleteModalOpen(false);
    onClose();
  };

  const handleSaveChanges = () => {
    alert('Profile updated successfully!');
    setEditMode(false);
  };

  return (
    <>
      {/* Main Profile Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={24} className="text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-card-foreground">
                  Profile Settings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage your parent account details
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userDetails.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-body font-medium text-card-foreground">Profile Picture</h3>
                <p className="text-sm text-muted-foreground mb-2">Upload a new avatar</p>
                <Button variant="outline" size="sm">
                  <Icon name="Upload" size={16} className="mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-card-foreground">
                  Personal Information
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Icon name={editMode ? "X" : "Edit"} size={16} className="mr-2" />
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                    Full Name
                  </label>
                  {editMode ? (
                    <Input
                      value={userDetails.name}
                      onChange={(e) => setUserDetails(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {userDetails.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                    Email Address
                  </label>
                  {editMode ? (
                    <Input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails(prev => ({...prev, email: e.target.value}))}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {userDetails.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                    Phone Number
                  </label>
                  {editMode ? (
                    <Input
                      value={userDetails.phone}
                      onChange={(e) => setUserDetails(prev => ({...prev, phone: e.target.value}))}
                      placeholder="Enter your phone"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {userDetails.phone}
                    </p>
                  )}
                </div>
              </div>

              {editMode && (
                <div className="flex items-center space-x-2 pt-4">
                  <Button onClick={handleSaveChanges}>
                    <Icon name="Save" size={16} className="mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Account Information
              </h3>
              <div className="bg-muted/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body text-card-foreground">Member Since:</span>
                  <span className="text-sm text-muted-foreground">{userDetails.joinDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body text-card-foreground">Account Type:</span>
                  <span className="text-sm text-muted-foreground">Parent Account</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body text-card-foreground">Status:</span>
                  <span className="text-sm text-success">Active</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Account Actions
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleLogout}
                  className="justify-start"
                >
                  <Icon name="LogOut" size={16} className="mr-3" />
                  Logout from Account
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleDeleteAccount}
                  className="justify-start text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Icon name="Trash2" size={16} className="mr-3" />
                  Delete Account & All Child Profiles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-4">
          <div className="bg-card rounded-lg border border-border shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} className="text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-card-foreground">
                    Delete Account
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-body text-card-foreground">
                  Are you sure you want to delete your account? This will:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                  <li>• Remove all your personal information</li>
                  <li>• Delete all child profiles under your account</li>
                  <li>• Permanently erase all learning progress</li>
                  <li>• Cancel any active subscriptions</li>
                </ul>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={confirmDeleteAccount}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettingsModal;