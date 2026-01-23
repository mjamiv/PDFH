import { useState } from 'react'
import { Agentation } from 'agentation'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/common/ToastContainer'
import Header from './components/common/Header'
import TabNavigation from './components/common/TabNavigation'
import CreatorPage from './components/creator/CreatorPage'
import ViewerPage from './components/viewer/ViewerPage'
import AboutPage from './components/about/AboutPage'

type TabType = 'create' | 'view' | 'about'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('create')

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
          <Header />
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 container mx-auto px-4 py-6">
            {activeTab === 'create' && <CreatorPage />}
            {activeTab === 'view' && <ViewerPage />}
            {activeTab === 'about' && <AboutPage />}
          </main>
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 transition-colors duration-300">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
              PDFH - Embedding structured HTML within PDF files
            </div>
          </footer>
        </div>
        <Agentation />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
