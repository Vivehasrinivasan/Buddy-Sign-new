import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SignUpForm = ({ onSubmit, isLoading = false, className = '' }) => {
  const [formData, setFormData] = useState({
    childName: '',
    parentEmail: '',
    password: '',
    confirmPassword: '',
    childAge: '',
    agreeToTerms: false,
    parentConsent: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const ageOptions = [
    { value: '5', label: '5 years old' },
    { value: '6', label: '6 years old' },
    { value: '7', label: '7 years old' },
    { value: '8', label: '8 years old' },
    { value: '9', label: '9 years old' },
    { value: '10', label: '10 years old' },
    { value: '11', label: '11 years old' },
    { value: '12', label: '12 years old' }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength++;
    if (/[A-Z]/?.test(password)) strength++;
    if (/[a-z]/?.test(password)) strength++;
    if (/[0-9]/?.test(password)) strength++;
    if (/[^A-Za-z0-9]/?.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'bg-error';
      case 2: return 'bg-warning';
      case 3: return 'bg-accent';
      case 4: return 'bg-success';
      case 5: return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.childName?.trim()) {
      newErrors.childName = 'Child name is required';
    } else if (formData?.childName?.trim()?.length < 2) {
      newErrors.childName = 'Name must be at least 2 characters';
    }
    
    if (!formData?.parentEmail?.trim()) {
      newErrors.parentEmail = 'Parent email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }
    
    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData?.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.childAge) {
      newErrors.childAge = 'Please select child age';
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    if (!formData?.parentConsent) {
      newErrors.parentConsent = 'Parent consent is required for child accounts';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <Input
        label="Child's Name"
        type="text"
        placeholder="Enter your child's name"
        value={formData?.childName}
        onChange={(e) => handleInputChange('childName', e?.target?.value)}
        error={errors?.childName}
        required
        disabled={isLoading}
        className="transition-all duration-200 focus-within:scale-[1.02]"
      />
      <Input
        label="Parent Email"
        type="email"
        placeholder="Enter your email address"
        value={formData?.parentEmail}
        onChange={(e) => handleInputChange('parentEmail', e?.target?.value)}
        error={errors?.parentEmail}
        required
        disabled={isLoading}
        className="transition-all duration-200 focus-within:scale-[1.02]"
      />
      <Select
        label="Child's Age"
        placeholder="Select age"
        options={ageOptions}
        value={formData?.childAge}
        onChange={(value) => handleInputChange('childAge', value)}
        error={errors?.childAge}
        required
        disabled={isLoading}
        className="transition-all duration-200"
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
          disabled={isLoading}
          className="transition-all duration-200 focus-within:scale-[1.02]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
        </button>
        
        {formData?.password && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-caption text-muted-foreground">
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className={`flex items-center space-x-1 ${formData?.password?.length >= 8 ? 'text-success' : ''}`}>
                <Icon name={formData?.password?.length >= 8 ? 'Check' : 'X'} size={12} />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center space-x-1 ${/[A-Z]/?.test(formData?.password) ? 'text-success' : ''}`}>
                <Icon name={/[A-Z]/?.test(formData?.password) ? 'Check' : 'X'} size={12} />
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center space-x-1 ${/[0-9]/?.test(formData?.password) ? 'text-success' : ''}`}>
                <Icon name={/[0-9]/?.test(formData?.password) ? 'Check' : 'X'} size={12} />
                <span>One number</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
          className="transition-all duration-200 focus-within:scale-[1.02]"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
        </button>
      </div>
      <div className="space-y-3 pt-2">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={formData?.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
          error={errors?.agreeToTerms}
          disabled={isLoading}
          size="sm"
        />
        
        <Checkbox
          label="I consent to creating an account for my child and understand parental controls are available"
          checked={formData?.parentConsent}
          onChange={(e) => handleInputChange('parentConsent', e?.target?.checked)}
          error={errors?.parentConsent}
          disabled={isLoading}
          size="sm"
        />
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={isLoading}
        fullWidth
        className="mt-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-[1.02]"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Demo: Use any valid email format and password with 8+ characters
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;