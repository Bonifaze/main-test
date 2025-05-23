import React from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';

const Documentation: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Documentation"
        description="Learn how to use the Wikidata-Track system."
      />
      
      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Getting Started</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Wikidata-Track is a comprehensive dashboard that allows you to monitor and analyze editing activity on Wikidata. This guide will help you understand how to use the various features of the system.
            </p>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Main Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>User Activity Tracker</strong>: Monitor edits made by specific Wikidata users
                </li>
                <li>
                  <strong>Entity Tracker</strong>: See who has edited a specific Wikidata entity (Q-ID or property)
                </li>
                <li>
                  <strong>Analytics Dashboard</strong>: Visualize editing patterns with charts and graphs
                </li>
                <li>
                  <strong>Edit Log Explorer</strong>: Browse and filter recent edits across Wikidata
                </li>
                <li>
                  <strong>Export Center</strong>: Download tracking results in various formats
                </li>
                <li>
                  <strong>History Log</strong>: View a record of tracking activities performed on this system
                </li>
              </ul>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">User Activity Tracker</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The User Activity Tracker allows you to monitor all edits made by a specific Wikidata user within a chosen date range.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">How to Use</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Enter a Wikidata username (e.g., "Bovimacoco")</li>
                  <li>Select a date range for the tracking period</li>
                  <li>Optionally filter by property types</li>
                  <li>Set the maximum number of results to return</li>
                  <li>Click "Search" to retrieve the user's edit history</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <p>
                  The results table shows all edits made by the user, including:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Entity edited (Q-ID)</li>
                  <li>Timestamp of the edit</li>
                  <li>Edit summary/comment</li>
                  <li>Size change (in bytes)</li>
                  <li>Tags associated with the edit</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-xl font-bold mb-4">Entity Tracker</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The Entity Tracker allows you to see who has edited a specific Wikidata item or property within a chosen date range.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">How to Use</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Select the entity type (Q-ID or Property)</li>
                  <li>Enter the entity ID (e.g., "Q42" for Douglas Adams)</li>
                  <li>Select a date range for the tracking period</li>
                  <li>Set the maximum number of results to return</li>
                  <li>Click "Search" to retrieve the entity's edit history</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <p>
                  The results table shows all edits made to the entity, including:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Username of the editor</li>
                  <li>Timestamp of the edit</li>
                  <li>Edit summary/comment</li>
                  <li>Size change (in bytes)</li>
                  <li>Tags associated with the edit</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The Analytics Dashboard provides visual insights into editing patterns on Wikidata.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Available Charts</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Activity Over Time</strong>: Line chart showing edit frequency across dates
                  </li>
                  <li>
                    <strong>Top Contributors</strong>: Bar chart of the most active users
                  </li>
                  <li>
                    <strong>Edits Distribution</strong>: Pie chart showing edit categories
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Controls</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Select chart type from the dropdown</li>
                  <li>Set date range to analyze</li>
                  <li>Click "Update Chart" to refresh the data</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-xl font-bold mb-4">Edit Log Explorer</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The Edit Log Explorer allows you to browse and filter recent edits across all of Wikidata.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Filtering Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>All Edits</strong>: View all recent edits
                  </li>
                  <li>
                    <strong>By User</strong>: Filter edits by username
                  </li>
                  <li>
                    <strong>By Tag</strong>: Filter edits by tag (e.g., "mobile edit")
                  </li>
                  <li>
                    <strong>By Size Change</strong>: Filter edits by minimum size change
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Controls</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Select filter type from the dropdown</li>
                  <li>Enter filter value if applicable</li>
                  <li>Set date range to analyze</li>
                  <li>Click "Fetch Data" to get edits</li>
                  <li>Click "Apply Filter" to filter the results</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
        
        <Card>
          <h2 className="text-xl font-bold mb-4">API Documentation</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Wikidata-Track interfaces with the Wikidata API to fetch data. Here are the main endpoints used:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Key Parameters</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">action=query&list=usercontribs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Fetch user contributions</td>
                    <td className="px-6 py-4 text-sm">
                      <code>ucuser</code>, <code>ucstart</code>, <code>ucend</code>, <code>uclimit</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">action=query&prop=revisions</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Fetch entity revision history</td>
                    <td className="px-6 py-4 text-sm">
                      <code>titles</code>, <code>rvstart</code>, <code>rvend</code>, <code>rvlimit</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">action=wbgetentities</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Fetch entity details</td>
                    <td className="px-6 py-4 text-sm">
                      <code>ids</code>, <code>props</code>, <code>languages</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">action=query&list=recentchanges</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Fetch recent changes</td>
                    <td className="px-6 py-4 text-sm">
                      <code>rcstart</code>, <code>rcend</code>, <code>rclimit</code>, <code>rcnamespace</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mt-4">
              For more details on the Wikidata API, refer to the <a href="https://www.wikidata.org/w/api.php" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">official documentation</a>.
            </p>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-xl font-bold mb-4">Technical Information</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-semibold mb-2">Frontend</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Built with React.js</li>
                <li>UI styled with Tailwind CSS</li>
                <li>Charts created with Chart.js</li>
                <li>Icons from Lucide React</li>
                <li>State management with React Context API</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Backend</h3>
              <p>
                For deployment with a FastAPI backend, the following setup is recommended:
              </p>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                <code>
                  # Python requirements.txt
                  fastapi==0.95.0
                  uvicorn==0.21.1
                  requests==2.28.2
                  python-dotenv==1.0.0
                  pydantic==1.10.7
                  aiohttp==3.8.4
                </code>
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Responsive design for all device sizes</li>
                <li>Light and dark mode support</li>
                <li>Collapsible sidebar navigation</li>
                <li>Data export in multiple formats</li>
                <li>Interactive data visualization</li>
                <li>Tracking history for system usage</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;