/**
 * TabNavigation Component
 * Tabs for switching between Create and View modes
 */

interface TabNavigationProps {
  activeTab: 'create' | 'view' | 'about';
  onTabChange: (tab: 'create' | 'view' | 'about') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    {
      id: 'create' as const,
      label: 'Create PDFH',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      id: 'view' as const,
      label: 'View PDFH',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      id: 'about' as const,
      label: 'About',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 relative
                hover:bg-gray-50 dark:hover:bg-gray-700/50
                ${
                  activeTab === tab.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-300 ${
                  activeTab === tab.id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default TabNavigation;
