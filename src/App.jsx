import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { DashboardPage } from './pages/DashboardPage';
import { BudgetPage } from './pages/BudgetPage';
import { TimelinePage } from './pages/TimelinePage';
import { VendorsPage } from './pages/VendorsPage';
import { IdeasPage } from './pages/IdeasPage';
import { EventsManagerPage } from './pages/EventsManagerPage';

export function App() {
  return (
    <EventProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#252B28]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/create" element={<CreateEventPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/ideas" element={<IdeasPage />} />
              <Route path="/events" element={<EventsManagerPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </EventProvider>
  );
}

export default App;
