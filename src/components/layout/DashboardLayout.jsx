import { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { FileProvider } from '../../context/FileContext';
import CreateFolderModal from '../dashboard/CreateFolderModal';
import { AIProvider } from '../../context/AIContext';
import AIChatPanel from '../ai/AIChatPanel';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <FileProvider>
      <AIProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
          <div className="flex">
            <Sidebar
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
              onCreateFolder={() => setShowCreateFolder(true)}
              onUpload={handleUpload}
            />

            <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
              <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

              <main className="flex-1 p-4 lg:p-6">
                <Outlet context={{ fileInputRef }} />
              </main>
            </div>
          </div>

          <AIChatPanel />

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
          />

          {/* Create Folder Modal */}
          <CreateFolderModal
            isOpen={showCreateFolder}
            onClose={() => setShowCreateFolder(false)}
          />
        </div>
      </AIProvider>
    </FileProvider>
  );
};

export default DashboardLayout;
