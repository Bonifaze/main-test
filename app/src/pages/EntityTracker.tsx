import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import DateRangePicker from '../components/common/DateRangePicker';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import { getEntityEdits, getEntityDetails, WikidataEdit, WikidataEntity } from '../services/api';
import TrackedHistoryContext from '../context/TrackedHistoryContext';
import { ArrowUpDown } from 'lucide-react';

const entityTypes = [
  { value: 'qid', label: 'Q-ID (e.g., Q42)' },
  { value: 'property', label: 'Property (e.g., P31)' },
];

interface UserEditStats {
  user: string;
  edits: number;
  bytesAdded: number;
  bytesRemoved: number;
  lastEdit: string;
}

const EntityTracker: React.FC = () => {
  const navigate = useNavigate();
  const { addEntry } = useContext(TrackedHistoryContext);
  
  const [entityType, setEntityType] = useState<string>('qid');
  const [entityValue, setEntityValue] = useState<string>('Q42');
  const [dateRange, setDateRange] = useState({
    from: '2023-01-01',
    to: '2024-12-31',
  });
  const [limit, setLimit] = useState<string>('100');
  
  const [edits, setEdits] = useState<WikidataEdit[]>([]);
  const [entityDetails, setEntityDetails] = useState<WikidataEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sorting state
  const [sortField, setSortField] = useState<string>('edits');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleSearch = async () => {
    if (!entityValue) {
      setError('Please enter an entity ID');
      return;
    }
    
    setIsLoading(true);
    setIsLoadingDetails(true);
    setError(null);
    
    try {
      const results = await getEntityEdits(
        entityValue,
        dateRange,
        parseInt(limit)
      );
      
      setEdits(results);
      
      // Get entity details
      try {
        const details = await getEntityDetails(entityValue);
        setEntityDetails(details);
      } catch (detailsErr) {
        console.error('Error fetching entity details:', detailsErr);
      } finally {
        setIsLoadingDetails(false);
      }
      
      // Add to tracking history
      addEntry({
        queryType: 'entity',
        searchValue: entityValue,
        dateRange,
        resultsCount: results.length
      });
      
    } catch (err) {
      setError('Failed to fetch entity edits. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = () => {
    if (edits.length === 0) return;
    navigate('/export', { state: { data: edits, source: 'entity-tracker' } });
  };
  
  // Process edits to get user statistics
  const userStats = edits.reduce((stats: Record<string, UserEditStats>, edit) => {
    if (!stats[edit.user]) {
      stats[edit.user] = {
        user: edit.user,
        edits: 0,
        bytesAdded: 0,
        bytesRemoved: 0,
        lastEdit: edit.timestamp,
      };
    }
    
    stats[edit.user].edits++;
    if (edit.size.diff > 0) {
      stats[edit.user].bytesAdded += edit.size.diff;
    } else if (edit.size.diff < 0) {
      stats[edit.user].bytesRemoved += Math.abs(edit.size.diff);
    }
    
    // Update last edit if this edit is more recent
    if (new Date(edit.timestamp) > new Date(stats[edit.user].lastEdit)) {
      stats[edit.user].lastEdit = edit.timestamp;
    }
    
    return stats;
  }, {});
  
  const sortedUserStats = Object.values(userStats).sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'user':
        return multiplier * a.user.localeCompare(b.user);
      case 'edits':
        return multiplier * (a.edits - b.edits);
      case 'bytesAdded':
        return multiplier * (a.bytesAdded - b.bytesAdded);
      case 'bytesRemoved':
        return multiplier * (a.bytesRemoved - b.bytesRemoved);
      case 'lastEdit':
        return multiplier * (new Date(a.lastEdit).getTime() - new Date(b.lastEdit).getTime());
      default:
        return 0;
    }
  });
  
  // Chart data for top contributors
  const chartData = {
    labels: sortedUserStats.slice(0, 5).map(stat => stat.user),
    datasets: [
      {
        label: 'Number of Edits',
        data: sortedUserStats.slice(0, 5).map(stat => stat.edits),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };
  
  const columns = [
    { 
      header: 'User',
      accessor: 'user',
      className: 'font-medium text-purple-600 dark:text-purple-400',
      sortable: true,
      sortKey: 'user'
    },
    { 
      header: 'Total Edits',
      accessor: 'edits',
      sortable: true,
      sortKey: 'edits'
    },
    { 
      header: 'Bytes Added',
      accessor: (item: UserEditStats) => (
        <span className="text-green-600 dark:text-green-400">
          +{item.bytesAdded}
        </span>
      ),
      sortable: true,
      sortKey: 'bytesAdded'
    },
    { 
      header: 'Bytes Removed',
      accessor: (item: UserEditStats) => (
        <span className="text-red-600 dark:text-red-400">
          -{item.bytesRemoved}
        </span>
      ),
      sortable: true,
      sortKey: 'bytesRemoved'
    },
    { 
      header: 'Last Edit',
      accessor: (item: UserEditStats) => new Date(item.lastEdit).toLocaleString(),
      sortable: true,
      sortKey: 'lastEdit'
    },
  ];
  
  return (
    <div>
      <PageHeader
        title="Entity Tracker"
        description="Track who edited a specific Wikidata entity over time."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="space-y-4"
            >
              <Select
                label="Entity Type"
                options={entityTypes}
                value={entityType}
                onChange={setEntityType}
              />
              
              <Input
                label="Entity ID"
                value={entityValue}
                onChange={setEntityValue}
                placeholder={entityType === 'qid' ? 'Q42' : 'P31'}
                required
              />
              
              <DateRangePicker
                label="Date Range"
                dateRange={dateRange}
                onChange={setDateRange}
              />
              
              <Input
                label="Results Limit"
                type="number"
                value={limit}
                onChange={setLimit}
                min="1"
                max="500"
              />
              
              {error && (
                <div className="text-red-500 dark:text-red-400 text-sm mt-2">
                  {error}
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Search
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExport}
                  disabled={edits.length === 0}
                  className="w-full"
                >
                  Export Results
                </Button>
              </div>
            </form>
          </Card>
          
          {entityDetails && (
            <Card title="Entity Details">
              {isLoadingDetails ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h4>
                    <p className="font-medium">{entityDetails.id}</p>
                  </div>
                  
                  {entityDetails.labels.en && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Label (English)</h4>
                      <p>{entityDetails.labels.en.value}</p>
                    </div>
                  )}
                  
                  {entityDetails.descriptions.en && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                      <p className="text-sm">{entityDetails.descriptions.en.value}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Statements</h4>
                    <p className="text-sm">{Object.keys(entityDetails.claims).length} properties</p>
                  </div>
                </div>
              )}
            </Card>
          )}
          
          {sortedUserStats.length > 0 && (
            <Card>
              <h3 className="text-lg font-medium mb-4">Top Contributors</h3>
              <div className="h-64">
                <Bar 
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
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
                    },
                  }}
                />
              </div>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {isLoading ? 'Loading results...' : 
                 sortedUserStats.length > 0 ? `Found ${sortedUserStats.length} contributors to ${entityValue}` : 
                 'No results yet'}
              </h3>
            </div>
            
            <Table
              columns={columns}
              data={sortedUserStats}
              keyExtractor={(item) => item.user}
              isLoading={isLoading}
              emptyMessage="No edits found for this entity. Try changing your search criteria."
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EntityTracker;