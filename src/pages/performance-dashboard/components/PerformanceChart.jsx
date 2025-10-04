import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceChart = ({ data = [], className = "" }) => {
  const [activeMetric, setActiveMetric] = useState('accuracy');
  
  const metrics = [
    { key: 'accuracy', label: 'Accuracy', color: '#3b82f6', icon: 'Target' },
    { key: 'speed', label: 'Speed', color: '#10b981', icon: 'Zap' },
    { key: 'consistency', label: 'Consistency', color: '#f59e0b', icon: 'TrendingUp' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-body font-semibold text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs font-caption">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="text-foreground font-semibold">{entry?.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getAverageImprovement = () => {
    if (data?.length < 2) return 0;
    const firstWeek = data?.[0];
    const lastWeek = data?.[data?.length - 1];
    const improvement = ((lastWeek?.[activeMetric] - firstWeek?.[activeMetric]) / firstWeek?.[activeMetric]) * 100;
    return Math.round(improvement);
  };

  return (
    <div className={`bg-card rounded-xl shadow-soft border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="BarChart3" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Performance Trends
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Track your improvement over time
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-caption text-muted-foreground">Improvement</div>
            <div className={`text-lg font-mono font-bold ${getAverageImprovement() >= 0 ? 'text-success' : 'text-destructive'}`}>
              {getAverageImprovement() >= 0 ? '+' : ''}{getAverageImprovement()}%
            </div>
          </div>
        </div>
      </div>
      {/* Metric Selector */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {metrics?.map((metric) => (
            <motion.button
              key={metric?.key}
              onClick={() => setActiveMetric(metric?.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg
                text-sm font-body transition-all duration-200
                ${activeMetric === metric?.key 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }
              `}
            >
              <Icon 
                name={metric?.icon} 
                size={16} 
              />
              <span>{metric?.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            
            {activeMetric === 'accuracy' && (
              <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            )}
            {activeMetric === 'speed' && (
              <Bar dataKey="speed" fill="#10b981" radius={[4, 4, 0, 0]} />
            )}
            {activeMetric === 'consistency' && (
              <Bar dataKey="consistency" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            )}
            
            {activeMetric === 'all' && (
              <>
                <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="speed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="consistency" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Insights */}
      <div className="p-4 bg-muted/20 border-t border-border">
        <div className="flex items-center space-x-3">
          <Icon 
            name="Lightbulb" 
            size={16} 
            className="text-accent" 
          />
          <div className="flex-1">
            <h4 className="text-sm font-body font-semibold text-foreground">
              Performance Insight
            </h4>
            <p className="text-xs font-caption text-muted-foreground">
              {getAverageImprovement() >= 20 
                ? "Excellent progress! You're mastering sign language quickly."
                : getAverageImprovement() >= 10 
                ? "Good improvement trend. Keep practicing regularly!"
                : getAverageImprovement() >= 0
                ? "Steady progress. Try focusing on your weak areas." :"Don't worry! Learning curves vary. Keep practicing!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;