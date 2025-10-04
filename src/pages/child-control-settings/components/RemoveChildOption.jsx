import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, Download, Shield, Clock, X } from 'lucide-react';

const RemoveChildOption = ({ childData, onUpdate, isMobile }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [dataRetentionChoice, setDataRetentionChoice] = useState('');
  const [removalReason, setRemovalReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmationSteps = [
    {
      title: 'Confirm Removal',
      description: 'Are you sure you want to remove this child from your account?'
    },
    {
      title: 'Data Retention',
      description: 'What would you like to do with your child\'s learning data?'
    },
    {
      title: 'Final Confirmation',
      description: 'This action cannot be undone. Please type the child\'s name to confirm.'
    }
  ];

  const dataRetentionOptions = [
    {
      value: 'delete_all',
      title: 'Delete All Data',
      description: 'Permanently remove all learning progress, achievements, and personal data',
      icon: <Trash2 className="w-5 h-5 text-destructive" />,
      warning: 'This action is irreversible'
    },
    {
      value: 'export_delete',
      title: 'Export Then Delete',
      description: 'Download a copy of learning data, then permanently delete from our servers',
      icon: <Download className="w-5 h-5 text-warning" />,
      warning: 'You will receive an email with the data export'
    },
    {
      value: 'anonymize',
      title: 'Anonymize Data',
      description: 'Remove personal identifiers but keep anonymized learning data for educational research',
      icon: <Shield className="w-5 h-5 text-primary" />,
      warning: 'Data contributes to improving the learning experience for all children'
    },
    {
      value: 'archive',
      title: 'Archive Account',
      description: 'Temporarily deactivate but keep data for 90 days in case you change your mind',
      icon: <Clock className="w-5 h-5 text-success" />,
      warning: 'Account can be reactivated within 90 days'
    }
  ];

  const removalReasons = [
    'Child no longer needs the app',
    'Switching to a different learning platform',
    'Child has completed all learning goals',
    'Privacy/safety concerns',
    'Technical issues with the app',
    'Cost/subscription concerns',
    'Other (please specify)'
  ];

  const handleStartRemoval = () => {
    setShowConfirmation(true);
    setConfirmationStep(1);
  };

  const handleNextStep = () => {
    if (confirmationStep < 3) {
      setConfirmationStep(confirmationStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (confirmationStep > 1) {
      setConfirmationStep(confirmationStep - 1);
    }
  };

  const handleFinalRemoval = async () => {
    if (confirmText?.toLowerCase() !== childData?.name?.toLowerCase()) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, this would call the backend API
    console.log('Removing child with options:', {
      childId: childData?.id,
      dataRetention: dataRetentionChoice,
      reason: removalReason
    });
    
    setIsProcessing(false);
    setShowConfirmation(false);
    
    // Show success message or redirect
    alert('Child account has been removed successfully.');
  };

  const isConfirmTextValid = confirmText?.toLowerCase() === childData?.name?.toLowerCase();

  return (
    <div className="space-y-6">
      {/* Warning Card */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-destructive mt-1" />
          <div>
            <h4 className="font-semibold text-destructive mb-2">
              Danger Zone: Remove Child Account
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Removing a child account will affect their access to the learning platform. 
              This action has permanent consequences depending on your data retention choice.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-destructive rounded-full"></div>
                <span>Child will immediately lose access to their account</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-destructive rounded-full"></div>
                <span>Learning progress and achievements may be affected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-destructive rounded-full"></div>
                <span>Panda companion and unlocked rewards will be impacted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-destructive rounded-full"></div>
                <span>Family sharing and progress comparisons will be disabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Current Child Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-semibold text-foreground mb-4">Child Account to Remove</h4>
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={childData?.avatar}
            alt={childData?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-muted"
          />
          <div>
            <h5 className="text-lg font-semibold text-foreground">{childData?.name}</h5>
            <p className="text-muted-foreground">App Name: {childData?.fakeName}</p>
            <p className="text-sm text-muted-foreground">Age: {childData?.age} • Account active since: Sept 2024</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="font-semibold text-foreground">{childData?.totalPoints}</div>
            <div className="text-muted-foreground">Points Earned</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="font-semibold text-foreground">{childData?.lessonsCompleted}</div>
            <div className="text-muted-foreground">Lessons Done</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="font-semibold text-foreground">{childData?.currentStreak}</div>
            <div className="text-muted-foreground">Day Streak</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="font-semibold text-foreground">3</div>
            <div className="text-muted-foreground">Achievements</div>
          </div>
        </div>
      </div>
      {/* Remove Button */}
      <div className="flex justify-center">
        <button
          onClick={handleStartRemoval}
          className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center space-x-2 font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          <span>Remove Child Account</span>
        </button>
      </div>
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !isProcessing && setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e?.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    {confirmationSteps?.[confirmationStep - 1]?.title}
                  </h3>
                  {!isProcessing && (
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground mt-2">
                  {confirmationSteps?.[confirmationStep - 1]?.description}
                </p>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {/* Step 1: Initial Confirmation */}
                {confirmationStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        This will remove <strong>{childData?.name}</strong> from your family account.
                        Please select a reason for removal to help us improve our service.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-muted-foreground">
                        Reason for removal (optional)
                      </label>
                      <select
                        value={removalReason}
                        onChange={(e) => setRemovalReason(e?.target?.value)}
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a reason...</option>
                        {removalReasons?.map((reason, index) => (
                          <option key={index} value={reason}>{reason}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Data Retention Choice */}
                {confirmationStep === 2 && (
                  <div className="space-y-4">
                    {dataRetentionOptions?.map(option => (
                      <label
                        key={option?.value}
                        className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          dataRetentionChoice === option?.value
                            ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="dataRetention"
                          value={option?.value}
                          checked={dataRetentionChoice === option?.value}
                          onChange={(e) => setDataRetentionChoice(e?.target?.value)}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-3 flex-1">
                          {option?.icon}
                          <div>
                            <div className="font-medium text-foreground mb-1">
                              {option?.title}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {option?.description}
                            </div>
                            <div className="text-xs text-warning">
                              ⚠️ {option?.warning}
                            </div>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 mt-1 ${
                          dataRetentionChoice === option?.value
                            ? 'border-primary bg-primary' :'border-muted'
                        }`}>
                          {dataRetentionChoice === option?.value && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Step 3: Final Confirmation */}
                {confirmationStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <span className="font-semibold text-destructive">Final Warning</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone. The child's account and associated data will be 
                        handled according to your selection: <strong>{dataRetentionChoice?.replace('_', ' ')}</strong>
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Type the child's name "<strong>{childData?.name}</strong>" to confirm:
                      </label>
                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e?.target?.value)}
                        placeholder={childData?.name}
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    {isProcessing && (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground mt-2">Processing removal...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {!isProcessing && (
                <div className="p-6 border-t border-border">
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      {confirmationStep > 1 && (
                        <button
                          onClick={handlePreviousStep}
                          className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          Previous
                        </button>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        Cancel
                      </button>
                      
                      {confirmationStep < 3 ? (
                        <button
                          onClick={handleNextStep}
                          disabled={confirmationStep === 2 && !dataRetentionChoice}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={handleFinalRemoval}
                          disabled={!isConfirmTextValid}
                          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          Remove Child Account
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RemoveChildOption;