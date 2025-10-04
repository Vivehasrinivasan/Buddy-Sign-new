import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ChildControlModal from './ChildControlModal';

const ChildrenListModal = ({ isOpen, onClose }) => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeChild, setActiveChild] = useState('emma-2024');
  const [showChildControls, setShowChildControls] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Mock children data
  const [children, setChildren] = useState([
    {
      id: 'emma-2024',
      name: 'Emma Johnson',
      age: 7,
      grade: 'Grade 2',
      favoriteColor: '🩷 Pink',
      dateAdded: 'March 15, 2024',
      lastActive: '2 hours ago',
      avatar: 'E',
      progress: {
        lessonsCompleted: 45,
        currentStreak: 12,
        averageScore: 89,
        totalTime: 180
      },
      controls: {
        timeLimit: 30,
        difficulty: 'beginner',
        contentRestrictions: ['advanced-topics'],
        pandaEnabled: true,
        soundEnabled: true
      }
    },
    {
      id: 'alex-2024',
      name: 'Alex Johnson',
      age: 5,
      grade: 'Kindergarten',
      favoriteColor: '🔵 Blue',
      dateAdded: 'April 8, 2024',
      lastActive: '1 day ago',
      avatar: 'A',
      progress: {
        lessonsCompleted: 23,
        currentStreak: 5,
        averageScore: 76,
        totalTime: 95
      },
      controls: {
        timeLimit: 20,
        difficulty: 'beginner',
        contentRestrictions: ['numbers-advanced', 'advanced-topics'],
        pandaEnabled: true,
        soundEnabled: true
      }
    },
    {
      id: 'maya-2024',
      name: 'Maya Johnson',
      age: 9,
      grade: 'Grade 4',
      favoriteColor: '🟢 Green',
      dateAdded: 'May 20, 2024',
      lastActive: '3 days ago',
      avatar: 'M',
      progress: {
        lessonsCompleted: 67,
        currentStreak: 8,
        averageScore: 94,
        totalTime: 280
      },
      controls: {
        timeLimit: 45,
        difficulty: 'intermediate',
        contentRestrictions: [],
        pandaEnabled: false,
        soundEnabled: true
      }
    }
  ]);

  if (!isOpen) return null;

  const handleChildClick = (child) => {
    console.log('Opening child controls for:', child.name);
    setSelectedChild(child);
    setShowChildControls(true);
  };

  const handleSetActive = (childId) => {
    setActiveChild(childId);
    // This would typically update the global app state
    alert(`${children.find(c => c.id === childId)?.name} is now the active child. All app pages will reflect this child's profile.`);
  };

  const handleDeleteChild = (childId) => {
    setShowDeleteConfirm(childId);
  };

  const confirmDeleteChild = () => {
    const childName = children.find(c => c.id === showDeleteConfirm)?.name;
    setChildren(prev => prev.filter(c => c.id !== showDeleteConfirm));
    
    // If deleting active child, set first remaining child as active
    if (activeChild === showDeleteConfirm) {
      const remainingChildren = children.filter(c => c.id !== showDeleteConfirm);
      if (remainingChildren.length > 0) {
        setActiveChild(remainingChildren[0].id);
      } else {
        setActiveChild(null);
      }
    }
    
    setShowDeleteConfirm(null);
    alert(`${childName} has been removed from your account.`);
  };

  const handleControlsUpdate = (childId, updatedControls) => {
    setChildren(prev => prev.map(child => 
      child.id === childId 
        ? { ...child, controls: updatedControls }
        : child
    ));
    
    // If this is the active child, the changes would reflect across all pages
    if (childId === activeChild) {
      alert('Control settings updated! Changes are now active across all app pages.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg border border-border shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Users" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-card-foreground">
                  Children List
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage all child profiles under your account
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children.length === 0 ? (
              /* No Children State */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="UserPlus" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                  No Children Added
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first child profile to get started with BuddySign
                </p>
                <Button onClick={onClose}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Add New Child
                </Button>
              </div>
            ) : (
              /* Children List */
              <div className="space-y-6">
                {/* Active Child Indicator */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Star" size={20} className="text-primary" />
                    <div>
                      <h3 className="text-sm font-body font-semibold text-card-foreground">
                        Currently Active Child
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {activeChild ? `${children.find(c => c.id === activeChild)?.name} - All app content is personalized for this child` : 'No active child selected'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Children Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className={`
                        bg-card border rounded-lg p-6 transition-all duration-200 hover:shadow-md relative
                        ${child.id === activeChild ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'}
                      `}
                    >
                      {/* Active Badge */}
                      {child.id === activeChild && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                          Active
                        </div>
                      )}

                      {/* Child Info */}
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-lg font-bold">
                              {child.avatar}
                            </div>
                            <div>
                              <h3 className="font-body font-semibold text-card-foreground">
                                {child.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {child.age} years • {child.grade}
                              </p>
                            </div>
                          </div>
                          
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteChild(child.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Favorite Color:</span>
                            <span className="text-card-foreground">{child.favoriteColor}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Last Active:</span>
                            <span className="text-card-foreground">{child.lastActive}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Lessons Done:</span>
                            <span className="text-card-foreground">{child.progress.lessonsCompleted}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-2 border-t border-border">
                          {child.id !== activeChild && (
                            <Button
                              variant="outline"
                              size="sm"
                              fullWidth
                              onClick={() => handleSetActive(child.id)}
                            >
                              <Icon name="Star" size={14} className="mr-2" />
                              Set as Active Child
                            </Button>
                          )}
                          
                          <Button
                            variant={child.id === activeChild ? "default" : "outline"}
                            size="sm"
                            fullWidth
                            onClick={() => handleChildClick(child)}
                          >
                            <Icon name="Settings" size={14} className="mr-2" />
                            Manage Controls
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Child */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Plus" size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-body font-semibold text-card-foreground mb-2">
                    Add Another Child
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Create a new child profile for your family
                  </p>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    <Icon name="UserPlus" size={14} className="mr-2" />
                    Add Child Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-4">
          <div className="bg-card rounded-lg border border-border shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} className="text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-card-foreground">
                    Remove Child Profile
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-body text-card-foreground">
                  Are you sure you want to remove <strong>{children.find(c => c.id === showDeleteConfirm)?.name}</strong>?
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                  <li>• All learning progress will be permanently deleted</li>
                  <li>• Profile settings and preferences will be lost</li>
                  <li>• This child will no longer have access to the app</li>
                </ul>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={confirmDeleteChild}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Remove Child
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Child Controls Modal - Rendered separately to appear on top */}
      <ChildControlModal
        isOpen={showChildControls}
        onClose={() => {
          setShowChildControls(false);
          setSelectedChild(null);
        }}
        child={selectedChild}
        onUpdate={handleControlsUpdate}
        isActive={selectedChild?.id === activeChild}
      />
    </>
  );
};

export default ChildrenListModal;