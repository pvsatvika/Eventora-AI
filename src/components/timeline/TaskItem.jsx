import React from 'react';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatDate, getDaysUntil } from '../../utils/date';

export const TaskItem = ({ task, onToggle, onDelete }) => {
  const isCompleted = task.completed;
  const daysInfo = task.dueDate ? getDaysUntil(task.dueDate) : null;

  const priorityVariants = {
    urgent: { variant: 'danger', label: 'Urgent Action' },
    high: { variant: 'danger', label: 'High Priority' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'neutral', label: 'Low' },
  };

  const priorityConfig = priorityVariants[task.priority?.toLowerCase()] || priorityVariants.medium;

  return (
    <div
      className={`group flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
        isCompleted
          ? 'bg-ivory/40 border-stoneborder opacity-65'
          : 'bg-white border-stoneborder hover:border-sage-300 hover:shadow-subtle'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <button
          onClick={() => onToggle(task.id)}
          className="mt-0.5 text-muted hover:text-sage-800 transition-colors shrink-0"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-sage-700 fill-sage-50" />
          ) : (
            <Circle className="w-5 h-5 text-muted/60 group-hover:text-sage-700" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-medium transition-colors ${
                isCompleted ? 'line-through text-muted' : 'text-charcoal'
              }`}
            >
              {task.title}
            </span>

            <Badge variant={priorityConfig.variant} size="xs">
              {priorityConfig.label}
            </Badge>

            {daysInfo?.isPast && !isCompleted && (
              <Badge variant="danger" size="xs">
                Overdue / Action Needed
              </Badge>
            )}

            {task.category && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-ivory text-muted border border-stoneborder font-medium">
                {task.category}
              </span>
            )}
          </div>

          {task.notes && (
            <p className="text-xs text-muted mt-1 leading-relaxed">{task.notes}</p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-muted">
            {task.dueDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted" />
                <span className={daysInfo?.isPast && !isCompleted ? 'text-rose-700 font-medium' : ''}>
                  Due: {formatDate(task.dueDate)} ({daysInfo?.label})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-muted hover:text-rose-700 hover:bg-rose-50 transition-all shrink-0"
        title="Delete deliverable"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
