import React from 'react';
import { Filter, Download, Search, SortAsc } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';

const ResultsTable = ({ results, filterIntent, onFilterChange, showFilters }) => {
  const exportToCsv = () => {
    if (results.length === 0) return;

    const csvContent = [
      ['Name', 'Role', 'Company', 'Industry', 'Location', 'Intent', 'Score', 'Reasoning'],
      ...results.map(r => [
        r.lead.name || '',
        r.lead.role || '',
        r.lead.company || '',
        r.lead.industry || '',
        r.lead.location || '',
        r.ai_intent || '',
        r.final_score || '0',
        (r.reasoning || '').replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lead_qualification_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!showFilters && results.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-500">
            Complete the steps on the left to see your lead qualification results here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <SortAsc className="w-5 h-5 text-indigo-600" />
          Lead Qualification Results
          {results.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({results.length} leads)
            </span>
          )}
        </h2>

        {results.length > 0 && (
          <Button onClick={exportToCsv} variant="secondary" className="text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Intent:</span>
          </div>
          
          <div className="flex gap-2">
            {['all', 'High', 'Medium', 'Low'].map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterIntent === filter
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {filter === 'all' ? 'All Leads' : `${filter} Intent`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Lead Info</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Intent</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">AI Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((lead, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{lead.lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.lead.role}</div>
                      {lead.lead.location && (
                        <div className="text-xs text-gray-400">{lead.lead.location}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{lead.lead.company}</div>
                      <div className="text-sm text-gray-500">{lead.lead.industry}</div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4 text-center">
                    <Badge variant={lead.ai_intent}>{lead.ai_intent}</Badge>
                  </td>
                  
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-lg">{lead.final_score}</span>
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            lead.final_score >= 7 ? 'bg-green-500' :
                            lead.final_score >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-700 max-w-xs">
                      {lead.reasoning}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500">No leads match the current filter.</div>
        </div>
      )}
    </Card>
  );
};

export default ResultsTable;