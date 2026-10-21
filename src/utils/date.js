/**
 * Date formatting and calculation utilities
 */

export const formatDate = (dateStr) => {
  if (!dateStr) return 'TBD';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getDaysUntil = (dateStr) => {
  if (!dateStr) return { days: 0, label: 'Date not set', isPast: false };
  const target = new Date(dateStr);
  const now = new Date();
  
  // Set both to midnight for day comparison
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: Math.abs(diffDays), label: `${Math.abs(diffDays)} days ago`, isPast: true };
  } else if (diffDays === 0) {
    return { days: 0, label: 'Today is the day! 🎉', isPast: false, isToday: true };
  } else if (diffDays === 1) {
    return { days: 1, label: 'Tomorrow! 🚀', isPast: false };
  } else {
    return { days: diffDays, label: `${diffDays} days to go`, isPast: false };
  }
};

export const getFutureDateString = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

/**
 * Calculate sensible deadline, phase, and category for an idea deliverable.
 * Offsets:
 * - Decor & styling: 14 days
 * - Food & menu: 14 days
 * - Entertainment: 21 days
 * - Themes & aesthetics: 30 days
 * Adapts to remaining runway, never assigns past dates, and permits same-day deadline for events happening today.
 */
export const calculateIdeaDeliverableDetails = (idea, eventDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let eventDt;
  if (typeof eventDateStr === 'string' && eventDateStr.includes('-')) {
    const parts = eventDateStr.split('T')[0].split('-').map(Number);
    eventDt = new Date(parts[0], parts[1] - 1, parts[2]);
  } else {
    eventDt = new Date(eventDateStr);
  }
  eventDt.setHours(0, 0, 0, 0);

  const daysRemaining = Math.max(0, Math.round((eventDt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const type = (idea.type || '').toLowerCase();
  const tag = (idea.tag || '').toLowerCase();

  let idealOffset = 14;
  if (type === 'theme' || tag.includes('theme') || tag.includes('aesthetic')) {
    idealOffset = 30;
  } else if (type === 'entertainment' || tag.includes('entertainment') || tag.includes('music')) {
    idealOffset = 21;
  } else if (type === 'decor' || tag.includes('decor') || tag.includes('floral')) {
    idealOffset = 14;
  } else if (type === 'food' || tag.includes('food') || tag.includes('menu')) {
    idealOffset = 14;
  }

  let targetDt = new Date(eventDt);

  if (daysRemaining <= 0) {
    targetDt = new Date(eventDt);
  } else if (daysRemaining >= idealOffset) {
    targetDt.setDate(eventDt.getDate() - idealOffset);
  } else {
    const ratio = idealOffset >= 21 ? 0.6 : 0.4;
    const daysBefore = Math.max(1, Math.min(daysRemaining - 1, Math.round(daysRemaining * ratio)));
    targetDt.setDate(eventDt.getDate() - daysBefore);
  }

  if (targetDt < today && daysRemaining > 0) {
    targetDt = new Date(today);
  }

  const y = targetDt.getFullYear();
  const m = String(targetDt.getMonth() + 1).padStart(2, '0');
  const d = String(targetDt.getDate()).padStart(2, '0');
  const dueDateStr = `${y}-${m}-${d}`;
  const actualDaysBefore = Math.round((eventDt.getTime() - targetDt.getTime()) / (1000 * 60 * 60 * 24));

  let phase = '1-2 Weeks Before';
  if (actualDaysBefore === 0) {
    phase = 'Day of Event';
  } else if (actualDaysBefore <= 7) {
    phase = '1-2 Weeks Before';
  } else if (actualDaysBefore <= 14) {
    phase = '1-2 Weeks Before';
  } else if (actualDaysBefore <= 45) {
    phase = '1-2 Months Before';
  } else {
    phase = '3-6 Months Before';
  }

  return {
    dueDate: dueDateStr,
    phase,
    priority: actualDaysBefore <= 3 ? 'high' : 'medium',
    category: idea.tag || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Aesthetic Concept'),
  };
};
