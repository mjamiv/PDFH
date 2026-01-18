import { useState } from 'react'
import Header from './components/common/Header'
import TabNavigation from './components/common/TabNavigation'
import CreatorPage from './components/creator/CreatorPage'
import ViewerPage from './components/viewer/ViewerPage'

type TabType = 'create' | 'view'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('create')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {activeTab === 'create' ? <CreatorPage /> : <ViewerPage />}
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          PDFH - Embedding structured HTML within PDF files
        </div>
      </footer>
    </div>
  )
}

export default App
