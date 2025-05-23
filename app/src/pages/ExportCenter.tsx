import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { exportData } from '../services/api';

const exportFormatOptions = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' },
];

const ExportCenter: React.FC = () => {
  const location = useLocation();
  const { data, source } = location.state || {};
  
  const [format, setFormat] = useState<string>('json');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedData, setExportedData] = useState<string | null>(null);
  
  if (!data || !Array.isArray(data)) {
    return <Navigate to="/" />;
  }
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const result = await exportData(data, format as 'csv' | 'json' | 'pdf');
      setExportedData(result);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleDownload = () => {
    if (!exportedData) return;
    
    const blob = new Blob([exportedData], { 
      type: format === 'json' 
        ? 'application/json' 
        : format === 'csv'
          ? 'text/csv'
          : 'application/pdf'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wikidata-export-${source || 'data'}.${format}`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  return (
    <div>
      <PageHeader
        title="Export Center"
        description="Export your data in various formats."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium mb-4">Export Settings</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                You are about to export {data.length} records from {source || 'your query'}.
              </p>
            </div>
            
            <Select
              label="Export Format"
              options={exportFormatOptions}
              value={format}
              onChange={setFormat}
            />
            
            <Button
              onClick={handleExport}
              isLoading={isExporting}
              className="w-full"
            >
              Generate Export
            </Button>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          
          {isExporting ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-gray-500 dark:text-gray-400">Generating export...</div>
            </div>
          ) : exportedData ? (
            <div className="space-y-4">
              <div className="overflow-auto max-h-48 bg-gray-50 dark:bg-gray-900 p-4 rounded-md font-mono text-sm">
                {format === 'json' ? (
                  <pre>{JSON.stringify(JSON.parse(exportedData), null, 2)}</pre>
                ) : format === 'csv' ? (
                  <pre>{exportedData}</pre>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    PDF preview not available. Click download to save the file.
                  </div>
                )}
              </div>
              
              <Button
                onClick={handleDownload}
                variant="success"
                className="w-full"
              >
                Download {format.toUpperCase()}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-gray-500 dark:text-gray-400">
                Generate an export to see a preview
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ExportCenter;