// src/components/admin/Analytics.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Analytics() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin" className="text-gray-700 hover:text-indigo-600">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Conversation Metrics</h3>
                <div className="space-y-2">
                  <p>Total Conversations: 1,234</p>
                  <p>Average Duration: 5m 30s</p>
                  <p>Satisfaction Rate: 4.8/5</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">AI Performance</h3>
                <div className="space-y-2">
                  <p>Response Accuracy: 95%</p>
                  <p>Average Response Time: 1.2s</p>
                  <p>Resolution Rate: 89%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Analytics;