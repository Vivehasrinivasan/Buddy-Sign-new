import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StrengthsWeaknesses = ({ strengths = [], weaknesses = [] }) => {
  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-success/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-success rounded-lg">
            <Icon name="Brain" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Skills Analysis
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Personalized insights and recommendations
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Strengths Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="TrendingUp" size={18} className="text-success" />
            <h4 className="text-sm font-body font-semibold text-foreground">
              Your Strengths
            </h4>
          </div>
          
          <div className="space-y-3">
            {strengths?.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-success/10 rounded-lg p-4 border border-success/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-body font-medium text-foreground">
                      {strength?.skill}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-success">
                      {strength?.accuracy}%
                    </div>
                    <div className="text-xs font-caption text-success">
                      {strength?.improvement}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${strength?.accuracy}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weaknesses Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Target" size={18} className="text-accent" />
            <h4 className="text-sm font-body font-semibold text-foreground">
              Areas for Improvement
            </h4>
          </div>
          
          <div className="space-y-3">
            {weaknesses?.map((weakness, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (strengths?.length + index) * 0.1 }}
                className="bg-accent/10 rounded-lg p-4 border border-accent/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-accent" />
                    <span className="text-sm font-body font-medium text-foreground">
                      {weakness?.skill}
                    </span>
                  </div>
                  <div className="text-sm font-mono font-bold text-accent">
                    {weakness?.accuracy}%
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2 mb-3">
                  <motion.div 
                    className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${weakness?.accuracy}%` }}
                    transition={{ duration: 1, delay: (strengths?.length + index) * 0.1 + 0.3 }}
                  />
                </div>
                
                {/* Recommendation */}
                <div className="bg-accent/5 rounded-md p-3 border border-accent/10">
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={14} className="text-accent mt-0.5" />
                    <p className="text-xs font-caption text-muted-foreground">
                      <span className="font-medium text-foreground">Tip: </span>
                      {weakness?.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="bg-gradient-to-r from-primary/5 to-success/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-center space-x-3">
            <Icon 
              name="Heart" 
              size={18} 
              className="text-primary animate-pulse" 
            />
            <div>
              <h5 className="text-sm font-body font-semibold text-foreground">
                Keep Growing!
              </h5>
              <p className="text-xs font-caption text-muted-foreground">
                Your dedication to learning is inspiring. Focus on your improvement areas and celebrate your strengths!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrengthsWeaknesses;