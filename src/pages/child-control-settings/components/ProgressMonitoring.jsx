import React, { useState } from 'react';

import { BarChart, TrendingUp, Download, Calendar, Activity, Award } from 'lucide-react';

const ProgressMonitoring = ({ childData, onUpdate, isMobile }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [reportType, setReportType] = useState('overview');

  // Mock analytics data
  const analyticsData = {
    week: {
      sessions: [
        { date: '2024-09-19', duration: 25, accuracy: 85, lessons: 3 },
        { date: '2024-09-20', duration: 30, accuracy: 90, lessons: 4 },
        { date: '2024-09-21', duration: 20, accuracy: 82, lessons: 2 },
        { date: '2024-09-22', duration: 35, accuracy: 95, lessons: 5 },
        { date: '2024-09-23', duration: 28, accuracy: 88, lessons: 3 },
        { date: '2024-09-24', duration: 22, accuracy: 86, lessons: 2 },
        { date: '2024-09-25', duration: 40, accuracy: 92, lessons: 6 }
      ],
      totalSessions: 7,
      averageAccuracy: 88,
      totalTime: 200,
      lessonsCompleted: 25
    },
    month: {
      sessions: Array.from({ length: 30 }, (_, i) => ({
        date: `2024-09-${String(i + 1)?.padStart(2, '0')}`,
        duration: Math.floor(Math.random() * 30) + 15,
        accuracy: Math.floor(Math.random() * 20) + 80,
        lessons: Math.floor(Math.random() * 4) + 1
      })),
      totalSessions: 30,
      averageAccuracy: 87,
      totalTime: 720,
      lessonsCompleted: 85
    }
  };

  const currentData = analyticsData?.[selectedTimeframe];

  const performanceTrends = {
    accuracy: {
      current: 88,
      previous: 84,
      trend: '+4%',
      status: 'improving'
    },
    speed: {
      current: 15,
      previous: 18,
      trend: '-17%',
      status: 'improving'
    },
    consistency: {
      current: 92,
      previous: 89,
      trend: '+3%',
      status: 'improving'
    }
  };

  const strengthsAndWeaknesses = {
    strengths: [
      { skill: 'Family Signs', accuracy: 95, sessions: 12 },
      { skill: 'Numbers', accuracy: 92, sessions: 8 },
      { skill: 'Colors', accuracy: 89, sessions: 10 }
    ],
    weaknesses: [
      { skill: 'Complex Phrases', accuracy: 68, sessions: 5 },
      { skill: 'Speed Recognition', accuracy: 72, sessions: 6 },
      { skill: 'Finger Spelling', accuracy: 75, sessions: 4 }
    ]
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    const reportData = {
      child: childData?.name,
      period: selectedTimeframe,
      data: currentData,
      trends: performanceTrends,
      strengths: strengthsAndWeaknesses
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${childData?.name}_progress_report_${selectedTimeframe}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  const getTrendColor = (status) => {
    switch (status) {
      case 'improving': return 'text-success';
      case 'declining': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (status) => {
    return status === 'improving' ? '📈' : status === 'declining' ? '📉' : '➡️';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Time Period
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e?.target?.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e?.target?.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed Analytics</option>
              <option value="comparison">Progress Comparison</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold text-success">{currentData?.totalSessions}</p>
            </div>
            <Activity className="w-8 h-8 text-success" />
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              <p className="text-2xl font-bold text-primary">{currentData?.averageAccuracy}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-2xl font-bold text-warning">{Math.floor(currentData?.totalTime / 60)}h {currentData?.totalTime % 60}m</p>
            </div>
            <Calendar className="w-8 h-8 text-warning" />
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lessons Done</p>
              <p className="text-2xl font-bold text-accent">{currentData?.lessonsCompleted}</p>
            </div>
            <Award className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>
      {/* Performance Trends */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-semibold text-foreground mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Performance Trends
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(performanceTrends)?.map(([metric, data]) => (
            <div key={metric} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-foreground capitalize">{metric}</h5>
                <span className="text-xl">{getTrendIcon(data?.status)}</span>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {data?.current}{metric === 'speed' ? 's' : '%'}
                </span>
                <span className={`text-sm font-medium ${getTrendColor(data?.status)}`}>
                  {data?.trend}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                vs previous {selectedTimeframe}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Session History Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-primary" />
            Session History
          </h4>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Accuracy</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Duration</span>
            </div>
          </div>
        </div>
        
        {/* Simple chart representation */}
        <div className="space-y-2">
          {currentData?.sessions?.slice(-7)?.map((session, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="text-sm text-muted-foreground w-20">
                {new Date(session?.date)?.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(session?.accuracy / 100) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12">
                  {session?.accuracy}%
                </span>
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${(session?.duration / 40) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12">
                  {session?.duration}m
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-success/5 border border-success/20 rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            💪 Strengths
          </h4>
          <div className="space-y-3">
            {strengthsAndWeaknesses?.strengths?.map((strength, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{strength?.skill}</div>
                  <div className="text-xs text-muted-foreground">{strength?.sessions} sessions</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-success">{strength?.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-warning/5 border border-warning/20 rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            🎯 Areas for Improvement
          </h4>
          <div className="space-y-3">
            {strengthsAndWeaknesses?.weaknesses?.map((weakness, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{weakness?.skill}</div>
                  <div className="text-xs text-muted-foreground">{weakness?.sessions} sessions</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-warning">{weakness?.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressMonitoring;