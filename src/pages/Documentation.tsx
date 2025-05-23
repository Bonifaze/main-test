import React from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';

const Documentation: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Documentation"
        description="Complete guide to using the Wikidata Activity Tracker system"
      />
      
      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Introduction</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Wikidata Activity Tracker is a powerful dashboard designed to monitor, analyze, and track editing activities on Wikidata. This comprehensive documentation will guide you through all features and functionalities of the system.
            </p>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">System Overview</h3>
              <p>
                The system provides real-time monitoring and analysis of Wikidata edits through various specialized tools and features. It's designed to help users track changes, analyze patterns, and maintain oversight of Wikidata's collaborative editing process.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">User Activity Tracker</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Monitor and analyze the editing activities of specific Wikidata users, either individually or in bulk.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Single User Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Track edits by username</li>
                  <li>Filter by date range</li>
                  <li>Filter by property types</li>
                  <li>Set result limits</li>
                  <li>Export results to CSV/JSON</li>
                  <li>View detailed analytics and charts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Bulk User Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload CSV/TXT files with multiple usernames</li>
                  <li>Compare edit statistics across users</li>
                  <li>View top contributors by various metrics</li>
                  <li>Analyze property distribution</li>
                  <li>Export comparative results</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Usage</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to the User Activity Tracker page</li>
                  <li>Choose between Single User or Bulk Users mode</li>
                  <li>For Single User:
                    <ul className="list-disc pl-6 mt-2">
                      <li>Enter the Wikidata username</li>
                      <li>Select date range using the date picker</li>
                      <li>Choose property types to filter (optional)</li>
                      <li>Set maximum results (default: 100)</li>
                      <li>Click "Search" to retrieve data</li>
                    </ul>
                  </li>
                  <li>For Bulk Users:
                    <ul className="list-disc pl-6 mt-2">
                      <li>Upload a CSV/TXT file with usernames (one per line)</li>
                      <li>Set date range and filters</li>
                      <li>Results will be processed automatically</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Analytics Output</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Total edit count and distribution</li>
                  <li>Bytes added/removed</li>
                  <li>Property-wise breakdown</li>
                  <li>Visual charts for edit distribution</li>
                  <li>Top contributors (for bulk mode)</li>
                  <li>Comparative statistics (for bulk mode)</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Entity Tracker</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Track and analyze changes made to specific Wikidata entities.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Track Q-items and Properties</li>
                  <li>Historical revision tracking</li>
                  <li>Contributor analysis</li>
                  <li>Change visualization</li>
                  <li>Export capabilities</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Usage</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Select entity type (Q-item or Property)</li>
                  <li>Enter entity ID (e.g., Q42)</li>
                  <li>Set date range</li>
                  <li>Choose display options</li>
                  <li>Click "Track Entity"</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Output Data</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Editor username</li>
                  <li>Edit timestamp</li>
                  <li>Revision details</li>
                  <li>Property changes</li>
                  <li>Edit summary</li>
                  <li>Size changes</li>
                  <li>Associated tags</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Visualize and analyze Wikidata editing patterns and trends.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Available Visualizations</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Activity Timeline (Line Chart)</li>
                  <li>Contributor Rankings (Bar Chart)</li>
                  <li>Edit Distribution (Pie Chart)</li>
                  <li>Property Usage (Heat Map)</li>
                  <li>Edit Size Distribution (Histogram)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Interactive charts</li>
                  <li>Customizable date ranges</li>
                  <li>Export visualizations</li>
                  <li>Filter by entity type</li>
                  <li>Compare time periods</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Edit Log Explorer</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Browse and filter recent edits across Wikidata.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Filtering Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>By user</li>
                  <li>By entity type</li>
                  <li>By edit tags</li>
                  <li>By size change</li>
                  <li>By property type</li>
                  <li>By namespace</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Real-time updates</li>
                  <li>Advanced search</li>
                  <li>Bulk export</li>
                  <li>Custom filters</li>
                  <li>Sort by multiple fields</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-4">API Integration</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Wikidata Activity Tracker integrates with the Wikidata API to fetch and process data.
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parameters</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">action=query&list=usercontribs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">User contributions</td>
                    <td className="px-6 py-4 text-sm">
                      <code>ucuser</code>, <code>ucstart</code>, <code>ucend</code>, <code>uclimit</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">action=query&prop=revisions</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Entity revisions</td>
                    <td className="px-6 py-4 text-sm">
                      <code>titles</code>, <code>rvstart</code>, <code>rvend</code>, <code>rvlimit</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">action=wbgetentities</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Entity details</td>
                    <td className="px-6 py-4 text-sm">
                      <code>ids</code>, <code>props</code>, <code>languages</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">action=query&list=recentchanges</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Recent changes</td>
                    <td className="px-6 py-4 text-sm">
                      <code>rcstart</code>, <code>rcend</code>, <code>rclimit</code>, <code>rcnamespace</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-semibold mb-2">Frontend Stack</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>React.js (v18.3.1)</li>
                <li>TypeScript</li>
                <li>Vite (v5.4.2)</li>
                <li>Tailwind CSS (v3.4.1)</li>
                <li>Chart.js (v4.4.1) with react-chartjs-2</li>
                <li>React Router (v6.22.0)</li>
                <li>Axios for API calls</li>
                <li>Framer Motion for animations</li>
                <li>Lucide React for icons</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Development Requirements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Node.js v16+</li>
                <li>Modern web browser</li>
                <li>Internet connection for API access</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">API Integration</h3>
              <p>
                The application directly interfaces with the Wikidata API endpoints. All data fetching is handled through Axios HTTP client.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Best Practices</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-semibold mb-2">Performance Tips</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use appropriate date ranges to limit data size</li>
                <li>Export large datasets instead of viewing in browser</li>
                <li>Utilize filters to narrow down results</li>
                <li>Clear browser cache regularly</li>
                <li>Use browser's developer tools to monitor API calls</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Management</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Regularly export important data</li>
                <li>Use appropriate file formats for exports</li>
                <li>Maintain organized tracking history</li>
                <li>Document tracking patterns</li>
                <li>Monitor API rate limits</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;