import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage'; // import register page
import { CatalogPage } from './features/catalog/CatalogPage';
import { StudentDashboard } from './features/circulation/StudentDashboard';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { NewsPage } from './features/content/NewsPage';
import { ResearchPage } from './features/research/ResearchPage';
import { AILibrarian } from './features/ai/AILibrarian';
import { Navigation } from './shared/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Optional: default redirect, e.g., to login or a landing page */}
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/research" element={<ResearchPage />} />
      </Routes>
      <AILibrarian />
    </BrowserRouter>
  )
}

export default App;
