import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import DateRangePicker from '../components/common/DateRangePicker';
import Button from '../components/common/Button';
import { getRecentChanges, WikidataEdit } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = [
  { value: 'activity-over-time', label: 'Activity Over Time' },
  { value: 'users-leaderboard', label: 'Top Contributors' },
  { value: 'edits-distribution', label: 'Edits Distribution' },
];

const Analytics: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<string>('activity-over-time');
  const [dateRange, setDateRange] = useState({
    from: '2023-01-01',
    to: '2024-12-31',
  });
  
  const [edits, setEdits] = useState<WikidataEdit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await getRecentChanges(dateRange, 500);
      setEdits(results);
    } catch (err) {
      setError('Failed to fetch data for analytics. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Process data for activity over time chart
  const getActivityOverTimeData = () => {
    if (edits.length === 0) return null;
    
    const dateMap = new Map<string, number>();
    
    edits.forEach(edit => {
      const date = new Date(edit.timestamp).toLocaleDateString();
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });
    
    const sortedDates = Array.from(dateMap.keys()).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Number of Edits',
          data: sortedDates.map(date => dateMap.get(date) || 0),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.3,
        },
      ],
    };
  };
  
  // Process data for top contributors chart
  const getTopContributorsData = () => {
    if (edits.length === 0) return null;
    
    const userMap = new Map<string, number>();
    
    edits.forEach(edit => {
      userMap.set(edit.user, (userMap.get(edit.user) || 0) + 1);
    });
    
    const topUsers = Array.from(userMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    return {
      labels: topUsers.map(([user]) => user),
      datasets: [
        {
          label: 'Number of Edits',
          data: topUsers.map(([_, count]) => count),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(167, 139, 250, 0.7)',
            'rgba(192, 132, 252, 0.7)',
            'rgba(216, 180, 254, 0.7)',
            'rgba(232, 121, 249, 0.7)',
            'rgba(244, 114, 182, 0.7)',
            'rgba(251, 113, 133, 0.7)',
            'rgba(251, 146, 60, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Process data for edits distribution chart
  const getEditsDistributionData = () => {
    if (edits.length === 0) return null;
    
    // Count edits by tag type
    const tagMap = new Map<string, number>();
    const noTagCount = { count: 0 };
    
    edits.forEach(edit => {
      if (edit.tags.length === 0) {
        noTagCount.count++;
      } else {
        edit.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      }
    });
    
    const topTags = Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Add "No Tag" if there are any
    if (noTagCount.count > 0) {
      topTags.push(['No Tags', noTagCount.count]);
    }
    
    return {
      labels: topTags.map(([tag]) => tag),
      datasets: [
        {
          label: 'Distribution by Tag',
          data: topTags.map(([_, count]) => count),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(107, 114, 128, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading data...</div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 dark:text-red-400">{error}</div>
        </div>
      );
    }
    
    if (edits.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">No data available</div>
        </div>
      );
    }
    
    switch (selectedChart) {
      case 'activity-over-time':
        const timeData = getActivityOverTimeData();
        return timeData ? (
          <div className="h-64 md:h-80">
            <Line 
              data={timeData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Edit Activity Over Time',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Edits',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date',
                    },
                  },
                },
              }}
            />
          </div>
        ) : null;
        
      case 'users-leaderboard':
        const userData = getTopContributorsData();
        return userData ? (
          <div className="h-64 md:h-80">
            <Bar 
              data={userData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Top Contributors',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Edits',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'User',
                    },
                  },
                },
              }}
            />
          </div>
        ) : null;
        
      case 'edits-distribution':
        const distributionData = getEditsDistributionData();
        return distributionData ? (
          <div className="h-64 md:h-80">
            <Pie 
              data={distributionData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                  title: {
                    display: true,
                    text: 'Edits Distribution by Tag',
                  },
                },
              }}
            />
          </div>
        ) : null;
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      <PageHeader
        title="Analytics Dashboard"
        description="Visualize Wikidata editing patterns and insights."
      />
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select
              label="Chart Type"
              options={chartOptions}
              value={selectedChart}
              onChange={setSelectedChart}
            />
            
            <DateRangePicker
              label="Date Range"
              dateRange={dateRange}
              onChange={setDateRange}
            />
            
            <div className="flex items-end">
              <Button
                onClick={fetchData}
                isLoading={isLoading}
                className="w-full"
              >
                Update Chart
              </Button>
            </div>
          </div>
          
          {renderChart()}
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-medium mb-2">Total Edits</h3>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {isLoading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              ) : (
                edits.length
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {dateRange.from} to {dateRange.to}
            </p>
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium mb-2">Unique Contributors</h3>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {isLoading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              ) : (
                new Set(edits.map(edit => edit.user)).size
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Active users in selected period
            </p>
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium mb-2">Average Edits Size</h3>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {isLoading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              ) : (
                edits.length > 0 
                  ? Math.round(edits.reduce((sum, edit) => sum + Math.abs(edit.size.diff), 0) / edits.length)
                  : 0
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Average bytes changed per edit
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;