
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import Login from './pages/LoginPage'
import CreateursPage from './pages/CreateursPage'
import MessagePage from './pages/MessagePage'
import ChatPage from './pages/ChatPage'
import AnalysePage from './pages/AnalysePage'
import ProfilePage from './pages/ProfilePage'
import ImageGallery from './components/ImageGallery'
import FinancePage from './pages/FinancePage'
import EmployesPage from './pages/EmployesPage'
import ManagerPage from './pages/ManagerPage'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './components/ui/Toast'

function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} /> 
            <Route path="/createurs" element={<CreateursPage />} />
            <Route path="/MessagePage" element={<MessagePage />} /> 
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/analyse" element={<AnalysePage />} /> 
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/image" element={<ImageGallery />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/employe" element={<EmployesPage />} />
            <Route path="/manager" element={<ManagerPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </DataProvider>
  )
}

export default App