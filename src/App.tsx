import React, { useState, useEffect } from 'react';
import { Senior, User } from '@/types';
import { ApiService, handleApiError, createLoadingState } from '@/services/apiService';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import SeniorProfile from '@/components/SeniorProfile';
import LandingPage from '@/components/LandingPage';
import CareAdvisor from '@/components/CareAdvisor';
import AddSeniorModal from '@/components/AddSeniorModal';

type ActiveView = 'dashboard' | 'advisor';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [seniors, setSeniors] = useState<Senior[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedSeniorId, setSelectedSeniorId] = useState<string | null>(null);
  const [isAddSeniorModalOpen, setIsAddSeniorModalOpen] = useState(false);
  const [editingSenior, setEditingSenior] = useState<Senior | null>(null);
  const [loadingState] = useState(createLoadingState());

  useEffect(() => {
    // Check for logged-in user in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      setCurrentUser(user);
      loadSeniors(user.id);
    }
  }, []);

  const loadSeniors = async (userId: string) => {
    try {
      loadingState.setLoading(true);
      loadingState.setError(null);

      const seniorsData = await ApiService.getSeniors(userId);
      setSeniors(seniorsData);
    } catch (error) {
      console.error('Failed to load seniors:', error);
      loadingState.setError(handleApiError(error));
      // Set empty array if API fails
      setSeniors([]);
    } finally {
      loadingState.setLoading(false);
    }
  };

  const handleAuthentication = async (user: User) => {
    try {
      loadingState.setLoading(true);
      loadingState.setError(null);

      // Authenticate with backend
      const authenticatedUser = await ApiService.login(user.email, user.name, user.plan);

      // Store user locally
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);

      // Load seniors for the user
      await loadSeniors(authenticatedUser.id);
    } catch (error) {
      console.error('Authentication failed:', error);
      loadingState.setError(handleApiError(error));
    } finally {
      loadingState.setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setSelectedSeniorId(null);
    setActiveView('dashboard');
    setSeniors([]);
    loadingState.reset();
  };

  const handleSelectSenior = (id: string) => {
    setSelectedSeniorId(id);
  };

  const handleNavigate = (view: ActiveView) => {
    // Don't clear selectedSeniorId when navigating to advisor
    if (view === 'advisor') {
      setActiveView(view);
    } else {
      setSelectedSeniorId(null);
      setActiveView(view);
    }
  };

  const updateSenior = (updatedSenior: Senior) => {
    setSeniors(seniors.map(s => s.id === updatedSenior.id ? updatedSenior : s));
  };

  const handleAddSenior = () => {
    setEditingSenior(null);
    setIsAddSeniorModalOpen(true);
  };

  const handleEditSenior = (senior: Senior) => {
    setEditingSenior(senior);
    setIsAddSeniorModalOpen(true);
  };

  const handleSaveSenior = async (senior: Senior) => {
    if (!currentUser) {
      loadingState.setError('No user logged in');
      return;
    }

    try {
      loadingState.setLoading(true);
      loadingState.setError(null);

      const result = await ApiService.saveSenior(currentUser.id, senior);

      if (result.success) {
        if (editingSenior) {
          // Update existing senior in state
          setSeniors(seniors.map(s => s.id === senior.id ? senior : s));
        } else {
          // Add new senior to state with the ID from backend
          const newSenior = { ...senior, id: result.seniorId };
          setSeniors([...seniors, newSenior]);
        }

        setIsAddSeniorModalOpen(false);
        setEditingSenior(null);
      }
    } catch (error) {
      console.error('Failed to save senior:', error);
      loadingState.setError(handleApiError(error));
    } finally {
      loadingState.setLoading(false);
    }
  };

  const handleDeleteSenior = async (seniorId: string) => {
    if (!currentUser) {
      loadingState.setError('No user logged in');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this senior profile? This action cannot be undone.')) {
      return;
    }

    try {
      loadingState.setLoading(true);
      loadingState.setError(null);

      const result = await ApiService.deleteSenior(seniorId, currentUser.id);

      if (result.success) {
        setSeniors(seniors.filter(s => s.id !== seniorId));
        if (selectedSeniorId === seniorId) {
          setSelectedSeniorId(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete senior:', error);
      loadingState.setError(handleApiError(error));
    } finally {
      loadingState.setLoading(false);
    }
  };

  // Show loading state
  if (loadingState.loading && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loader loader-lg mx-auto mb-4"></div>
          <p className="text-brand-gray-dark">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (loadingState.error && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-brand-gray-dark mb-2">Connection Error</h2>
          <p className="text-brand-gray-medium mb-4">{loadingState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LandingPage onAuthenticate={handleAuthentication} />;
  }

  const selectedSenior = seniors.find(s => s.id === selectedSeniorId);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activeView={activeView}
      />

      {loadingState.loading && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center space-x-2">
            <div className="loader"></div>
            <span className="text-brand-gray-dark">Saving...</span>
          </div>
        </div>
      )}

      {loadingState.error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 z-50 max-w-sm">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-red-800 text-sm font-medium">Error</p>
              <p className="text-red-700 text-sm">{loadingState.error}</p>
            </div>
            <button
              onClick={() => loadingState.setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {activeView === 'dashboard' && (
          selectedSenior ? (
            <SeniorProfile
              senior={selectedSenior}
              onBack={() => setSelectedSeniorId(null)}
              onEdit={() => handleEditSenior(selectedSenior)}
              onDelete={() => handleDeleteSenior(selectedSenior.id)}
              onNavigateToAdvisor={() => handleNavigate('advisor')}
            />
          ) : (
            <Dashboard
              seniors={seniors}
              onSelectSenior={handleSelectSenior}
              onAddSenior={handleAddSenior}
              onNavigateToAdvisor={() => handleNavigate('advisor')}
            />
          )
        )}

        {activeView === 'advisor' && (
          <CareAdvisor
            selectedSenior={selectedSenior}
            onBackToProfile={() => handleNavigate('dashboard')}
          />
        )}


      </main>

      <AddSeniorModal
        isOpen={isAddSeniorModalOpen}
        onClose={() => {
          setIsAddSeniorModalOpen(false);
          setEditingSenior(null);
        }}
        onSave={handleSaveSenior}
        editingSenior={editingSenior}
      />
    </div>
  );
}

export default App;