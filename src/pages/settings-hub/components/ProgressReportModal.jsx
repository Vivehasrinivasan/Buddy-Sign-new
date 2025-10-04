import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProgressReportModal = ({ isOpen, onClose }) => {
  const [childName, setChildName] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Mock child progress data
  const mockReportData = {
    childName: '',
    totalLessons: 25,
    completedLessons: 18,
    currentStreak: 7,
    averageScore: 87,
    totalTimeMinutes: 340,
    weakAreas: ['Numbers 6-10', 'Complex Emotions'],
    strongAreas: ['Basic Alphabet', 'Greetings', 'Family Members'],
    recentActivity: [
      { date: '2024-12-28', lesson: 'Colors & Shapes', score: 92, duration: 15 },
      { date: '2024-12-27', lesson: 'Animal Signs', score: 89, duration: 12 },
      { date: '2024-12-26', lesson: 'Food Items', score: 85, duration: 18 },
      { date: '2024-12-25', lesson: 'Action Words', score: 78, duration: 20 }
    ],
    progressByCategory: {
      alphabet: { completed: 8, total: 10, percentage: 80 },
      numbers: { completed: 3, total: 8, percentage: 38 },
      greetings: { completed: 5, total: 5, percentage: 100 },
      family: { completed: 4, total: 6, percentage: 67 },
      colors: { completed: 2, total: 4, percentage: 50 }
    }
  };

  if (!isOpen) return null;

  const handleSearchChild = () => {
    if (childName.trim()) {
      const report = { ...mockReportData, childName: childName.trim() };
      setReportData(report);
      setShowReport(true);
    } else {
      alert('Please enter a child name');
    }
  };

  const handleBackToSearch = () => {
    setShowReport(false);
    setChildName('');
    setReportData(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="BarChart3" size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-card-foreground">
                Progress Reports
              </h2>
              <p className="text-sm text-muted-foreground">
                {showReport ? `Report for ${reportData?.childName}` : 'Search for a child\'s progress'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showReport ? (
            /* Child Name Search */
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                  Find Child Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter the name or profile name of the child whose progress you want to view
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-body font-medium text-card-foreground mb-2 block">
                    Child Name or Profile Name
                  </label>
                  <Input
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter child's name (e.g., Emma, Alex, etc.)"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchChild()}
                  />
                </div>

                <Button onClick={handleSearchChild} fullWidth>
                  <Icon name="Search" size={16} className="mr-2" />
                  View Progress Report
                </Button>
              </div>

              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground text-center">
                  💡 Tip: You can search by the child's real name or their chosen profile name in the app
                </p>
              </div>
            </div>
          ) : (
            /* Progress Report Display */
            <div className="space-y-6">
              {/* Back Button */}
              <Button variant="ghost" onClick={handleBackToSearch}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Search
              </Button>

              {/* Report Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {reportData?.childName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-card-foreground">
                      {reportData?.childName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Learning Progress Report • Generated {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-success">
                    {reportData?.completedLessons}
                  </div>
                  <div className="text-xs text-muted-foreground">Lessons Completed</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-primary">
                    {reportData?.currentStreak}
                  </div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-accent">
                    {reportData?.averageScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Average Score</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-secondary">
                    {Math.floor(reportData?.totalTimeMinutes / 60)}h {reportData?.totalTimeMinutes % 60}m
                  </div>
                  <div className="text-xs text-muted-foreground">Total Time</div>
                </div>
              </div>

              {/* Progress by Category */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-heading font-semibold text-card-foreground mb-4">
                  Progress by Category
                </h4>
                <div className="space-y-4">
                  {Object.entries(reportData?.progressByCategory || {}).map(([category, progress]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-body text-card-foreground capitalize">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {progress.completed}/{progress.total} ({progress.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths and Areas to Improve */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h4 className="text-lg font-heading font-semibold text-card-foreground mb-4 flex items-center">
                    <Icon name="TrendingUp" size={20} className="text-success mr-2" />
                    Strong Areas
                  </h4>
                  <div className="space-y-2">
                    {reportData?.strongAreas?.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="Check" size={14} className="text-success" />
                        <span className="text-sm text-card-foreground">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h4 className="text-lg font-heading font-semibold text-card-foreground mb-4 flex items-center">
                    <Icon name="TrendingDown" size={20} className="text-warning mr-2" />
                    Areas to Improve
                  </h4>
                  <div className="space-y-2">
                    {reportData?.weakAreas?.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="AlertCircle" size={14} className="text-warning" />
                        <span className="text-sm text-card-foreground">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-heading font-semibold text-card-foreground mb-4">
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {reportData?.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="BookOpen" size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-body text-card-foreground">{activity.lesson}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-success">{activity.score}%</p>
                        <p className="text-xs text-muted-foreground">{activity.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressReportModal;