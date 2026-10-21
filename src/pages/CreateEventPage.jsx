import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Check,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { formatINR } from '../utils/currency';
import { getFutureDateString } from '../utils/date';
import { checkBackendHealth, generateEventPlanWithAI } from '../utils/api';

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const { createNewEvent, events = [] } = useEvents();

  const [formData, setFormData] = useState({
    type: 'wedding',
    name: '',
    date: getFutureDateString(60),
    location: '',
    totalBudget: 1500000,
    expectedGuests: 200,
    theme: 'Royal Rajputana & Twilight Glow',
    specialRequirements: '',
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    ok: false,
    geminiConfigured: false,
    model: 'gemini-2.5-flash',
  });
  const [generationMode, setGenerationMode] = useState('gemini'); // 'gemini' | 'demo'
  const [apiErrorModal, setApiErrorModal] = useState({ isOpen: false, message: '', statusCode: null });
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  // Check backend health on mount
  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((status) => {
      if (!isMounted) return;
      setBackendStatus({ loading: false, ...status });
      if (status.ok && status.geminiConfigured) {
        setGenerationMode('gemini');
      } else {
        setGenerationMode('demo');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const eventTypes = [
    {
      id: 'wedding',
      name: 'Wedding & Sangeet',
      description: 'Multi-day celebrations, floral mandaps & royal banquets',
      defaultName: "Ananya & Kabir's Wedding Celebration",
      defaultBudget: 1800000,
      defaultGuests: 250,
      defaultTheme: 'Royal Rajputana & Twilight Glow',
    },
    {
      id: 'birthday',
      name: 'Milestone Birthday',
      description: 'Intimate dinner party, signature desserts & live music',
      defaultName: "Aarav's 30th Evening Gathering",
      defaultBudget: 150000,
      defaultGuests: 50,
      defaultTheme: 'Warm Speakeasy & Acoustic Lounge',
    },
    {
      id: 'community',
      name: 'Community Gathering',
      description: 'Open-air cultural melas, local artisans & food stalls',
      defaultName: 'Indiranagar Spring Cultural Festival',
      defaultBudget: 350000,
      defaultGuests: 400,
      defaultTheme: 'Eco-Friendly Heritage & Folk Arts',
    },
  ];

  const themeSuggestions = {
    wedding: [
      'Royal Rajputana & Gold',
      'Bohemian Pastel Garden',
      'Minimalist Contemporary White',
      'Traditional South Indian Temple',
      'Heritage Palace Twilight',
    ],
    birthday: [
      'Warm Speakeasy & Acoustic',
      'Vintage 1920s Cocktail Hour',
      'Botanical Greenhouse Dinner',
      'Retro Vinyl & Tapas',
      'Golden Hour Rooftop',
    ],
    community: [
      'Zero-Waste Eco Living',
      'Local Artisans & Folk Crafts',
      'Neighborhood Music Mela',
      'Heritage Food & Storytelling',
      'Outdoor Cinema & Lawn Picnic',
    ],
  };

  const budgetPresets = {
    wedding: [800000, 1500000, 2500000, 5000000],
    birthday: [50000, 100000, 200000, 350000],
    community: [150000, 300000, 500000, 1000000],
  };

  const handleTypeSelect = (typeId) => {
    const preset = eventTypes.find((t) => t.id === typeId);
    setFormData((prev) => ({
      ...prev,
      type: typeId,
      name:
        prev.name === '' || eventTypes.some((t) => t.defaultName === prev.name)
          ? preset.defaultName
          : prev.name,
      totalBudget: preset.defaultBudget,
      expectedGuests: preset.defaultGuests,
      theme: preset.defaultTheme,
    }));
  };

  const handleQuickFill = (typeId) => {
    const preset = eventTypes.find((t) => t.id === typeId);
    setFormData({
      type: typeId,
      name: preset.defaultName,
      date: getFutureDateString(typeId === 'wedding' ? 75 : 30),
      location: typeId === 'wedding' ? 'Udaipur, Rajasthan' : 'Bengaluru, Karnataka',
      totalBudget: preset.defaultBudget,
      expectedGuests: preset.defaultGuests,
      theme: preset.defaultTheme,
      specialRequirements:
        typeId === 'wedding'
          ? 'Pure vegetarian catering for traditional rituals, wheelchair accessibility, and evening fireworks permit.'
          : typeId === 'birthday'
          ? 'Curated mixology bar with craft mocktails, Polaroid guestbook, and artisanal cake styling.'
          : 'Zero single-use plastic, filtered water refill stations, and first-aid safety tent.',
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide a celebration name';
    if (!formData.date) newErrors.date = 'Celebration date is required';
    if (!formData.location.trim()) newErrors.location = 'Please specify city or venue location';
    if (!formData.totalBudget || Number(formData.totalBudget) < 5000) {
      newErrors.totalBudget = 'Please enter a valid budget in INR (minimum ₹5,000)';
    }
    if (!formData.expectedGuests || Number(formData.expectedGuests) < 1) {
      newErrors.expectedGuests = 'Please specify expected guest count';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const geminiSteps = [
    'Connecting to Google Gemini Generative AI...',
    'Analyzing celebration parameters, guest logistics, and Indian cultural nuances...',
    `Structuring proportional INR allocations across categories for ${formatINR(formData.totalBudget)}...`,
    'Synthesizing chronological milestones and deadline dates...',
    'Curating vendor partner roles and bespoke lifestyle concepts...',
  ];

  const demoSteps = [
    'Synthesizing celebration format and guest logistics...',
    `Allocating ${formatINR(formData.totalBudget)} across core celebration categories...`,
    'Generating milestone timeline and deliverables...',
    'Curating vendor requirements & booking checklist...',
    'Preparing creative themes, decor, and culinary concepts...',
  ];

  const triggerSuccessCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#748C78', '#526B57', '#E9C9C3', '#FAF8F4'],
      });
    } catch {
      // graceful fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsGenerating(true);
    setGenerationStep(0);

    const activeSteps = generationMode === 'gemini' ? geminiSteps : demoSteps;

    // Animated step progress interval
    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < activeSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 850);

    if (generationMode === 'gemini') {
      try {
        const matchingExisting = events.find(
          (ev) => ev.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
        );
        const existingCompletedTasks = matchingExisting?.timelineTasks
          ?.filter((t) => t.completed)
          ?.map((t) => t.title) || [];

        const aiPlan = await generateEventPlanWithAI({
          ...formData,
          existingCompletedTasks,
        });
        clearInterval(stepInterval);
        setIsGenerating(false);

        // Save AI Plan into EventContext (which persists to localStorage)
        createNewEvent(aiPlan);
        triggerSuccessCelebration();
        navigate('/dashboard');
      } catch (err) {
        clearInterval(stepInterval);
        setIsGenerating(false);
        setApiErrorModal({
          isOpen: true,
          message: err.message || 'Failed to communicate with Google Gemini API.',
          statusCode: err.statusCode || 500,
        });
      }
    } else {
      // Local Demo Mode
      setTimeout(() => {
        clearInterval(stepInterval);
        setIsGenerating(false);
        createNewEvent(formData);
        triggerSuccessCelebration();
        navigate('/dashboard');
      }, 3000);
    }
  };

  const handleFallbackToDemo = () => {
    setApiErrorModal({ isOpen: false, message: '', statusCode: null });
    setGenerationMode('demo');
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < demoSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(stepInterval);
      setIsGenerating(false);
      createNewEvent(formData);
      triggerSuccessCelebration();
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="text-left mb-10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-wider text-sage-800 font-semibold">
            New Event Blueprint
          </p>

          {/* Backend AI Status Indicator */}
          <div className="flex items-center gap-2">
            {backendStatus.loading ? (
              <span className="text-xs text-muted flex items-center gap-1.5 bg-ivory px-3 py-1 rounded-full border border-stoneborder">
                <RefreshCw className="w-3 h-3 animate-spin text-sage-700" />
                <span>Checking AI Server...</span>
              </span>
            ) : backendStatus.ok && backendStatus.geminiConfigured ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-50 text-sage-900 border border-sage-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Google Gemini ({backendStatus.model}) Connected</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfigGuide(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors text-xs font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Gemini API Key Needed • Configure</span>
              </button>
            )}
          </div>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
          Let’s begin planning your celebration.
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-xl">
          Provide your core event parameters. Eventora will synthesize a bespoke blueprint complete with category INR allocations, chronological tasks, and vendor checklists.
        </p>

        {/* Engine Switcher */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-stoneborder shadow-subtle">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-charcoal">Generation Engine:</span>
            <div className="flex items-center gap-1.5 bg-ivory p-1 rounded-xl border border-stoneborder text-xs font-medium">
              <button
                type="button"
                onClick={() => setGenerationMode('gemini')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  generationMode === 'gemini'
                    ? 'bg-sage-700 text-white shadow-subtle font-semibold'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                Google Gemini AI
              </button>
              <button
                type="button"
                onClick={() => setGenerationMode('demo')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  generationMode === 'demo'
                    ? 'bg-sage-700 text-white shadow-subtle font-semibold'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                Local Demo Engine
              </button>
            </div>
          </div>

          {/* Quick Sample Presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted">Test Sample:</span>
            {eventTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleQuickFill(t.id)}
                className="text-xs px-2.5 py-1 rounded-lg border border-stoneborder bg-white hover:border-sage-400 text-charcoal transition-colors"
              >
                {t.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Celebration Format */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stoneborder shadow-card space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
            1. Celebration Format *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {eventTypes.map((t) => {
              const isSelected = formData.type === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleTypeSelect(t.id)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-sage-700 bg-sage-50/60 shadow-subtle ring-1 ring-sage-700'
                      : 'border-stoneborder bg-white hover:border-sage-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-editorial text-base text-charcoal font-medium">
                        {t.name}
                      </h4>
                      {isSelected && (
                        <Check className="w-4 h-4 text-sage-800" />
                      )}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Name, Date, Location */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stoneborder shadow-card space-y-5 text-left">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
            2. Name, Date & Host City
          </label>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1.5">
              Celebration Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Diya & Arjun's Wedding Reception"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              className={`w-full text-sm rounded-xl border px-4 py-2.5 bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5">
                Celebration Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (errors.date) setErrors({ ...errors, date: null });
                }}
                className={`w-full text-sm rounded-xl border px-4 py-2.5 bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors ${
                  errors.date ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
                }`}
              />
              {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5">
                Host City / Venue *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka or Jaipur"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    if (errors.location) setErrors({ ...errors, location: null });
                  }}
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors ${
                    errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
                  }`}
                />
              </div>
              {errors.location && (
                <p className="text-xs text-rose-600 mt-1">{errors.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: INR Budget & Guests */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stoneborder shadow-card space-y-6 text-left">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
            3. Budget & Guest Capacity
          </label>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-charcoal">
                Target Celebration Budget in INR (₹) *
              </label>
              <span className="font-editorial text-lg text-sage-900 font-semibold">
                {formatINR(formData.totalBudget)}
              </span>
            </div>

            <div className="relative mb-3">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-medium text-sm">
                ₹
              </span>
              <input
                type="number"
                step="5000"
                value={formData.totalBudget}
                onChange={(e) => {
                  setFormData({ ...formData, totalBudget: Number(e.target.value) });
                  if (errors.totalBudget) setErrors({ ...errors, totalBudget: null });
                }}
                className={`w-full pl-8 pr-4 py-2.5 text-sm font-medium rounded-xl border bg-ivory/50 focus:bg-white focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors ${
                  errors.totalBudget ? 'border-rose-400 bg-rose-50/20' : 'border-stoneborder'
                }`}
              />
            </div>
            {errors.totalBudget && (
              <p className="text-xs text-rose-600 mb-2">{errors.totalBudget}</p>
            )}

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-muted font-medium">Quick Presets:</span>
              {(budgetPresets[formData.type] || []).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormData({ ...formData, totalBudget: preset })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    formData.totalBudget === preset
                      ? 'bg-sage-700 text-white border-sage-700 font-medium'
                      : 'bg-ivory text-charcoal border-stoneborder hover:border-sage-400'
                  }`}
                >
                  {formatINR(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Count */}
          <div className="pt-2 border-t border-stoneborder">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-charcoal">
                Expected Guests *
              </label>
              <span className="font-editorial text-lg text-sage-900 font-semibold">
                {formData.expectedGuests} Guests
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={formData.expectedGuests}
              onChange={(e) =>
                setFormData({ ...formData, expectedGuests: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-stoneborder rounded-lg appearance-none cursor-pointer accent-sage-700 mb-2"
            />

            <div className="flex justify-between text-[11px] text-muted">
              <span>Intimate (10)</span>
              <span>Medium (250)</span>
              <span>Grand (500+)</span>
              <span>1000 Guests</span>
            </div>
          </div>
        </div>

        {/* Step 4: Theme & Notes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stoneborder shadow-card space-y-5 text-left">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
            4. Aesthetic Direction & Special Requests
          </label>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1.5">
              Theme / Aesthetic Vision
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Rajputana, Sunset Boho, Speakeasy Jazz"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-4 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors mb-2"
            />

            {/* Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-muted font-medium">Suggestions:</span>
              {(themeSuggestions[formData.type] || []).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: t })}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    formData.theme === t
                      ? 'bg-blush-100 text-charcoal border-blush-300 font-medium'
                      : 'bg-white text-muted border-stoneborder hover:text-charcoal'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1.5">
              Special Requirements & Notes (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Mention dietary preferences (e.g. Jain / Vegan), accessibility, ritual timings, or specific vendor requests..."
              value={formData.specialRequirements}
              onChange={(e) =>
                setFormData({ ...formData, specialRequirements: e.target.value })
              }
              className="w-full text-sm rounded-xl border border-stoneborder bg-ivory/50 focus:bg-white px-4 py-2.5 focus:ring-1 focus:ring-sage-600 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 text-center">
          <Button
            type="submit"
            variant="primary"
            size="xl"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full text-base font-medium shadow-card"
          >
            {generationMode === 'gemini'
              ? 'Generate My Event Plan with Gemini AI'
              : 'Generate Event Plan (Local Demo Mode)'}
          </Button>
          <p className="text-xs text-muted mt-2">
            {generationMode === 'gemini'
              ? 'Powered by Google Gemini Generative AI • Python FastAPI Backend'
              : 'Local Demo Mode active • No external API calls'}
          </p>
        </div>
      </form>

      {/* Generation Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stoneborder text-center shadow-dropdown">
            <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-800 border border-sage-200 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="font-editorial text-2xl text-charcoal font-medium">
              {generationMode === 'gemini'
                ? 'Synthesizing with Google Gemini'
                : 'Generating Event Blueprint'}
            </h3>
            <p className="text-xs text-muted mt-1 mb-6">
              Structuring tailored details for {formData.name}
            </p>

            <div className="space-y-3 text-left mb-6">
              {(generationMode === 'gemini' ? geminiSteps : demoSteps).map((step, idx) => {
                const isPassed = idx < generationStep;
                const isCurrent = idx === generationStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                      isCurrent
                        ? 'bg-sage-50 text-sage-900 font-medium border border-sage-200'
                        : isPassed
                        ? 'text-sage-800'
                        : 'text-muted/60'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-4 h-4 text-sage-700 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-sage-700 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-stoneborder shrink-0" />
                    )}
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>

            <div className="w-full bg-sage-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-sage-700 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((generationStep + 1) / (generationMode === 'gemini' ? geminiSteps : demoSteps).length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* API Error Notification Modal */}
      <Modal
        isOpen={apiErrorModal.isOpen}
        onClose={() => setApiErrorModal({ isOpen: false, message: '', statusCode: null })}
        title="Gemini AI Plan Generation Notice"
        subtitle="The server returned an informative error"
      >
        <div className="space-y-4 text-left">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-charcoal">Gemini Generation Note</p>
              <p className="mt-1">{apiErrorModal.message}</p>
            </div>
          </div>

          <div className="text-xs text-muted leading-relaxed space-y-1">
            <p>
              <strong>Why did this happen?</strong> Real Google Gemini generative AI requires an active API key configured in <code className="bg-ivory px-1.5 py-0.5 rounded border border-stoneborder">backend/.env</code>.
            </p>
            <p>
              You can generate your celebration plan immediately using the <strong>Local Demo Engine</strong> (no API key required), or add your key to <code className="bg-ivory px-1.5 py-0.5 rounded border border-stoneborder">backend/.env</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-stoneborder">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setApiErrorModal({ isOpen: false, message: '', statusCode: null });
                setShowConfigGuide(true);
              }}
            >
              How to Add Gemini Key
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleFallbackToDemo}
            >
              Generate with Demo Engine
            </Button>
          </div>
        </div>
      </Modal>

      {/* Backend / Gemini Setup Guide Modal */}
      <Modal
        isOpen={showConfigGuide}
        onClose={() => setShowConfigGuide(false)}
        title="Connecting Real Google Gemini AI"
        subtitle="Follow these 3 quick steps to enable live Gemini generative AI"
      >
        <div className="space-y-4 text-left text-xs text-muted leading-relaxed">
          <div className="p-3.5 rounded-xl bg-ivory border border-stoneborder space-y-1.5">
            <span className="font-semibold text-charcoal">Step 1: Get a Free Gemini API Key</span>
            <p>
              Visit <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-sage-800 underline font-medium">Google AI Studio</a> and click <em>Create API Key</em>. It is free with zero cloud billing required.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-ivory border border-stoneborder space-y-1.5">
            <span className="font-semibold text-charcoal">Step 2: Add to backend/.env</span>
            <p>
              Open <code className="bg-white px-1.5 py-0.5 rounded border border-stoneborder text-charcoal">backend/.env</code> and replace <code className="text-charcoal">YOUR_API_KEY_HERE</code> with your key:
            </p>
            <pre className="p-2.5 bg-charcoal text-ivory rounded-lg text-[11px] overflow-x-auto">
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
            </pre>
          </div>

          <div className="p-3.5 rounded-xl bg-ivory border border-stoneborder space-y-1.5">
            <span className="font-semibold text-charcoal">Step 3: Start the Backend Server</span>
            <p>In your terminal, run:</p>
            <pre className="p-2.5 bg-charcoal text-ivory rounded-lg text-[11px] overflow-x-auto">
python backend/main.py
            </pre>
          </div>

          <div className="flex justify-end pt-3 border-t border-stoneborder">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setShowConfigGuide(false)}
            >
              Got It
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
