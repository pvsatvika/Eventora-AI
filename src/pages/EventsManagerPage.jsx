import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Coins,
  Plus,
  Trash2,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR } from '../utils/currency';
import { formatDate, getDaysUntil } from '../utils/date';

export const EventsManagerPage = () => {
  const navigate = useNavigate();
  const { events, activeEventId, setActiveEventId, deleteEvent, resetToDefaults } =
    useEvents();

  const handleSelect = (id) => {
    setActiveEventId(id);
    navigate('/dashboard');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this celebration plan?')) {
      deleteEvent(id);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all celebrations to default demo blueprints?')) {
      resetToDefaults();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-sage-800 font-semibold">
            Celebration Portfolio
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal font-normal mt-1">
            All Saved Celebrations ({events.length})
          </h1>
          <p className="text-sm text-muted mt-1">
            Switch between plans or begin curating a new celebration
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={handleReset}
            title="Reset to sample demo events"
          >
            Reset Demos
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/create')}
          >
            Plan an Event
          </Button>
        </div>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => {
          const isActive = ev.id === activeEventId;
          const daysInfo = getDaysUntil(ev.date);

          return (
            <Card
              key={ev.id}
              onClick={() => handleSelect(ev.id)}
              className={`p-6 flex flex-col justify-between cursor-pointer transition-all hover:border-sage-400 bg-white ${
                isActive
                  ? 'border-sage-700 shadow-card ring-1 ring-sage-700'
                  : 'border-stoneborder'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-800 bg-sage-50 px-2.5 py-0.5 rounded-md border border-sage-200/60">
                    {ev.type}
                  </span>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sage-900 bg-sage-100 px-2.5 py-0.5 rounded-full border border-sage-200">
                      <Check className="w-3 h-3 text-sage-800" />
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleDelete(e, ev.id)}
                      className="p-1 rounded-lg text-muted hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Delete celebration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="font-editorial text-xl text-charcoal font-medium mb-1.5 leading-snug">
                  {ev.name}
                </h3>

                <p className="text-xs text-muted mb-4">
                  Theme: <span className="text-charcoal font-medium">{ev.theme}</span>
                </p>

                <div className="space-y-2 py-3 border-y border-stoneborder text-xs text-muted mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-muted" />
                    <span>
                      {formatDate(ev.date)} ({daysInfo.label})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-muted" />
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-muted" />
                    <span>{ev.expectedGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-muted" />
                    <span>Budget: {formatINR(ev.totalBudget)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="font-medium text-sage-800">
                  {isActive ? 'Currently Active' : 'Switch to this plan'}
                </span>
                <span className="text-charcoal font-medium">→</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
