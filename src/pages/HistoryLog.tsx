import React, { useContext, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import TrackedHistoryContext from '../context/TrackedHistoryContext';

const HistoryLog: React.FC = () => {
  const { history, clearHistory } = useContext(TrackedHistoryContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const filteredHistory = history.filter(entry => 
    entry.searchValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.queryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.ipAddress.includes(searchTerm)
  );
  
  const columns = [
    { 
      header: 'Timestamp',
      accessor: (item: any) => {
        const date = new Date(item.timestamp);
        return date.toLocaleString();
      }
    },
    { 
      header: 'IP Address',
      accessor: 'ipAddress'
    },
    { 
      header: 'Query Type',
      accessor: (item: any) => (
        <span className={
          item.queryType === 'user' 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-purple-600 dark:text-purple-400'
        }>
          {item.queryType === 'user' ? 'User Tracker' : 'Entity Tracker'}
        </span>
      )
    },
    { 
      header: 'Search Value',
      accessor: 'searchValue',
      className: 'font-medium'
    },
    { 
      header: 'Date Range',
      accessor: (item: any) => (
        <span>
          {item.dateRange.from} to {item.dateRange.to}
        </span>
      )
    },
    { 
      header: 'Results',
      accessor: (item: any) => (
        <span>
          {item.resultsCount !== undefined ? item.resultsCount : 'N/A'}
        </span>
      )
    },
  ];
  
  return (
    <div>
      <PageHeader
        title="History Log"
        description="View a history of all tracking activities performed on this system."
      />
      
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="md:w-1/3">
              <Input
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search history..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              {showConfirmation ? (
                <>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure?
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => {
                      clearHistory();
                      setShowConfirmation(false);
                    }}
                    size="sm"
                  >
                    Yes, Clear All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(true)}
                  disabled={history.length === 0}
                >
                  Clear History
                </Button>
              )}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-medium">
              Tracking History
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {history.length} tracking {history.length === 1 ? 'record' : 'records'} found
            </p>
          </div>
          
          <Table
            columns={columns}
            data={filteredHistory}
            keyExtractor={(item) => item.id}
            emptyMessage={
              history.length === 0
                ? "No tracking history available yet. Start using the tracking features."
                : "No results match your search criteria."
            }
          />
        </Card>
      </div>
    </div>
  );
};

export default HistoryLog;