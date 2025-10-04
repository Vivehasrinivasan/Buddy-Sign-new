import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChildrenManager = ({ children = [], onChildUpdate, onAddChild, onRemoveChild }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [newChildData, setNewChildData] = useState({
    name: '',
    fakeName: '',
    age: '',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
  });

  const avatarOptions = [
    'https://randomuser.me/api/portraits/lego/1.jpg',
    'https://randomuser.me/api/portraits/lego/2.jpg',
    'https://randomuser.me/api/portraits/lego/3.jpg',
    'https://randomuser.me/api/portraits/lego/4.jpg',
    'https://randomuser.me/api/portraits/lego/5.jpg',
    'https://randomuser.me/api/portraits/lego/6.jpg',
    'https://randomuser.me/api/portraits/lego/7.jpg',
    'https://randomuser.me/api/portraits/lego/8.jpg'
  ];

  const generateFakeName = () => {
    const adjectives = ['Smart', 'Brave', 'Happy', 'Creative', 'Amazing', 'Super', 'Wonder', 'Little'];
    const nouns = ['Panda', 'Explorer', 'Star', 'Hero', 'Learner', 'Champion', 'Genius', 'Friend'];
    const adjective = adjectives?.[Math.floor(Math.random() * adjectives?.length)];
    const noun = nouns?.[Math.floor(Math.random() * nouns?.length)];
    return `${adjective} ${noun}`;
  };

  const handleAddChild = () => {
    if (newChildData?.name && newChildData?.age) {
      const childToAdd = {
        ...newChildData,
        age: parseInt(newChildData?.age),
        fakeName: newChildData?.fakeName || generateFakeName(),
        isActive: false
      };
      onAddChild(childToAdd);
      setNewChildData({
        name: '',
        fakeName: '',
        age: '',
        avatar: avatarOptions?.[0]
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateChild = (childId, updates) => {
    onChildUpdate(childId, updates);
    setEditingChild(null);
  };

  const handleDeleteChild = (childId) => {
    onRemoveChild(childId);
    setConfirmDelete(null);
  };

  const toggleChildActive = (childId, isActive) => {
    onChildUpdate(childId, { isActive: !isActive });
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="Users" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Children Management
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Add, remove, and configure child profiles with privacy protection
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors text-sm font-body"
          >
            <Icon name="Plus" size={16} />
            <span>Add Child</span>
          </motion.button>
        </div>
      </div>
      <div className="p-6">
        {/* Existing Children */}
        <div className="space-y-4 mb-6">
          {children?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm font-body">No children profiles yet. Add your first child to get started!</p>
            </div>
          ) : (
            children?.map((child) => (
              <motion.div
                key={child?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  border rounded-lg p-4 transition-all duration-300
                  ${child?.isActive 
                    ? 'border-success bg-success/5' :'border-border bg-muted/20'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  {/* Child Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={child?.avatar}
                      alt={child?.fakeName}
                      className="w-12 h-12 rounded-full border-2 border-border"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-body font-semibold text-foreground">
                          {child?.fakeName}
                        </h4>
                        {child?.isActive && (
                          <span className="text-xs bg-success text-white px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-caption text-muted-foreground">
                        Age: {child?.age} • Real name: {child?.name} • Points: {child?.totalPoints}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs font-caption text-muted-foreground">
                        <span>Lessons: {child?.lessonsCompleted}</span>
                        <span>Streak: {child?.currentStreak} days</span>
                        <span>Last active: {child?.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleChildActive(child?.id, child?.isActive)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-body transition-colors
                        ${child?.isActive
                          ? 'bg-accent text-white hover:bg-accent/90' :'bg-success text-white hover:bg-success/90'
                        }
                      `}
                    >
                      {child?.isActive ? 'Set Inactive' : 'Set Active'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingChild(child)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Icon name="Edit" size={16} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConfirmDelete(child)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Icon name="Trash2" size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Safety Settings Preview */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-4 text-xs font-caption text-muted-foreground">
                    <div>
                      <strong className="text-foreground">Screen Time:</strong><br />
                      {child?.safetySettings?.screenTime} minutes/day
                    </div>
                    <div>
                      <strong className="text-foreground">Content Filter:</strong><br />
                      {child?.safetySettings?.contentFilter}
                    </div>
                    <div>
                      <strong className="text-foreground">Social Features:</strong><br />
                      {child?.safetySettings?.socialFeatures ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={18} className="text-accent mt-0.5" />
            <div>
              <h5 className="text-sm font-body font-semibold text-foreground">
                Privacy Protection
              </h5>
              <p className="text-xs font-caption text-muted-foreground mt-1">
                Real names are encrypted and never displayed to children. Fake names are used throughout the app for safety. All data is protected with industry-standard encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Add Child Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e?.stopPropagation()}
              className="bg-card rounded-xl p-6 max-w-md w-full border border-border shadow-2xl"
            >
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                Add New Child
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-2">
                    Real Name (Private)
                  </label>
                  <Input
                    value={newChildData?.name}
                    onChange={(e) => setNewChildData(prev => ({ ...prev, name: e?.target?.value }))}
                    placeholder="Enter child's real name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-2">
                    Display Name (Public)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newChildData?.fakeName}
                      onChange={(e) => setNewChildData(prev => ({ ...prev, fakeName: e?.target?.value }))}
                      placeholder="Enter display name or generate"
                    />
                    <Button
                      onClick={() => setNewChildData(prev => ({ ...prev, fakeName: generateFakeName() }))}
                      className="px-3 py-2"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-2">
                    Age
                  </label>
                  <Input
                    type="number"
                    min="3"
                    max="18"
                    value={newChildData?.age}
                    onChange={(e) => setNewChildData(prev => ({ ...prev, age: e?.target?.value }))}
                    placeholder="Enter age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-2">
                    Avatar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {avatarOptions?.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => setNewChildData(prev => ({ ...prev, avatar }))}
                        className={`
                          w-12 h-12 rounded-full border-2 transition-all
                          ${newChildData?.avatar === avatar 
                            ? 'border-primary scale-110' :'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full rounded-full" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-muted text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddChild}
                  disabled={!newChildData?.name || !newChildData?.age}
                  className="px-4 py-2"
                >
                  Add Child
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e?.stopPropagation()}
              className="bg-card rounded-xl p-6 max-w-md w-full border border-border shadow-2xl"
            >
              <div className="text-center">
                <Icon name="AlertTriangle" size={48} className="mx-auto mb-4 text-destructive" />
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Remove Child Profile?
                </h3>
                <p className="text-sm font-body text-muted-foreground mb-6">
                  This will permanently delete {confirmDelete?.fakeName}'s profile and all associated data. This action cannot be undone.
                </p>

                <div className="flex items-center justify-center space-x-3">
                  <Button
                    onClick={() => setConfirmDelete(null)}
                    className="px-4 py-2 bg-muted text-muted-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteChild(confirmDelete?.id)}
                    className="px-4 py-2 bg-destructive text-white"
                  >
                    Remove Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChildrenManager;