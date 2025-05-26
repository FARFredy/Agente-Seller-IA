// src/components/integration/WordPressSetup.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function WordPressSetup() {
  const [siteUrl, setSiteUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [installing, setInstalling] = useState(false);

  const handleInstall = async (e) => {
    e.preventDefault();
    setInstalling(true);
    // Integration logic here
    setTimeout(() => {
      setInstalling(false);
      // Show success message
    }, 2000);
  };

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
            <h2 className="text-2xl font-bold mb-6">WordPress Integration</h2>
            
            <form onSubmit={handleInstall} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  WordPress Site URL
                </label>
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://your-wordpress-site.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your API key"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={installing}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  installing
                    ? 'bg-indigo-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {installing ? 'Installing...' : 'Install WordPress Plugin'}
              </button>
            </form>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Installation Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Enter your WordPress site URL</li>
                <li>Add your API key for authentication</li>
                <li>Click Install to add the chat widget to your site</li>
                <li>Configure the widget appearance in your WordPress admin</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WordPressSetup;