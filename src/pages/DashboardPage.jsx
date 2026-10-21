import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { formatINR } from '../utils/currency';
import { formatDate, getDaysUntil } from '../utils/date';
import { EventBanner } from '../components/layout/EventBanner';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { activeEvent, toggleTask } = useEvents();

  if (!activeEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-editorial text-2xl text-charcoal">No Active Celebration</h2>
        <p className="text-muted text-sm mt-1.5">
          Select an existing celebration or plan a new one.
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate('/create')}>Plan an Event</Button>
        </div>
      </div>
    );
  }

  // Derived metrics
  const totalBudget = Number(activeEvent.totalBudget) || 0;
  const expenses = activeEvent.expenses || [];
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const tasks = activeEvent.timelineTasks || [];
  const completedTasks = tasks.filter((t) => t.completed);
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const vendors = activeEvent.vendors || [];
  const bookedVendors = vendors.filter((v) => v.status === 'Booked' || v.status === 'Deposit Paid');
  const vendorProgress = vendors.length > 0 ? Math.round((bookedVendors.length / vendors.length) * 100) : 0;

  // Celebration Readiness Score
  // Accurately reflects real milestone deliverables completed (50%) and core vendor partners secured (50%)
  let readinessScore = 0;
  if (tasks.length > 0 && vendors.length > 0) {
    readinessScore = Math.round(taskProgress * 0.5 + vendorProgress * 0.5);
  } else if (tasks.length > 0) {
    readinessScore = taskProgress;
  } else if (vendors.length > 0) {
    readinessScore = vendorProgress;
  }

  const daysInfo = getDaysUntil(activeEvent.date);
  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  return (
    <div>
      <EventBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Readiness Overview Panel */}
        <div className="bg-white rounded-3xl border border-stoneborder p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-sage-800 font-semibold">
                Celebration Execution Status
              </span>
              <span className="text-[11px] text-muted">
                (Based on 50% Tasks + 50% Vendors)
              </span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-normal">
              Planning is {readinessScore}% Complete
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              {readinessScore === 100
                ? 'Flawless execution! All milestones and vendor partners are safely secured.'
                : readinessScore > 75
                ? 'Excellent progress. Core vendors and high-priority milestones are safely locked in.'
                : readinessScore > 40
                ? 'Good momentum. Next step: confirm pending key vendor deposits and review the timeline.'
                : readinessScore > 0
                ? 'Execution underway. Progress updates automatically as milestones are checked off and vendors booked.'
                : 'Blueprint created. Progress tracks actual milestone completions and confirmed vendor bookings as you execute.'}
            </p>
          </div>

          <div className="flex items-center justify-around gap-3 sm:gap-6 bg-ivory/60 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-stoneborder text-center w-full md:w-auto">
            <div>
              <span className="font-editorial text-2xl font-medium text-charcoal block">
                {daysInfo.days}
              </span>
              <span className="text-[11px] text-muted uppercase font-medium">
                Days to Go
              </span>
            </div>
            <div className="h-8 w-px bg-stoneborder" />
            <div>
              <span className="font-editorial text-2xl font-medium text-charcoal block">
                {completedTasks.length}/{tasks.length}
              </span>
              <span className="text-[11px] text-muted uppercase font-medium">
                Tasks Done
              </span>
            </div>
            <div className="h-8 w-px bg-stoneborder" />
            <div>
              <span className="font-editorial text-2xl font-medium text-charcoal block">
                {bookedVendors.length}/{vendors.length}
              </span>
              <span className="text-[11px] text-muted uppercase font-medium">
                Vendors Booked
              </span>
            </div>
          </div>
        </div>

        {/* Gemini Editorial Blueprint Overview (when generated by AI) */}
        {activeEvent.aiOverview && (
          <div className="bg-white rounded-3xl border border-stoneborder p-6 sm:p-8 shadow-card text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stoneborder pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-sage-800 font-semibold">
                  AI Architecture
                </span>
                <h3 className="font-editorial text-xl text-charcoal font-medium mt-0.5">
                  {activeEvent.aiModelLabel || 'Google Gemini'} Editorial Blueprint
                </h3>
              </div>
              {Array.isArray(activeEvent.aiOverview.theme_palette) && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-muted">Aesthetic Palette:</span>
                  {activeEvent.aiOverview.theme_palette.map((color, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-ivory border border-stoneborder text-charcoal font-medium"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-muted leading-relaxed">
              {activeEvent.aiOverview.summary}
            </p>

            {Array.isArray(activeEvent.aiOverview.key_recommendations) &&
              activeEvent.aiOverview.key_recommendations.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs uppercase tracking-wider text-charcoal font-semibold block mb-2">
                    Key Recommendations for Host
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {activeEvent.aiOverview.key_recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-ivory border border-stoneborder text-xs text-charcoal"
                      >
                        <Check className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* Card 1: Total Budget */}
          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Target Celebration Budget
            </span>
            <div className="font-editorial text-2xl text-charcoal font-medium">
              {formatINR(totalBudget)}
            </div>
            <span className="text-xs text-muted block mt-2">
              Structured across {(activeEvent.budgetCategories || []).length} categories
            </span>
          </Card>

          {/* Card 2: Logged Expenses */}
          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Logged Expenses
            </span>
            <div className="font-editorial text-2xl text-charcoal font-medium">
              {formatINR(totalSpent)}
            </div>
            <div className="mt-2.5">
              <ProgressBar
                value={totalSpent}
                max={totalBudget || 1}
                color={totalSpent > totalBudget ? 'bg-rose-600' : 'bg-sage-700'}
                height="h-1.5"
              />
              <span className="text-[11px] text-muted block mt-1">
                {budgetUtilization}% of total utilized
              </span>
            </div>
          </Card>

          {/* Card 3: Remaining Budget or Overspend Deficit */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted block">
                {remainingBudget >= 0 ? 'Remaining Safe Budget' : 'Budget Overspend Deficit'}
              </span>
              {remainingBudget < 0 && (
                <Badge variant="danger" size="xs">
                  Over Budget
                </Badge>
              )}
            </div>
            <div
              className={`font-editorial text-2xl font-medium ${
                remainingBudget < 0 ? 'text-rose-700' : 'text-sage-800'
              }`}
            >
              {remainingBudget < 0
                ? `- ${formatINR(Math.abs(remainingBudget))}`
                : formatINR(remainingBudget)}
            </div>
            <span className="text-xs text-muted block mt-2">
              {remainingBudget >= 0
                ? 'Available for pending contracts'
                : `Exceeded celebration target by ${formatINR(Math.abs(remainingBudget))}`}
            </span>
          </Card>

          {/* Card 4: Milestones Progress */}
          <Card className="p-6">
            <span className="text-xs font-medium text-muted block mb-1">
              Milestones Progress
            </span>
            <div className="font-editorial text-2xl text-charcoal font-medium">
              {taskProgress}%
            </div>
            <div className="mt-2.5">
              <ProgressBar
                value={completedTasks.length}
                max={tasks.length || 1}
                color="bg-sage-700"
                height="h-1.5"
              />
              <span className="text-[11px] text-muted block mt-1">
                {completedTasks.length} of {tasks.length} deliverables checked
              </span>
            </div>
          </Card>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Left Column (8 cols): Tasks & Budget Distribution */}
          <div className="lg:col-span-7 space-y-8">
            {/* Upcoming Tasks */}
            <Card className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-editorial text-xl text-charcoal font-medium">
                    Upcoming Deliverables
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Click to check off deliverables as you complete them
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/timeline')}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  All Tasks ({tasks.length})
                </Button>
              </div>

              {upcomingTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted bg-ivory rounded-2xl border border-stoneborder">
                  All upcoming deliverables checked off. Your schedule is clear.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {upcomingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-stoneborder hover:border-sage-300 transition-colors bg-white"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => toggleTask(activeEvent.id, t.id)}
                          className="w-4 h-4 rounded text-sage-700 focus:ring-sage-600 cursor-pointer accent-sage-700"
                        />
                        <div className="truncate">
                          <p className="text-sm font-medium text-charcoal truncate">
                            {t.title}
                          </p>
                          <p className="text-xs text-muted">
                            {t.phase} • Due: {formatDate(t.dueDate)}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={t.priority === 'high' ? 'danger' : 'neutral'}
                        size="xs"
                      >
                        {t.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Budget Allocation Breakdown */}
            <Card className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-editorial text-xl text-charcoal font-medium">
                    Budget Distribution
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Planned allocations versus recorded expenses
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/budget')}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Manage Budget
                </Button>
              </div>

              <div className="space-y-4">
                {(activeEvent.budgetCategories || []).map((cat) => {
                  const catSpent = expenses
                    .filter((e) => e.categoryId === cat.id)
                    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
                  const isOver = catSpent > cat.allocated;

                  return (
                    <div key={cat.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs gap-2">
                        <span className="font-medium text-charcoal truncate" title={cat.name}>
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0 text-right">
                          <span className="text-muted">Spent: {formatINR(catSpent)}</span>
                          <span className="font-semibold text-charcoal">
                            / {formatINR(cat.allocated)}
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        value={catSpent}
                        max={cat.allocated || 1}
                        color={isOver ? 'bg-rose-600' : 'bg-sage-600'}
                        height="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Column (5 cols): Vendor Summary & Creative Suggestions */}
          <div className="lg:col-span-5 space-y-8">
            {/* Vendor Pipeline */}
            <Card className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-editorial text-xl text-charcoal font-medium">
                    Vendor Team
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Key partners & bookings</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/vendors')}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Checklist
                </Button>
              </div>

              <div className="space-y-2.5">
                {vendors.slice(0, 4).map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl border border-stoneborder flex items-center justify-between bg-white"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-medium text-charcoal">{v.name}</h4>
                        {v.isSuggestedRole && (
                          <span className="text-[10px] text-muted px-1.5 py-0.5 rounded bg-ivory border border-stoneborder">
                            Suggested Role
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted">{v.category}</p>
                    </div>

                    <Badge
                      variant={
                        v.status === 'Booked'
                          ? 'success'
                          : v.status === 'Deposit Paid'
                          ? 'primary'
                          : 'neutral'
                      }
                      size="xs"
                    >
                      {v.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Creative Ideas Peek */}
            <Card className="p-6 sm:p-8 bg-ivory/50">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-editorial text-xl text-charcoal font-medium">
                    Curated Concepts
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Aesthetic & dining inspiration</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/ideas')}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Ideas Hub
                </Button>
              </div>

              <div className="space-y-3">
                {(activeEvent.aiIdeas || []).slice(0, 2).map((idea) => (
                  <div
                    key={idea.id}
                    className="p-4 rounded-xl bg-white border border-stoneborder text-left shadow-subtle space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-sage-800 font-semibold">
                        {idea.tag}
                      </span>
                      <Badge variant="neutral" size="xs">
                        {idea.costImpact}
                      </Badge>
                    </div>
                    <h4 className="font-editorial text-base text-charcoal font-medium">
                      {idea.title}
                    </h4>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {idea.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
