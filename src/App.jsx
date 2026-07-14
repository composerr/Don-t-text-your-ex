import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Layout from '@/components/Layout';
import { LanguageProvider } from '@/lib/i18n';
import Home from '@/pages/Home';
import Vault from '@/pages/Vault';
import PartyMode from '@/pages/PartyMode';
import SobrietyTest from '@/pages/SobrietyTest';
import AntiSimp from '@/pages/AntiSimp';
import Log from '@/pages/Log';
import Onboarding from '@/pages/Onboarding';
import AntiPost from '@/pages/AntiPost';
import UsageAccess from '@/pages/UsageAccess';
import BlockedApps from '@/pages/BlockedApps';
import Settings from '@/pages/Settings';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/party-mode" element={<PartyMode />} />
        <Route path="/log" element={<Log />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/usage-access" element={<UsageAccess />} />
        <Route path="/blocked-apps" element={<BlockedApps />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Route>
        <Route path="/sobriety-test" element={<SobrietyTest />} />
        <Route path="/anti-simp" element={<AntiSimp />} />
        <Route path="/anti-post" element={<AntiPost />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <LanguageProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App