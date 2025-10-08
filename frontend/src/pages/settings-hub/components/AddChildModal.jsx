import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddChildModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    childName: '',
    age: '',
    dateOfBirth: '',
    gradeLevel: '',
    learningNeeds: '',
    favoriteColor: '',
    interests: '',
    profilePicture: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.childName || !formData.age || !formData.dateOfBirth) {
      alert('Please fill in all required fields');
      return;
    }

    alert(`Child profile created successfully!\n\nName: ${formData.childName}\nAge: ${formData.age}\nGrade: ${formData.gradeLevel}\nInterests: ${formData.interests}`);
    
    // Reset form
    setFormData({
      childName: '',
      age: '',
      dateOfBirth: '',
      gradeLevel: '',
      learningNeeds: '',
      favoriteColor: '',
      interests: '',
      profilePicture: null
    });
    setCurrentStep(1);
    onClose();
  };

  const gradeOptions = [
    { value: '', label: 'Select Grade Level' },
    { value: 'preschool', label: 'Preschool (3-4 years)' },
    { value: 'kindergarten', label: 'Kindergarten (5-6 years)' },
    { value: 'grade-1', label: 'Grade 1 (6-7 years)' },
    { value: 'grade-2', label: 'Grade 2 (7-8 years)' },
    { value: 'grade-3', label: 'Grade 3 (8-9 years)' },
    { value: 'grade-4', label: 'Grade 4 (9-10 years)' },
    { value: 'grade-5', label: 'Grade 5 (10-11 years)' },
    { value: 'other', label: 'Other/Homeschool' }
  ];

  const colorOptions = [
    { value: '', label: 'Select Favorite Color' },
    { value: 'red', label: '🔴 Red' },
    { value: 'blue', label: '🔵 Blue' },
    { value: 'green', label: '🟢 Green' },
    { value: 'yellow', label: '🟡 Yellow' },
    { value: 'purple', label: '🟣 Purple' },
    { value: 'orange', label: '🟠 Orange' },
    { value: 'pink', label: '🩷 Pink' },
    { value: 'rainbow', label: '🌈 Rainbow' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="UserPlus" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-card-foreground">
                Add New Child
              </h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}: {
                  currentStep === 1 ? 'Basic Information & Preferences' : 'Profile Setup'
                }
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center space-x-2 mb-6">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                  ${currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  {step}
                </div>
                {step < 2 && (
                  <div className={`
                    flex-1 h-1 rounded transition-colors
                    ${currentStep > step ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
                  Basic Information & Preferences
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                      Child's Name *
                    </label>
                    <Input
                      value={formData.childName}
                      onChange={(e) => handleInputChange('childName', e.target.value)}
                      placeholder="Enter your child's name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                        Age *
                      </label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Age"
                        min="2"
                        max="18"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                        Date of Birth *
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                        Grade Level
                      </label>
                      <Select
                        value={formData.gradeLevel}
                        onValueChange={(value) => handleInputChange('gradeLevel', value)}
                        options={gradeOptions}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                        Favorite Color
                      </label>
                      <Select
                        value={formData.favoriteColor}
                        onValueChange={(value) => handleInputChange('favoriteColor', value)}
                        options={colorOptions}
                      />
                    </div>
                  </div>


                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile Setup */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
                  Profile Setup
                </h3>
                
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {formData.childName ? formData.childName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <h4 className="font-body font-medium text-card-foreground mb-2">Profile Picture</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload a photo or choose an avatar (optional)
                    </p>
                    <Button variant="outline" size="sm">
                      <Icon name="Camera" size={16} className="mr-2" />
                      Choose Photo
                    </Button>
                  </div>

                  {/* Summary */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <h4 className="font-body font-medium text-card-foreground mb-3">Profile Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="text-card-foreground font-medium">{formData.childName || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span className="text-card-foreground font-medium">{formData.age || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Grade:</span>
                        <span className="text-card-foreground font-medium">
                          {gradeOptions.find(g => g.value === formData.gradeLevel)?.label || 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Favorite Color:</span>
                        <span className="text-card-foreground font-medium">
                          {colorOptions.find(c => c.value === formData.favoriteColor)?.label || 'Not selected'}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="Shield" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-body font-semibold text-card-foreground mb-1">
                          Privacy & Safety
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          All child information is encrypted and stored securely. Only parent accounts can access and modify child profiles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevStep}>
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {currentStep < totalSteps ? (
                <Button onClick={handleNextStep}>
                  Next
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Create Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChildModal;