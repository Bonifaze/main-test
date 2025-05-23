import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import DateRangePicker from '../components/common/DateRangePicker';
import { getRecentChanges, WikidataEdit } from '../services/api';

const filterOptions = [
  { value: 'all', label: 'All Edits' },
  { value: 'user', label: 'By User' },
  { value: 'tag', label: 'By Tag' },
  { value: 'size', label: 'By Size Change' },
];

const EditLog: React.FC = () => {
  const navigate = useNavigate();
  
  const [filterType, setFilterType] = useState<string>('all');
  const [filterValue, setFilterValue] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    from: '2023-01-01',
    to: '2024-12-31',
  });
  const [limit, setLimit] = useState<string>('100');
  
  const [allEdits, setAllEdits] = useState<WikidataEdit[]>([]);
  const [filteredEdits, setFilteredEdits] = useState<WikidataEdit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await getRecentChanges(
        dateRange,
        parseInt(limit)
      );
      
      setAllEdits(results);
      applyFilters(results);
    } catch (err) {
      setError('Failed to fetch edit logs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const applyFilters = (edits = allEdits) => {
    if (filterType === 'all' || !filterValue) {
      setFilteredEdits(edits);
      return;
    }
    
    let filtered = edits;
    
    switch (filterType) {
      case 'user':
        filtered = edits.filter(edit => 
          edit.user.toLowerCase().includes(filterValue.toLowerCase())
        );
        break;
        
      case 'tag':
        filtered = edits.filter(edit => 
          edit.tags.some(tag => tag.toLowerCase().includes(filterValue.toLowerCase()))
        );
        break;
        
      case 'size':
        try {
          const sizeValue = parseInt(filterValue);
          filtered = edits.filter(edit => 
            Math.abs(edit.size.diff) >= sizeValue
          );
        } catch (e) {
          // If parseInt fails, keep all edits
        }
        break;
    }
    
    setFilteredEdits(filtered);
  };
  
  const handleFilterChange = () => {
    applyFilters();
  };
  
  const handleExport = () => {
    if (filteredEdits.length === 0) return;
    navigate('/export', { state: { data: filteredEdits, source: 'edit-log' } });
  };
  
  const columns = [
    { 
      header: 'Entity',
      accessor: 'title',
      className: 'font-medium text-blue-600 dark:text-blue-400'
    },
    { 
      header: 'User',
      accessor: 'user',
      className: 'font-medium text-purple-600 dark:text-purple-400'
    },
    { 
      header: 'Timestamp',
      accessor: (item: WikidataEdit) => {
        const date = new Date(item.timestamp);
        return date.toLocaleString();
      }
    },
    { 
      header: 'Comment',
      accessor: 'comment'
    },
    { 
      header: 'Size Change',
      accessor: (item: WikidataEdit) => {
        const { diff } = item.size;
        const className = diff > 0 
          ? 'text-green-600 dark:text-green-400' 
          : diff < 0 
            ? 'text-red-600 dark:text-red-400' 
            : '';
        
        return <span className={className}>{diff > 0 ? `+${diff}` : diff}</span>;
      }
    },
    { 
      header: 'Tags',
      accessor: (item: WikidataEdit) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
              {tag}
            </span>
          ))}
        </div>
      )
    },
  ];
  
  return (
    <div>
      <PageHeader
        title="Edit Log Explorer"
        description="Browse and filter recent Wikidata edits."
      />
      
      <div className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Filter By"
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
            />
            
            {filterType !== 'all' && (
              <Input
                label={
                  filterType === 'user' ? 'Username' :
                  filterType === 'tag' ? 'Tag' :
                  filterType === 'size' ? 'Min. Size Change' : 'Value'
                }
                value={filterValue}
                onChange={setFilterValue}
                placeholder={
                  filterType === 'user' ? 'Enter username' :
                  filterType === 'tag' ? 'Enter tag' :
                  filterType === 'size' ? 'Enter minimum bytes' : ''
                }
                type={filterType === 'size' ? 'number' : 'text'}
              />
            )}
            
            <DateRangePicker
              label="Date Range"
              dateRange={dateRange}
              onChange={setDateRange}
            />
            
            <div className="flex items-end space-x-2">
              <Button
                onClick={fetchData}
                isLoading={isLoading}
                className="flex-1"
              >
                Fetch Data
              </Button>
              
              {filterType !== 'all' && (
                <Button
                  variant="secondary"
                  onClick={handleFilterChange}
                  className="flex-1"
                >
                  Apply Filter
                </Button>
              )}
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm mt-4">
              {error}
            </div>
          )}
        </Card>
        
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {isLoading ? 'Loading edits...' : 
              `Showing ${filteredEdits.length} ${
                allEdits.length !== filteredEdits.length 
                  ? `of ${allEdits.length} ` 
                  : ''
              }edits`}
            </h3>
            
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={filteredEdits.length === 0}
            >
              Export Results
            </Button>
          </div>
          
          <Table
            columns={columns}
            data={filteredEdits}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            emptyMessage="No edits found. Try changing your search criteria."
          />
        </Card>
      </div>
    </div>
  );
};

export default EditLog;