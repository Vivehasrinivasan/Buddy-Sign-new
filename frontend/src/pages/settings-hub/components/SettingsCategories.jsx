import React from 'react';
import Icon from '../../../components/AppIcon';

const SettingsCategories = ({ className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Empty Overview Message */}
      <div className="text-center py-12">
        <div className="mb-4">
          <Icon name="Settings" size={48} className="text-muted-foreground mx-auto" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Overview Section
        </h2>
        <p className="text-sm font-body text-muted-foreground max-w-md mx-auto">
          This section has been simplified. All main functions are now available in Quick Actions for easier access.
        </p>
        <div className="mt-6">
          <p className="text-xs font-caption text-muted-foreground">
            Use the Quick Actions tab to manage children, profile settings, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsCategories;