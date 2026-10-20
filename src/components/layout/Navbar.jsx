import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Layers,
  PieChart,
  Clock,
  Users2,
  Lightbulb,
  Plus,
  Menu,
  X,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { Button } from '../common/Button';
import { getDaysUntil } from '../../utils/date';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { events, activeEvent, setActiveEventId } = useEvents();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isLanding = location.pathname === '/';

  const appNavLinks = [
    { label: 'Overview', path: '/dashboard', icon: Layers },
    { label: 'Budget', path: '/budget', icon: PieChart },
    { label: 'Timeline', path: '/timeline', icon: Clock },
    { label: 'Vendors', path: '/vendors', icon: Users2 },
    { label: 'Creative Ideas', path: '/ideas', icon: Lightbulb },
  ];

  const landingNavLinks = [
    { label: 'Celebrations', href: '#categories' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Crafted Features', href: '#features' },
  ];

  const daysInfo = activeEvent ? getDaysUntil(activeEvent.date) : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stoneborder bg-[#FAF8F4]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="font-editorial text-2xl font-semibold tracking-tight text-charcoal group-hover:text-sage-800 transition-colors">
                Eventora
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-sage-500 mt-2" />
            </Link>

            {/* Navigation Links */}
            {!isLanding ? (
              <nav className="hidden lg:flex items-center gap-1">
                {appNavLinks.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`text-sm px-3.5 py-2 rounded-xl transition-colors font-medium ${
                        isActive
                          ? 'bg-sage-100/70 text-sage-900 font-semibold'
                          : 'text-muted hover:text-charcoal hover:bg-white/60'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
                {landingNavLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="hover:text-charcoal transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/dashboard"
                  className="hover:text-charcoal transition-colors"
                >
                  Live Demo
                </Link>
              </nav>
            )}
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Active Event Selector Dropdown (when not on landing or if events exist) */}
            {events.length > 0 && !isLanding && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-stoneborder bg-white hover:border-sage-400 text-left transition-colors text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-sage-600" />
                  <div className="max-w-[160px] truncate">
                    <p className="font-medium text-charcoal truncate">
                      {activeEvent?.name || 'Select Celebration'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted shrink-0" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-stoneborder shadow-dropdown py-2 z-50">
                    <div className="px-3.5 py-2 border-b border-stoneborder flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted tracking-wider uppercase">
                        Active Celebrations
                      </span>
                      <Link
                        to="/events"
                        onClick={() => setDropdownOpen(false)}
                        className="text-xs text-sage-700 hover:underline font-medium"
                      >
                        All ({events.length})
                      </Link>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                      {events.map((ev) => {
                        const isSelected = ev.id === activeEvent?.id;
                        return (
                          <button
                            key={ev.id}
                            onClick={() => {
                              setActiveEventId(ev.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors text-xs ${
                              isSelected
                                ? 'bg-sage-50 text-sage-900 font-semibold'
                                : 'hover:bg-ivory text-charcoal'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <p className="truncate font-medium">{ev.name}</p>
                              <p className="text-[11px] text-muted capitalize">
                                {ev.type} • {ev.location}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-sage-700 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Plan Event CTA */}
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => navigate('/create')}
            >
              Plan an Event
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal hover:bg-white transition-colors border border-stoneborder"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stoneborder bg-[#FAF8F4] px-4 pt-3 pb-6 space-y-3">
          {activeEvent && !isLanding && (
            <div className="p-3 rounded-xl bg-white border border-stoneborder">
              <span className="text-[11px] uppercase tracking-wider text-muted font-medium">
                Active Celebration
              </span>
              <p className="text-sm font-semibold text-charcoal truncate mt-0.5">
                {activeEvent.name}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                <span className="capitalize">{activeEvent.type}</span>
                <span>•</span>
                <span>{daysInfo?.label}</span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-white"
            >
              Home
            </Link>
            {appNavLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-white"
            >
              All Events ({events.length})
            </Link>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              className="w-full justify-center"
              icon={Plus}
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/create');
              }}
            >
              Plan an Event
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
