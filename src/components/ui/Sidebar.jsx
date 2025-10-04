import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ 
  isCollapsed = false, 
  onToggle = () => {}, 
  user = null,
  onAuthRequired = () => {},
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Home',
      path: '/home-dashboard',
      icon: 'Home',
      authRequired: false,
      tooltip: 'Your panda friend and progress overview'
    },
    {
      label: 'Lessons',
      path: '/interactive-lessons',
      icon: 'BookOpen',
      authRequired: false,
      tooltip: 'Interactive sign language lessons'
    },
    {
      label: 'Dictionary',
      path: '/dictionary-browser',
      icon: 'Search',
      authRequired: false,
      tooltip: 'Browse sign language vocabulary'
    },
    {
      label: 'Settings',
      path: '/settings-hub',
      icon: 'Settings',
      authRequired: true,
      tooltip: 'Parent controls and preferences'
    }
  ];

  const handleNavigation = (item) => {
    if (item?.authRequired && !user?.isParent) {
      onAuthRequired(item?.path);
      return;
    }
    navigate(item?.path);
    setIsMobileOpen(false);
  };

  const isActive = (path) => location?.pathname === path;

  const shouldShowExpanded = !isCollapsed || isHovered;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden bg-card shadow-medium"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={20} />
      </Button>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border z-50
          transition-all duration-300 ease-in-out
          ${shouldShowExpanded ? 'w-60' : 'w-16'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full p-4">
          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navigationItems?.map((item) => {
              const active = isActive(item?.path);
              
              return (
                <div key={item?.path} className="relative group">
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-3 rounded-lg
                      transition-all duration-200 ease-in-out
                      focus-ring min-h-44
                      ${active 
                        ? 'bg-primary text-primary-foreground shadow-soft' 
                        : 'text-foreground hover:bg-muted/50 hover:text-foreground'
                      }
                      ${item?.authRequired && !user?.isParent ? 'opacity-75' : ''}
                    `}
                  >
                    <div className="flex-shrink-0">
                      <Icon 
                        name={item?.icon} 
                        size={20} 
                        color={active ? 'currentColor' : 'currentColor'}
                      />
                    </div>
                    
                    {shouldShowExpanded && (
                      <span className="font-body font-medium text-sm truncate">
                        {item?.label}
                      </span>
                    )}

                    {item?.authRequired && shouldShowExpanded && (
                      <Icon 
                        name="Lock" 
                        size={14} 
                        className="ml-auto flex-shrink-0 opacity-60"
                      />
                    )}
                  </button>
                  {/* Tooltip for collapsed state */}
                  {!shouldShowExpanded && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs font-caption rounded-md shadow-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item?.tooltip}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Points Progress Indicator */}
          {user && shouldShowExpanded && (
            <div className="border-t border-border pt-4 mt-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Star" size={16} className="text-accent" />
                  <span className="font-caption text-xs text-muted-foreground">
                    Progress Points
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((user?.points || 0) / 1000 * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-foreground font-medium">
                    {user?.points || 0}
                  </span>
                </div>
              </div>
            </div>
          )}


        </div>
      </aside>
    </>
  );
};

export default Sidebar;