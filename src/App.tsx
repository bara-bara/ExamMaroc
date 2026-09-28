import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UniversitiesPage from './pages/UniversitiesPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import LatestExamsPage from './pages/LatestExamsPage';
import SubjectsPage from './pages/SubjectsPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DmcaPage from './pages/DmcaPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/universites" element={<UniversitiesPage />} />
          <Route path="/universites/:uniSlug" element={<UniversityDetailPage />} />
          <Route path="/universites/:uniSlug/:progSlug" element={<ProgramDetailPage />} />
          
          <Route path="/examens" element={<ExamsPage />} />
          <Route path="/examens/:uniSlug" element={<ExamsPage />} />
          <Route path="/examens/:uniSlug/:progSlug/:semester" element={<ExamsPage />} />
          <Route path="/examens/:uniSlug/:progSlug/:semester/:subSlug" element={<ExamsPage />} />
          <Route path="/examens/:uniSlug/:progSlug/:semester/:subSlug/:examSlug" element={<ExamDetailPage />} />
          <Route path="/examens/:examSlug" element={<ExamDetailPage />} />
          
          <Route path="/latest-exams" element={<LatestExamsPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/dmca" element={<DmcaPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
