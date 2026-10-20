import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Search,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventBanner } from '../components/layout/EventBanner';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { TaskItem } from '../components/timeline/TaskItem';
import { AddTaskModal } from '../components/timeline/AddTaskModal';
import { EmptyState } from '../components/common/EmptyState';

export const TimelinePage = () => {
  const { activeEvent, toggleTask, addTask, deleteTask } = useEvents();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  if (!activeEvent) return null;

  const tasks = activeEvent.timelineTasks || [];
  const completedTasks = tasks.filter((t) => t.completed);
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? t.completed
        : !t.completed;
    const matchesPriority =
      filterPriority === 'all' ? true : t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group tasks by phase and order phases chronologically by earliest deliverable
  const groupedTasksMap = {};
  filteredTasks.forEach((t) => {
    const phase = t.phase || 'General Milestones';
    if (!groupedTasksMap[phase]) groupedTasksMap[phase] = [];
    groupedTasksMap[phase].push(t);
  });

  // Sort tasks within each phase chronologically
  Object.values(groupedTasksMap).forEach((list) => {
    list.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
  });

  // Sort phase groups chronologically by earliest dueDate (with Post Event at end)
  const sortedPhaseEntries = Object.entries(groupedTasksMap).sort(([, aTasks], [, bTasks]) => {
    const isPostA = aTasks[0]?.phase?.toLowerCase().includes('post');
    const isPostB = bTasks[0]?.phase?.toLowerCase().includes('post');
    if (isPostA !== isPostB) return isPostA ? 1 : -1;
    const dtA = aTasks[0]?.dueDate ? new Date(aTasks[0].dueDate).getTime() : Infinity;
    const dtB = bTasks[0]?.dueDate ? new Date(bTasks[0].dueDate).getTime() : Infinity;
    return dtA - dtB;
  });

  const handleToggle = (taskId) => {
    toggleTask(activeEvent.id, taskId);
  };

  const handleDelete = (taskId) => {
    deleteTask(activeEvent.id, taskId);
  };

  const handleAddTask = (taskData) => {
    addTask(activeEvent.id, taskData);
  };

  return (
    <div>
      <EventBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
        {/* Header & Add Deliverable */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-normal">
              Chronological Timeline & Deliverables
            </h2>
            <p className="text-sm text-muted mt-1">
              Phased roadmap from planning kickoff to day-of event execution
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Deliverable
          </Button>
        </div>

        {/* Milestone Progress Bar Card */}
        <Card className="p-6 sm:p-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-sage-800 font-semibold">
                Milestone Execution Progress
              </span>
              <div className="font-editorial text-2xl text-charcoal font-medium mt-1">
                {completedTasks.length} of {tasks.length} Deliverables Completed ({progressPercent}%)
              </div>
            </div>

            <span className="text-xs px-3 py-1.5 rounded-full bg-ivory border border-stoneborder text-charcoal font-medium">
              {tasks.length - completedTasks.length} Pending Actions
            </span>
          </div>

          <ProgressBar
            value={completedTasks.length}
            max={tasks.length || 1}
            color="bg-sage-700"
            height="h-2"
          />
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stoneborder shadow-subtle">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deliverables, category, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stoneborder focus:outline-none focus:ring-1 focus:ring-sage-600 bg-ivory/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-white border border-stoneborder rounded-xl px-3 py-2 text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-sage-600 cursor-pointer"
            >
              <option value="all">All Statuses ({tasks.length})</option>
              <option value="pending">Pending ({tasks.length - completedTasks.length})</option>
              <option value="completed">Completed ({completedTasks.length})</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs bg-white border border-stoneborder rounded-xl px-3 py-2 text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-sage-600 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Grouped Chronological Phases */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No deliverables found"
            description="Try clearing your search criteria or add a custom deliverable to your timeline."
            actionLabel="Add Deliverable"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="space-y-10">
            {sortedPhaseEntries.map(([phaseName, phaseTasks]) => {
              if (phaseTasks.length === 0) return null;
              const phaseDoneCount = phaseTasks.filter((t) => t.completed).length;

              return (
                <div key={phaseName} className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-stoneborder pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-sage-700" />
                      <h3 className="font-editorial text-lg text-charcoal font-medium">
                        {phaseName}
                      </h3>
                    </div>
                    <span className="text-xs text-muted">
                      {phaseDoneCount} / {phaseTasks.length} Completed
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {phaseTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
};
