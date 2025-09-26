import React from 'react';
import { 
  Home, 
  FileText, 
  FolderOpen, 
  Clock, 
  BookOpen, 
  Settings, 
  HelpCircle,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  recentFiles: Array<{ id: string; title: string; lastUpdated: Date }>;
  onNewDocument: () => void;
  onOpenDocument: () => void;
  onDictionary: () => void;
  onHelp: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  recentFiles,
  onNewDocument,
  onOpenDocument,
  onDictionary,
  onHelp
}) => {
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'new', icon: Plus, label: 'New Document', action: onNewDocument },
    { id: 'open', icon: FolderOpen, label: 'Open Document', action: onOpenDocument },
    { id: 'recent', icon: Clock, label: 'Recent Files' },
    { id: 'dictionary', icon: BookOpen, label: 'Dictionary', action: onDictionary },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', action: onHelp },
  ];

  const handleItemClick = (item: any) => {
    if (item.action) {
      item.action();
    } else {
      onViewChange(item.id);
    }
  };

  return (
    <div className="w-16 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Navigation Icons */}
      <div className="flex-1 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`w-full h-12 flex items-center justify-center mb-2 relative group ${
                isActive 
                  ? 'text-blue-400 bg-blue-400/10' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} />
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"
                  layoutId="activeIndicator"
                />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* User Avatar */}
      <div className="p-4 border-t border-gray-700">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          S
        </div>
      </div>
    </div>
  );
};

export default Sidebar;