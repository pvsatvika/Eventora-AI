import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Coins,
  Layers,
  PieChart,
  Clock,
  Users2,
  Lightbulb,
  Plus,
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { Button } from '../common/Button';
import { formatINR } from '../../utils/currency';
import { formatDate, getDaysUntil } from '../../utils/date';

export const EventBanner = () => {
  const navigate = useNavigate();
  const { activeEvent, events, setActiveEventId } = useEvents();

  if (!activeEvent) {
    return (
      <div className="bg-white border-b border-stoneborder py-12 px-4 text-center">
        <h2 className="font-editorial text-2xl text-charcoal">No Active Celebration Selected</h2>
        <p className="text-sm text-muted mt-1.5">Choose an existing celebration or plan a new one.</p>
        <div className="mt-5">
          <Button onClick={() => navigate('/create')}>Plan an Event</Button>
        </div>
      </div>
    );
  }

  const daysInfo = getDaysUntil(activeEvent.date);

  const tabs = [
    { label: 'Overview', path: '/dashboard', icon: Layers },
    { label: 'Budget Planner', path: '/budget', icon: PieChart },
    { label: 'Timeline & Tasks', path: '/timeline', icon: Clock },
    { label: 'Vendor Checklist', path: '/vendors', icon: Users2 },
    { label: 'Creative Ideas', path: '/ideas', icon: Lightbulb },
  ];

  return (
    <div className="bg-white border-b border-stoneborder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">
        {/* Top Celebration Context & Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-medium uppercase tracking-wider text-sage-800 bg-sage-50 px-2.5 py-1 rounded-md border border-sage-200/60">
                {activeEvent.type}
              </span>
              {activeEvent.theme && (
                <span className="text-xs text-muted font-medium bg-ivory px-2.5 py-1 rounded-md border border-stoneborder">
                  Theme: {activeEvent.theme}
                </span>
              )}
              <span className="text-xs font-medium text-sage-800 bg-sage-100/60 px-2.5 py-1 rounded-md">
                {daysInfo.label}
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-charcoal font-normal tracking-tight">
              {activeEvent.name}
            </h1>

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-5 pt-1 text-sm text-muted">
              <div className="flex items-center gap-1.5 font-medium text-charcoal">
                <Calendar className="w-4 h-4 text-sage-600" />
                <span>{formatDate(activeEvent.date)}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-charcoal">
                <MapPin className="w-4 h-4 text-sage-600" />
                <span>{activeEvent.location || 'Location Pending'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-charcoal">
                <Users className="w-4 h-4 text-sage-600" />
                <span>{activeEvent.expectedGuests} Guests</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-charcoal">
                <Coins className="w-4 h-4 text-sage-600" />
                <span>Budget: {formatINR(activeEvent.totalBudget)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-start md:self-end">
            <select
              value={activeEvent.id}
              onChange={(e) => setActiveEventId(e.target.value)}
              className="text-xs bg-ivory border border-stoneborder rounded-xl px-3 py-2 text-charcoal font-medium focus:ring-1 focus:ring-sage-500 cursor-pointer"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.type})
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/create')}
            >
              New Event
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-stoneborder pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                    isActive
                      ? 'border-sage-700 text-charcoal font-semibold -mb-[1px]'
                      : 'border-transparent text-muted hover:text-charcoal hover:border-stoneborder'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
