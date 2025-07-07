/**
 * Copyright (c) 2024-present mrofisr
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// src/App.jsx
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import MainContent from '@/pages/MainContent';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import config from '@/config/config';
import { validateGuestSession } from '@/lib/auth';

/**
 * App component serves as the root of the application with authentication.
 *
 * It manages the authentication state and invitation content display.
 * The flow is: AuthPage -> LandingPage -> MainContent
 * 
 * Authentication features:
 * - Session validation on app load
 * - Guest access control with codes
 * - Secure invitation viewing
 *
 * @component
 * @example
 * // Renders the App component
 * <App />
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [guestSession, setGuestSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if access control is enabled
        if (!config.security.accessControl.enabled) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Validate existing session
        const session = validateGuestSession();
        if (session) {
          setIsAuthenticated(true);
          setGuestSession(session);
          
          // If session exists, auto-extend it
          if (config.security.session.autoExtend) {
            const updatedSession = {
              ...session,
              timestamp: Date.now()
            };
            localStorage.setItem('undangin_session', JSON.stringify(updatedSession));
            setGuestSession(updatedSession);
          }
        }
      } catch (error) {
        console.error('Session validation error:', error);
        // Clear any corrupted session data
        localStorage.removeItem('undangin_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleAuthSuccess = (session) => {
    setIsAuthenticated(true);
    setGuestSession(session);
  };

  const handleOpenInvitation = () => {
    setIsInvitationOpen(true);
  };

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{config.data.title}</title>
        <meta name="title" content={config.data.title} />
        <meta name="description" content={config.data.description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={config.data.title} />
        <meta property="og:description" content={config.data.description} />
        <meta property="og:image" content={config.data.ogImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={config.data.title} />
        <meta property="twitter:description" content={config.data.description} />
        <meta property="twitter:image" content={config.data.ogImage} />

        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href={config.data.favicon} />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FDA4AF" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </Helmet>

      <AnimatePresence mode='wait'>
        {!isAuthenticated ? (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        ) : !isInvitationOpen ? (
          <LandingPage 
            onOpenInvitation={handleOpenInvitation} 
            guestSession={guestSession}
          />
        ) : (
          <Layout guestSession={guestSession}>
            <MainContent guestSession={guestSession} />
          </Layout>
        )}
      </AnimatePresence>
    </HelmetProvider>
  );
}

export default App;