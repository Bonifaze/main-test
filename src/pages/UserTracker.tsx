import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import DateRangePicker from '../components/common/DateRangePicker';
import CheckboxGroup from '../components/common/CheckboxGroup';
import Table from '../components/common/Table';
import { getUserEdits, getBulkUserEdits, WikidataEdit } from '../services/api';
import TrackedHistoryContext from '../context/TrackedHistoryContext';
import { ArrowUpDown, Upload, Users } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const propertyOptions = [
  { value: 'labels', label: 'Labels' },
  { value: 'descriptions', label: 'Descriptions' },
  { value: 'aliases', label: 'Aliases' },
  { value: 'statements', label: 'Statements' },
  { value: 'qualifiers', label: 'Qualifiers' },
  { value: 'references', label: 'References' },
  { value: 'sitelinks', label: 'Sitelinks' },
];

// Define a type for the detailed bulk user stats
interface BulkUserStat {
  username: string;
  totalEdits: number;
  propertyStats: Record<string, number>;
  totalBytesAdded: number;
  totalBytesRemoved: number;
}

// Helper function to format a Date object as 'YYYY-MM-DD'
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UserTracker: React.FC = () => {
  const navigate = useNavigate();
  const { addEntry } = useContext(TrackedHistoryContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate the first and last day of the current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Day 0 of next month is last day of current month

  const [username, setUsername] = useState<string>('Bovimacoco');
  const [dateRange, setDateRange] = useState({
    from: formatDate(firstDayOfMonth),
    to: formatDate(lastDayOfMonth),
  });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [limit, setLimit] = useState<string>('100');
  const [trackingMode, setTrackingMode] = useState<'single' | 'bulk'>('single');
  const [bulkResults, setBulkResults] = useState<{
    userStats: Record<string, any>;
    topUsers: {
      byEdits: Array<{ username: string; count: number }>;
      byProperty: Record<string, Array<{ username: string; count: number }>>;
      byBytesAdded: Array<{ username: string; bytes: number }>;
    };
  } | null>(null);

  const [edits, setEdits] = useState<WikidataEdit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State to hold analytics data for single user, including property counts
  const [singleUserAnalytics, setSingleUserAnalytics] = useState({
    total: 0,
    added: 0,
    removed: 0,
    unchanged: 0,
    totalBytesAdded: 0,
    totalBytesRemoved: 0,
    propertyCounts: {} as Record<string, number>, // Initialize as an empty object
  });

  // Sorting state for single user edits
  const [singleUserSortField, setSingleUserSortField] = useState<string>('timestamp');
  const [singleUserSortDirection, setSingleUserSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sorting state for bulk user results table
  const [bulkUserSortField, setBulkUserSortField] = useState<string>('totalEdits'); // Default sort field for bulk
  const [bulkUserSortDirection, setBulkUserSortDirection] = useState<'desc' | 'asc'>('desc');


  const handleSingleUserSort = (field: string) => {
    if (singleUserSortField === field) {
      setSingleUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSingleUserSortField(field);
      setSingleUserSortDirection('desc');
    }
  };

  const handleBulkUserSort = (field: string) => {
    if (bulkUserSortField === field) {
      setBulkUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setBulkUserSortField(field);
      setBulkUserSortDirection('desc');
    }
  };

  const sortedEdits = [...edits].sort((a, b) => {
    const multiplier = singleUserSortDirection === 'asc' ? 1 : -1;

    switch (singleUserSortField) {
      case 'timestamp':
        return multiplier * (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      case 'size':
        return multiplier * (a.size.diff - b.size.diff);
      case 'property':
        return multiplier * ((a.property || '').localeCompare(b.property || ''));
      default:
        return 0;
    }
  });

  const sortedBulkUserStats = (() => {
    if (!bulkResults) return [];

    const statsArray: BulkUserStat[] = Object.entries(bulkResults.userStats).map(([username, stats]) => ({
      username,
      totalEdits: stats.totalEdits,
      propertyStats: stats.propertyStats,
      totalBytesAdded: stats.totalBytesAdded,
      totalBytesRemoved: stats.totalBytesRemoved,
    }));

    return [...statsArray].sort((a, b) => {
      const multiplier = bulkUserSortDirection === 'asc' ? 1 : -1;

      switch (bulkUserSortField) {
        case 'username':
          return multiplier * a.username.localeCompare(b.username);
        case 'totalEdits':
          return multiplier * (a.totalEdits - b.totalEdits);
        case 'totalBytesAdded':
          return multiplier * (a.totalBytesAdded - b.totalBytesAdded);
        case 'totalBytesRemoved':
          return multiplier * (a.totalBytesRemoved - b.totalBytesRemoved);
        default:
          // Handle sorting by specific properties if needed
          if (selectedProperties.includes(bulkUserSortField) && a.propertyStats[bulkUserSortField] !== undefined && b.propertyStats[bulkUserSortField] !== undefined) {
            return multiplier * ((a.propertyStats[bulkUserSortField] || 0) - (b.propertyStats[bulkUserSortField] || 0));
          }
          return 0;
      }
    });
  })();


  const handleSearch = async () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await getUserEdits(
        username,
        dateRange,
        selectedProperties,
        parseInt(limit)
      );

      setEdits(results);

      // Calculate analytics immediately after getting results
      const propertyCounts: Record<string, number> = {};
      results.forEach(edit => {
        if (edit.property) { // Ensure the edit has a property
          propertyCounts[edit.property] = (propertyCounts[edit.property] || 0) + 1;
        }
      });

      const calculatedAnalytics = {
        total: results.length,
        added: results.filter(edit => edit.size.diff > 0).length,
        removed: results.filter(edit => edit.size.diff < 0).length,
        unchanged: results.filter(edit => edit.size.diff === 0).length,
        totalBytesAdded: results.reduce((sum, edit) => sum + (edit.size.diff > 0 ? edit.size.diff : 0), 0),
        totalBytesRemoved: Math.abs(results.reduce((sum, edit) => sum + (edit.size.diff < 0 ? edit.size.diff : 0), 0)),
        propertyCounts: propertyCounts, // Add property counts
      };
      setSingleUserAnalytics(calculatedAnalytics); // Update the analytics state

      // Add to tracking history
      addEntry({
        queryType: 'user',
        searchValue: username,
        dateRange,
        properties: selectedProperties,
        resultsCount: results.length
      });

    } catch (err) {
      setError('Failed to fetch user edits. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (edits.length === 0) return;
    navigate('/export', { state: { data: edits, source: 'user-tracker' } });
  };

  // Use the singleUserAnalytics state for charting and display
  const chartData = {
    labels: ['Added', 'Removed', 'Unchanged'],
    datasets: [
      {
        label: 'Edit Distribution',
        data: [singleUserAnalytics.added, singleUserAnalytics.removed, singleUserAnalytics.unchanged],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(148, 163, 184, 0.6)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(148, 163, 184)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const singleUserColumns = [
    {
      header: 'Entity',
      accessor: (item: WikidataEdit) => item.title,
      className: 'font-medium text-blue-600 dark:text-blue-400'
    },
    {
      header: 'Property',
      accessor: (item: WikidataEdit) => (
        <span className="text-purple-600 dark:text-purple-400">
          {item.property ? propertyOptions.find(p => p.value === item.property)?.label || item.property : 'Unknown'}
        </span>
      ),
      sortable: true,
      sortKey: 'property'
    },
    {
      header: 'Timestamp',
      accessor: (item: WikidataEdit) => {
        const date = new Date(item.timestamp);
        return date.toLocaleString();
      },
      sortable: true,
      sortKey: 'timestamp'
    },
    {
      header: 'Comment',
      accessor: (item: WikidataEdit) => item.comment
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
      },
      sortable: true,
      sortKey: 'size'
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

  // Base definition for bulk user columns
  const baseBulkUserColumns = [
    {
      header: 'Username',
      accessor: (item: BulkUserStat) => item.username,
      className: 'font-medium text-blue-600 dark:text-blue-400',
      sortable: true,
      sortKey: 'username'
    },
    {
      header: 'Total Edits',
      accessor: (item: BulkUserStat) => item.totalEdits,
      sortable: true,
      sortKey: 'totalEdits'
    },
    {
      header: 'Bytes Added',
      accessor: (item: BulkUserStat) => <span className="text-green-600 dark:text-green-400">+{item.totalBytesAdded}</span>,
      sortable: true,
      sortKey: 'totalBytesAdded'
    },
    {
      header: 'Bytes Removed',
      accessor: (item: BulkUserStat) => <span className="text-red-600 dark:text-red-400">-{item.totalBytesRemoved}</span>,
      sortable: true,
      sortKey: 'totalBytesRemoved'
    },
  ];


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const usernames = text.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

      if (usernames.length === 0) {
        setError('No valid usernames found in the file');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await getBulkUserEdits(
          usernames,
          dateRange,
          selectedProperties,
          parseInt(limit)
        );

        setBulkResults(results);

        // Add to tracking history
        addEntry({
          queryType: 'user',
          searchValue: `${usernames.length} users`,
          dateRange,
          properties: selectedProperties,
          resultsCount: usernames.length
        });

      } catch (err) {
        setError('Failed to process bulk user tracking. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const renderBulkResults = () => {
    if (!bulkResults) return null;

    const { userStats, topUsers } = bulkResults;
    const topN = 5; // Show top 5 users by default

    // Dynamically generate property columns
    const dynamicPropertyColumns = selectedProperties.map(property => ({
      header: propertyOptions.find(p => p.value === property)?.label || property,
      accessor: (item: BulkUserStat) => item.propertyStats[property] || 0,
      sortable: true,
      sortKey: property,
    }));

    // Combine base columns and dynamic property columns
    let currentBulkColumns = [...baseBulkUserColumns, ...dynamicPropertyColumns];

    // Reorder columns to put the currently sorted column first
    if (bulkUserSortField) {
      const sortedColumn = currentBulkColumns.find(col => col.sortKey === bulkUserSortField);
      if (sortedColumn) {
        currentBulkColumns = [
          sortedColumn,
          ...currentBulkColumns.filter(col => col.sortKey !== bulkUserSortField)
        ];
      }
    }


    return (
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">By Total Edits</h4>
              <Bar
                data={{
                  labels: topUsers.byEdits.slice(0, topN).map(u => u.username),
                  datasets: [{
                    label: 'Total Edits',
                    data: topUsers.byEdits.slice(0, topN).map(u => u.count),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
            <div>
              <h4 className="font-medium mb-2">By Bytes Added</h4>
              <Bar
                data={{
                  labels: topUsers.byBytesAdded.slice(0, topN).map(u => u.username),
                  datasets: [{
                    label: 'Bytes Added',
                    data: topUsers.byBytesAdded.slice(0, topN).map(u => u.bytes),
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        </Card>

        {selectedProperties.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Property Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedProperties.map(property => (
                <div key={property}>
                  <h4 className="font-medium mb-2">
                    {propertyOptions.find(p => p.value === property)?.label || property}
                  </h4>
                  <Pie
                    data={{
                      labels: topUsers.byProperty[property]?.slice(0, topN).map(u => u.username) || [],
                      datasets: [{
                        data: topUsers.byProperty[property]?.slice(0, topN).map(u => u.count) || [],
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.6)',
                          'rgba(16, 185, 129, 0.6)',
                          'rgba(245, 158, 11, 0.6)',
                          'rgba(239, 68, 68, 0.6)',
                          'rgba(139, 92, 246, 0.6)',
                        ],
                        borderColor: [
                          'rgb(59, 130, 246)',
                          'rgb(16, 185, 129)',
                          'rgb(245, 158, 11)',
                          'rgb(239, 68, 68)',
                          'rgb(139, 92, 246)',
                        ],
                        borderWidth: 1
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
          <Table<BulkUserStat>
            columns={currentBulkColumns} // Use the dynamically reordered columns
            data={sortedBulkUserStats}
            keyExtractor={(item) => item.username}
            isLoading={isLoading}
            emptyMessage="No detailed bulk user statistics found."
            onSort={handleBulkUserSort}
            sortField={bulkUserSortField}
            sortDirection={bulkUserSortDirection}
          />
        </Card>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="User Activity Tracker"
        description="Track and analyze edits made by Wikidata users."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="flex space-x-4 mb-4">
              <Button
                variant={trackingMode === 'single' ? 'primary' : 'secondary'}
                onClick={() => {
                  setTrackingMode('single');
                  setBulkResults(null); // Clear bulk results when switching to single
                }}
              >
                Single User
              </Button>
              <Button
                variant={trackingMode === 'bulk' ? 'primary' : 'secondary'}
                onClick={() => {
                  setTrackingMode('bulk');
                  setEdits([]); // Clear single user edits when switching to bulk
                }}
              >
                Bulk Users
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (trackingMode === 'single') {
                  handleSearch();
                }
                // Bulk mode search is triggered by file upload
              }}
              className="space-y-4"
            >
              {trackingMode === 'single' ? (
                <Input
                  label="Username"
                  value={username}
                  onChange={setUsername}
                  placeholder="Enter Wikidata username"
                  required
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload CSV File
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv,.txt"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                    </Button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {fileInputRef.current?.files?.[0]?.name || 'No file chosen'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Upload a CSV or TXT file with one username per line
                  </p>
                </div>
              )}

              <DateRangePicker
                label="Date Range"
                dateRange={dateRange}
                onChange={setDateRange}
              />

              <CheckboxGroup
                label="Properties to Track"
                options={propertyOptions}
                selectedValues={selectedProperties}
                onChange={setSelectedProperties}
              />

              <Input
                label="Result Limit"
                type="number"
                value={limit}
                onChange={setLimit}
                min="1"
                max="5000"
              />

              {trackingMode === 'single' && (
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Search'}
                </Button>
              )}
            </form>
          </Card>

          {/* Display analytics using singleUserAnalytics state */}
          {singleUserAnalytics.total > 0 && trackingMode === 'single' && (
            <Card className="mt-6">
              <h3 className="text-lg font-medium mb-4">Analytics Summary</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Edits</p>
                    <p className="text-2xl font-bold">{singleUserAnalytics.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Added</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {singleUserAnalytics.added}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Removed</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {singleUserAnalytics.removed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Unchanged</p>
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {singleUserAnalytics.unchanged}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bytes Changed</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-green-600 dark:text-green-400">
                      +{singleUserAnalytics.totalBytesAdded}
                    </div>
                    <div className="text-red-600 dark:text-red-400">
                      -{singleUserAnalytics.totalBytesRemoved}
                    </div>
                  </div>
                </div>

                {/* New section for Property-wise breakdown */}
                {Object.keys(singleUserAnalytics.propertyCounts).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Edits by Property</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Object.entries(singleUserAnalytics.propertyCounts)
                        .sort(([, countA], [, countB]) => countB - countA) // Sort by count descending
                        .map(([propertyValue, count]) => (
                          <div key={propertyValue} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {propertyOptions.find(p => p.value === propertyValue)?.label || propertyValue}
                            </p>
                            <p className="text-xl font-bold">{count}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

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
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {trackingMode === 'single' ? (
            <Card className="h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {isLoading ? 'Loading results...' :
                    edits.length > 0 ? `Found ${singleUserAnalytics.total} edits by ${username}` :
                      'No results yet'}
                </h3>
              </div>

              <Table<WikidataEdit>
                columns={singleUserColumns}
                data={sortedEdits}
                keyExtractor={(item) => item.id}
                isLoading={isLoading}
                emptyMessage={
                  selectedProperties.length > 0
                    ? `No edits found for ${username} with the selected properties. Try selecting different properties or changing the date range.`
                    : `No edits found for ${username}. Try changing your search criteria.`
                }
                onSort={handleSingleUserSort}
                sortField={singleUserSortField}
                sortDirection={singleUserSortDirection}
              />
            </Card>
          ) : (
            renderBulkResults()
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTracker;