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
