import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import ProfileSettingsModal from './ProfileSettingsModal';
import ProgressReportModal from './ProgressReportModal';
import AddChildModal from './AddChildModal';
import ChildrenListModal from './ChildrenListModal';

const QuickActions = ({ className = '', user }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showChildrenListModal, setShowChildrenListModal] = useState(false);

  const quickActions = [
    {
      id: 'profile-settings',
      title: 'Profile Settings',
      description: 'Update your profile information',
      icon: 'User',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      action: () => setShowProfileModal(true)
    },
    {
      id: 'children-list',
      title: 'Children List',
      description: 'Manage all child profiles and controls',
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      action: () => setShowChildrenListModal(true)
    },
    {
      id: 'add-child',
      title: 'Add New Child',
      description: 'Register a new child profile',
      icon: 'UserPlus',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      action: () => setShowAddChildModal(true)
    },
    {
      id: 'view-reports',
      title: 'Progress Reports',
      description: 'View detailed analytics',
      icon: 'BarChart3',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      action: () => setShowReportModal(true)
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      description: 'Get help and assistance',
      icon: 'MessageCircle',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      action: () => alert('Support contact functionality would be implemented here')
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Quick Actions
        </h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.action}
            className="bg-card rounded-lg border border-border p-4 hover:shadow-medium transition-all duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 ${action?.bgColor} rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={action?.icon} size={20} className={action?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-body font-medium text-card-foreground mb-1">
                  {action?.title}
                </h4>
                <p className="text-xs font-caption text-muted-foreground">
                  {action?.description}
                </p>
              </div>
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" 
              />
            </div>
          </button>
        ))}
      </div>

      {/* Modals */}
      <ProfileSettingsModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)}
        user={user}
      />
      
      <ProgressReportModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)}
      />
      
      <AddChildModal 
        isOpen={showAddChildModal} 
        onClose={() => setShowAddChildModal(false)}
      />
      
      <ChildrenListModal 
        isOpen={showChildrenListModal} 
        onClose={() => setShowChildrenListModal(false)}
      />
    </div>
  );
};

export default QuickActions;