import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Coins,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useEvents } from '../context/EventContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { setActiveEventId } = useEvents();

  const handleOpenDemo = (demoId) => {
    setActiveEventId(demoId);
    navigate('/dashboard');
  };

  const categories = [
    {
      id: 'demo-wedding-1',
      title: 'Weddings & Receptions',
      subtitle: 'From sangeet nights to the grand ceremony',
      description:
        'Coordinate floral mandaps, curated banquet catering in INR, candid photography crews, and graceful guest hospitality.',
      image:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      alt: 'Elegant outdoor wedding ceremony with natural floral arrangements',
      tag: 'Intimate to Grand',
    },
    {
      id: 'demo-birthday-1',
      title: 'Milestone Birthdays',
      subtitle: 'Memorable 1st, 18th, 30th & 50th celebrations',
      description:
        'Design custom cake styling, intimate lounge venues, playlist curation, dinner toasts, and bespoke guest favors.',
      image:
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      alt: 'Warm celebratory evening dinner with friends and toasts',
      tag: 'Festive & Personal',
    },
    {
      id: 'demo-community-1',
      title: 'Community Events',
      subtitle: 'Festivals, cultural melas & neighborhood gatherings',
      description:
        'Balance municipal permissions, sound stages, volunteer coordination, artisan stalls, and zero-waste hospitality.',
      image:
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
      alt: 'Community celebration sharing food under ambient string lights',
      tag: 'Vibrant Gathering',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Envision the Moment',
      description:
        'Specify your celebration type, date, host city, target INR budget, and guest capacity in simple steps.',
    },
    {
      number: '02',
      title: 'Curate Every Detail',
      description:
        'Receive a comprehensive blueprint with proportional budget allocations, milestone deadlines, and vendor checklists.',
    },
    {
      number: '03',
      title: 'Host with Composure',
      description:
        'Log expenses, verify booking contracts, mark off deliverables, and focus on enjoying your guests.',
    },
  ];

  return (
    <div className="space-y-32 pb-16">
      {/* 1. Split-Screen Hero Section */}
      <section className="pt-12 md:pt-20 lg:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100/70 text-sage-900 text-xs font-medium border border-sage-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-700" />
              <span>Thoughtful AI Event Planning</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal leading-[1.12] tracking-tight">
              Beautiful moments deserve thoughtful planning.
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              From intimate birthdays to unforgettable weddings, bring every detail together with your personal AI planning companion.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/create')}
                className="px-7"
              >
                Plan an Event
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleOpenDemo('demo-wedding-1')}
                className="px-6"
              >
                Explore Live Demo
              </Button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-sage-700" />
                <span>INR (₹) Budget Allocation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-sage-700" />
                <span>Chronological Milestones</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Quality Celebration Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-stoneborder shadow-card bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                alt="Intimate candlelit celebration table with linen and floral arrangements"
                className="w-full h-[420px] sm:h-[480px] object-cover rounded-2xl"
                loading="eager"
              />
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-stoneborder text-left shadow-subtle">
                <p className="text-xs uppercase tracking-wider font-semibold text-sage-800">
                  Featured Blueprint
                </p>
                <p className="font-editorial text-base text-charcoal font-medium mt-0.5">
                  Aarav & Meera's Sangeet & Reception
                </p>
                <div className="flex items-center justify-between text-xs text-muted mt-2 pt-2 border-t border-stoneborder">
                  <span>Jaipur, Rajasthan</span>
                  <span className="font-medium text-charcoal">₹18.5 Lakhs • 250 Guests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Image-Led Event Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 text-left">
          <p className="text-xs uppercase tracking-wider text-sage-800 font-semibold mb-2">
            Tailored Experiences
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
            Designed for the celebrations that matter most.
          </h2>
          <p className="text-muted text-sm sm:text-base mt-2.5">
            Whether welcoming close friends or an entire community, each format brings its own rhythm and budgeting structure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group rounded-3xl bg-white border border-stoneborder overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-charcoal text-xs font-medium px-3 py-1 rounded-full border border-stoneborder">
                    {cat.tag}
                  </div>
                </div>

                <div className="p-6 space-y-2 text-left">
                  <h3 className="font-editorial text-xl text-charcoal font-medium">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-medium text-sage-800">
                    {cat.subtitle}
                  </p>
                  <p className="text-sm text-muted leading-relaxed pt-1">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stoneborder mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleOpenDemo(cat.id)}
                  className="text-xs font-semibold text-sage-800 hover:text-sage-900 transition-colors"
                >
                  View Sample Plan →
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/create')}
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Clean How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stoneborder p-8 sm:p-14 text-left">
          <div className="max-w-xl mb-12">
            <p className="text-xs uppercase tracking-wider text-sage-800 font-semibold mb-2">
              The Journey
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
              How Eventora guides your planning.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((st) => (
              <div key={st.number} className="space-y-3">
                <span className="font-editorial text-3xl text-sage-600 block">
                  {st.number}
                </span>
                <h3 className="font-editorial text-lg text-charcoal font-medium">
                  {st.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Feature Showcase: Alternating Image/Text Layouts */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Showcase Item 1: Budgeting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-sage-800">
              <Coins className="w-4 h-4" />
              <span>INR Currency Intelligence</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
              Clarity over every rupee, without the spreadsheets.
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Every celebration type allocates resources differently. Eventora breaks down venue, catering, decor, and photography according to realistic Indian market ratios, helping you track advance deposits and outstanding balances in real time.
            </p>
            <ul className="space-y-2.5 text-sm text-charcoal pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-700" />
                <span>Customizable planned allocations for every category</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-700" />
                <span>Track logged payments versus remaining safe budget</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-700" />
                <span>Over-allocation notifications before contracts are signed</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-stoneborder shadow-card bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80"
                alt="Tabletop celebration decor and planning stationery"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Showcase Item 2: Milestones & Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border border-stoneborder shadow-card bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=80"
                alt="Evening reception ambiance with candles and string lights"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-sage-800">
              <Clock className="w-4 h-4" />
              <span>Phased Milestone Timeline</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
              A serene timeline that breathes with your schedule.
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Never wonder what comes next. Deliverables are organized from months out down to the day of the celebration, giving you high-priority alerts without unnecessary noise.
            </p>
            <ul className="space-y-2.5 text-sm text-charcoal pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-700" />
                <span>Sequenced phases from foundation to post-event settlements</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-700" />
                <span>Mark items completed with one tap</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sage-700" />
                <span>Add bespoke custom deliverables anytime</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Showcase Item 3: Curated Concepts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-sage-800">
              <Sparkles className="w-4 h-4" />
              <span>Aesthetic & Culinary Ideas</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
              Inspiration tailored to your palette and budget.
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Explore bespoke themes, floral entrance concepts, artisanal live food counters, and entertainment ideas suited to your guest count. Turn any suggestion directly into a task on your timeline.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleOpenDemo('demo-wedding-1')}
              >
                Browse Curated Ideas
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-stoneborder shadow-card bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=80"
                alt="Bespoke floral styling and delicate tabletop details"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tasteful Final CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-stoneborder p-10 sm:p-16 text-center shadow-subtle space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <p className="text-xs uppercase tracking-wider text-sage-800 font-semibold">
              Begin Today
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
              Ready to bring your celebration to life?
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Generate a personalized blueprint with INR budget breakdowns, tasks, and vendor checklists in moments.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/create')}
              className="px-8"
            >
              Plan Your Celebration
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
