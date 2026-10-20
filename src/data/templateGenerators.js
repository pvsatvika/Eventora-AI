/**
 * Dynamic Event Plan Generator for Eventora AI
 * Synthesizes tailored budget categories, chronological timelines, vendor checklists,
 * and creative concepts based on user parameters.
 */

export const generateEventPlan = ({
  name,
  type = 'wedding',
  date,
  location = 'India',
  totalBudget = 500000,
  expectedGuests = 100,
  theme = 'Modern Elegant',
  specialRequirements = '',
}) => {
  const budgetNum = Math.max(10000, Number(totalBudget) || 500000);
  const guestsNum = Math.max(5, Number(expectedGuests) || 100);
  const eventDate = date || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDt = new Date(eventDate);
  eventDt.setHours(0, 0, 0, 0);
  const daysUntil = Math.max(0, Math.ceil((eventDt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Helper for generating safe relative dates that never precede today
  const getDaysBefore = (days, fallbackOffset = 1) => {
    if (days >= daysUntil) {
      const target = new Date(today);
      const safeOffset = Math.min(fallbackOffset, Math.max(1, daysUntil));
      target.setDate(today.getDate() + safeOffset);
      if (target > eventDt) return eventDt.toISOString().split('T')[0];
      return target.toISOString().split('T')[0];
    }
    const d = new Date(eventDt);
    d.setDate(eventDt.getDate() - days);
    if (d < today) return today.toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  };

  let budgetCategories = [];
  let timelineTasks = [];
  let vendors = [];
  let aiIdeas = [];

  if (type === 'wedding') {
    budgetCategories = [
      { id: 'cat-venue', name: 'Venue & Accommodation', percentage: 35, allocated: Math.round(budgetNum * 0.35), color: '#526B57' },
      { id: 'cat-catering', name: 'Catering & Banquets', percentage: 25, allocated: Math.round(budgetNum * 0.25), color: '#748C78' },
      { id: 'cat-decor', name: 'Floral, Mandap & Styling', percentage: 15, allocated: Math.round(budgetNum * 0.15), color: '#CB8C82' },
      { id: 'cat-photo', name: 'Photography & Cinematography', percentage: 10, allocated: Math.round(budgetNum * 0.10), color: '#90A893' },
      { id: 'cat-music', name: 'Music, Sangeet & Sound', percentage: 6, allocated: Math.round(budgetNum * 0.06), color: '#607664' },
      { id: 'cat-attire', name: 'Attire & Makeup Artistry', percentage: 5, allocated: Math.round(budgetNum * 0.05), color: '#B56E63' },
      { id: 'cat-misc', name: 'Contingency & Logistics', percentage: 4, allocated: Math.round(budgetNum * 0.04), color: '#69716B' },
    ];

    timelineTasks = [
      { id: 't-1', title: 'Lock Wedding & Reception Venue', phase: '3-6 Months Before', category: 'Venue', dueDate: getDaysBefore(120), priority: 'high', completed: true, notes: `Capacity confirmed for ${guestsNum} guests in ${location}.` },
      { id: 't-2', title: 'Finalize Master Caterer & Menu Tasting', phase: '3-6 Months Before', category: 'Catering', dueDate: getDaysBefore(90), priority: 'high', completed: true, notes: 'Include welcome drinks, live counters & regional sweets.' },
      { id: 't-3', title: 'Book Candid Photographer & Drone Crew', phase: '3-6 Months Before', category: 'Photography', dueDate: getDaysBefore(75), priority: 'high', completed: false, notes: 'Pre-wedding shoot date to be scheduled.' },
      { id: 't-4', title: 'Design & Dispatch Digital + Physical Invitations', phase: '1-2 Months Before', category: 'Invitations', dueDate: getDaysBefore(45), priority: 'medium', completed: false, notes: 'Track RSVP count online.' },
      { id: 't-5', title: 'Finalize Decor Moodboard & Floral Layout', phase: '1-2 Months Before', category: 'Decor', dueDate: getDaysBefore(30), priority: 'high', completed: false, notes: `Theme: ${theme}. Check stage lighting & mandap floral work.` },
      { id: 't-6', title: 'Book Sangeet Choreographer & DJ Sound Rig', phase: '1-2 Months Before', category: 'Entertainment', dueDate: getDaysBefore(25), priority: 'medium', completed: false, notes: 'Prepare 10 family performance tracks.' },
      { id: 't-7', title: 'Bridal & Groom Outfit Final Trials', phase: '1-2 Weeks Before', category: 'Attire', dueDate: getDaysBefore(14), priority: 'high', completed: false, notes: 'Complete alterations and steam-pressing.' },
      { id: 't-8', title: 'Final Guest Count Confirmation to Caterer', phase: '1-2 Weeks Before', category: 'Catering', dueDate: getDaysBefore(7), priority: 'high', completed: false, notes: `Buffer +10% over ${guestsNum} confirmed guests.` },
      { id: 't-9', title: 'Day-of Event Welcome & Ritual Coordination', phase: 'Day of Event', category: 'Logistics', dueDate: eventDate, priority: 'high', completed: false, notes: 'Appoint stage manager and logistics head.' },
    ];

    vendors = [
      { id: 'v-1', name: 'Royal Heritage Palace & Lawns', category: 'Venue & Hospitality', status: 'Booked', contactPerson: 'Vikram Rathore', phone: '+91 98290 12345', email: 'banquets@royalpalace.in', estimatedCost: Math.round(budgetNum * 0.35), depositPaid: Math.round(budgetNum * 0.15), notes: `Includes ballroom, lawn & 15 guest suites for ${guestsNum} guests.` },
      { id: 'v-2', name: 'Zaika Royal Caterers', category: 'Catering & Banquet', status: 'Booked', contactPerson: 'Chef Sanjeev Kumar', phone: '+91 98111 67890', email: 'events@zaikacaterers.com', estimatedCost: Math.round(budgetNum * 0.25), depositPaid: Math.round(budgetNum * 0.08), notes: 'Multi-cuisine buffet + chaat counter + dessert station.' },
      { id: 'v-3', name: 'Aura Lens Cinematics', category: 'Photography & Cinematography', status: 'Deposit Paid', contactPerson: 'Neha Sharma', phone: '+91 98765 43210', email: 'hello@auralens.in', estimatedCost: Math.round(budgetNum * 0.10), depositPaid: Math.round(budgetNum * 0.03), notes: '2 Candid photographers, 1 drone operator, teaser reel + 4K album.' },
      { id: 'v-4', name: 'Gulmohar Flora & Decorators', category: 'Floral & Decor Styling', status: 'Contacted', contactPerson: 'Kunal Deshmukh', phone: '+91 97654 32109', email: 'kunal@gulmohardecor.com', estimatedCost: Math.round(budgetNum * 0.15), depositPaid: 0, notes: `Custom stage backdrop fitting the "${theme}" aesthetic.` },
      { id: 'v-5', name: 'SoundVibe DJ & Live Dhol Troupe', category: 'Music, Sound & DJ', status: 'Researching', contactPerson: 'DJ Sunny', phone: '+91 99887 76655', email: 'booking@soundvibes.com', estimatedCost: Math.round(budgetNum * 0.06), depositPaid: 0, notes: 'Sangeet night console, line arrays, LED wall & Dhol artists.' },
      { id: 'v-6', name: 'Glamour Touch Bridal Studio', category: 'Attire & Makeup', status: 'Not Started', contactPerson: 'Pooja M.', phone: '+91 91234 56789', email: 'pooja@glamourtouch.in', estimatedCost: Math.round(budgetNum * 0.05), depositPaid: 0, notes: 'Bridal HD makeup + family grooming packages.' },
    ];

    aiIdeas = [
      {
        id: 'idea-1',
        type: 'theme',
        title: 'Regal Twilight & Marigold Symphony',
        tag: 'Theme & Aesthetic',
        description: `A blend of deep forest sage and warm marigold hues matching your theme "${theme}". Embellished with brass lanterns, floating lotus candles, and warm ambient lighting.`,
        costImpact: 'Moderate',
        favorite: true,
      },
      {
        id: 'idea-2',
        type: 'decor',
        title: 'Cascading Jasmine Canopy & Mirror Installation',
        tag: 'Decor & Styling',
        description: 'An elegant photo setting with fragrant Mogra strings, antique framed brass mirrors, and understated warm lighting.',
        costImpact: 'Budget-friendly',
        favorite: false,
      },
      {
        id: 'idea-3',
        type: 'food',
        title: 'Live Fusion Chaat Bar & Rabdi Jalebi Station',
        tag: 'Food & Menu',
        description: `Curated for ${guestsNum} guests with artisanal truffle kulchas, avocado sev puri, botanical mocktails, and fresh churned saffron Rabdi.`,
        costImpact: 'Moderate',
        favorite: true,
      },
      {
        id: 'idea-4',
        type: 'entertainment',
        title: 'Acoustic Sangeet Prelude & Couple Trivia',
        tag: 'Entertainment & Fun',
        description: 'Engage guests with an intimate smartphone QR code quiz about the couple, followed by an energetic live folk and acoustic set.',
        costImpact: 'Budget-friendly',
        favorite: false,
      },
    ];
  } else if (type === 'birthday') {
    budgetCategories = [
      { id: 'cat-venue', name: 'Venue & Private Dining', percentage: 30, allocated: Math.round(budgetNum * 0.30), color: '#526B57' },
      { id: 'cat-catering', name: 'Curated Dinner & Designer Cake', percentage: 35, allocated: Math.round(budgetNum * 0.35), color: '#748C78' },
      { id: 'cat-decor', name: 'Floral Tabletop & Lighting', percentage: 15, allocated: Math.round(budgetNum * 0.15), color: '#CB8C82' },
      { id: 'cat-music', name: 'Acoustic Trio & DJ Playlist', percentage: 10, allocated: Math.round(budgetNum * 0.10), color: '#607664' },
      { id: 'cat-photo', name: 'Photography & Polaroid Prints', percentage: 6, allocated: Math.round(budgetNum * 0.06), color: '#90A893' },
      { id: 'cat-favors', name: 'Bespoke Favors & Contingency', percentage: 4, allocated: Math.round(budgetNum * 0.04), color: '#69716B' },
    ];

    timelineTasks = [
      { id: 't-1', title: 'Book Terrace Lounge / Private Dining Room', phase: '1-2 Months Before', category: 'Venue', dueDate: getDaysBefore(40), priority: 'high', completed: true, notes: `Reserved for ${guestsNum} guests in ${location}.` },
      { id: 't-2', title: 'Order Custom Designer Cake', phase: '1-2 Months Before', category: 'Catering', dueDate: getDaysBefore(20), priority: 'high', completed: false, notes: 'Flavor: Belgian dark chocolate ganache with botanical floral styling.' },
      { id: 't-3', title: 'Confirm Florist & Tabletop Decorator', phase: '1-2 Weeks Before', category: 'Decor', dueDate: getDaysBefore(14), priority: 'medium', completed: false, notes: `Theme: ${theme}. Minimalist linen runners and candlelight.` },
      { id: 't-4', title: 'Curate Evening Playlist & Acoustic Set', phase: '1-2 Weeks Before', category: 'Entertainment', dueDate: getDaysBefore(10), priority: 'medium', completed: false, notes: 'Acoustic jazz set followed by relaxed upbeat lounge tracks.' },
      { id: 't-5', title: 'Assemble Personalized Guest Favors', phase: '1-2 Weeks Before', category: 'Favors', dueDate: getDaysBefore(5), priority: 'low', completed: false, notes: `Pack ${guestsNum} artisanal gift parcels with handwritten thank you cards.` },
      { id: 't-6', title: 'On-Site Sound Check & Cake Table Setup', phase: 'Day of Event', category: 'Logistics', dueDate: eventDate, priority: 'high', completed: false, notes: 'Arrive 1.5 hours prior to guest arrival.' },
    ];

    vendors = [
      { id: 'v-1', name: 'Skyline Terrace & Dining', category: 'Venue & Hospitality', status: 'Booked', contactPerson: 'Arun Verma', phone: '+91 98450 99887', email: 'events@skylineterrace.in', estimatedCost: Math.round(budgetNum * 0.30), depositPaid: Math.round(budgetNum * 0.10), notes: 'Private rooftop deck with sound license until midnight.' },
      { id: 'v-2', name: 'Sweet Temptations Artisan Bakery', category: 'Catering & Banquet', status: 'Booked', contactPerson: 'Shalini Gupta', phone: '+91 97312 45678', email: 'order@sweettemptations.com', estimatedCost: Math.round(budgetNum * 0.12), depositPaid: Math.round(budgetNum * 0.05), notes: '2-tier handcrafted designer cake + miniature dessert shooters.' },
      { id: 'v-3', name: 'Botanica Floral & Styling Studio', category: 'Floral & Decor Styling', status: 'Deposit Paid', contactPerson: 'Dev Sen', phone: '+91 98200 11223', email: 'hello@botanicastudio.in', estimatedCost: Math.round(budgetNum * 0.15), depositPaid: Math.round(budgetNum * 0.05), notes: 'Understated eucalyptus table runners, tea lights & linen accents.' },
      { id: 'v-4', name: 'Acoustic Trio & DJ Sunny', category: 'Music, Sound & DJ', status: 'Contacted', contactPerson: 'Rakesh', phone: '+91 99100 44556', email: 'rocky@soundbeats.in', estimatedCost: Math.round(budgetNum * 0.10), depositPaid: 0, notes: 'Warm acoustic dinner set and evening lounge playlist.' },
      { id: 'v-5', name: 'SnapMagic Instant Photobooth', category: 'Photography & Cinematography', status: 'Researching', contactPerson: 'Tanvi', phone: '+91 98711 22334', email: 'tanvi@snapmagic.in', estimatedCost: Math.round(budgetNum * 0.06), depositPaid: 0, notes: 'Unlimited polaroid-style instant prints with customized linen frames.' },
    ];

    aiIdeas = [
      {
        id: 'idea-1',
        type: 'theme',
        title: 'Speakeasy Jazz & Warm Amber Glow',
        tag: 'Theme & Aesthetic',
        description: `Intimate candlelit ambiance reflecting "${theme}". Vintage glassware, warm brass accents, and acoustic vinyl playlists.`,
        costImpact: 'Moderate',
        favorite: true,
      },
      {
        id: 'idea-2',
        type: 'decor',
        title: 'Botanical Table Runners & Floating Tea Lights',
        tag: 'Decor & Styling',
        description: 'Eucalyptus and olive branch foliage draped over raw linen runners with delicate ribbed glass votives.',
        costImpact: 'Budget-friendly',
        favorite: false,
      },
      {
        id: 'idea-3',
        type: 'food',
        title: 'Woodfired Small Plates & Artisanal Spritz Bar',
        tag: 'Food & Menu',
        description: `Bespoke dining for ${guestsNum} guests: sourdough flatbreads, smoked burrata bowls, botanical mocktails, and fresh fruit tarts.`,
        costImpact: 'Budget-friendly',
        favorite: true,
      },
      {
        id: 'idea-4',
        type: 'entertainment',
        title: 'Live Caricaturist & Polaroid Guestbook',
        tag: 'Entertainment & Fun',
        description: 'A discreet artist sketching charming guest portraits, alongside an instant camera guestbook with handwritten wishes.',
        costImpact: 'Moderate',
        favorite: false,
      },
    ];
  } else {
    // Community Event
    budgetCategories = [
      { id: 'cat-venue', name: 'Permits, Grounds & Staging', percentage: 25, allocated: Math.round(budgetNum * 0.25), color: '#526B57' },
      { id: 'cat-sound', name: 'Audio Production & Lighting', percentage: 22, allocated: Math.round(budgetNum * 0.22), color: '#748C78' },
      { id: 'cat-catering', name: 'Community Refreshments & Water', percentage: 20, allocated: Math.round(budgetNum * 0.20), color: '#CB8C82' },
      { id: 'cat-marketing', name: 'Signage, Badges & Outreach', percentage: 15, allocated: Math.round(budgetNum * 0.15), color: '#90A893' },
      { id: 'cat-security', name: 'Safety, First Aid & Sanitation', percentage: 10, allocated: Math.round(budgetNum * 0.10), color: '#607664' },
      { id: 'cat-misc', name: 'Volunteers & Contingency', percentage: 8, allocated: Math.round(budgetNum * 0.08), color: '#69716B' },
    ];

    timelineTasks = [
      { id: 't-1', title: 'Submit Municipal Ground Permits & Fire NOC', phase: '3-6 Months Before', category: 'Logistics', dueDate: getDaysBefore(75), priority: 'high', completed: true, notes: `Permission for ${guestsNum} community participants in ${location}.` },
      { id: 't-2', title: 'Contract Stage Truss, Canopy & Sound Crew', phase: '1-2 Months Before', category: 'AV Production & Staging', dueDate: getDaysBefore(40), priority: 'high', completed: true, notes: 'Outdoor weather-proof sound system.' },
      { id: 't-3', title: 'Publish Community Registration & Volunteer Call', phase: '1-2 Months Before', category: 'Logistics', dueDate: getDaysBefore(30), priority: 'medium', completed: false, notes: 'Target 25 community youth volunteers.' },
      { id: 't-4', title: 'Arrange Safe Drinking Water & Mobile Restrooms', phase: '1-2 Weeks Before', category: 'Logistics', dueDate: getDaysBefore(14), priority: 'high', completed: false, notes: 'Eco-friendly water refill stations; zero single-use plastic.' },
      { id: 't-5', title: 'Install Directional Signage & Emergency Booth', phase: '1-2 Weeks Before', category: 'Logistics', dueDate: getDaysBefore(3), priority: 'high', completed: false, notes: 'First aid paramedic kit and fire extinguishers stationed.' },
      { id: 't-6', title: 'Event Kickoff & Stage Management', phase: 'Day of Event', category: 'Logistics', dueDate: eventDate, priority: 'high', completed: false, notes: 'Run schedule on 15-minute sync checks.' },
    ];

    vendors = [
      { id: 'v-1', name: 'Apex Event Staging & Trussing', category: 'AV Production & Staging', status: 'Booked', contactPerson: 'Harish Nair', phone: '+91 99001 23456', email: 'harish@apexstaging.com', estimatedCost: Math.round(budgetNum * 0.25), depositPaid: Math.round(budgetNum * 0.10), notes: '24x16 ft stage, weatherproof canopy, generator backup.' },
      { id: 'v-2', name: 'EchoSound Audio Visuals', category: 'Music, Sound & DJ', status: 'Booked', contactPerson: 'Manoj Pillai', phone: '+91 98860 11992', email: 'manoj@echosound.in', estimatedCost: Math.round(budgetNum * 0.22), depositPaid: Math.round(budgetNum * 0.08), notes: 'Line array audio, 4 wireless mics, 12x8 LED screen.' },
      { id: 'v-3', name: 'GreenEarth Waste & Sanitation Services', category: 'Logistics & Transport', status: 'Deposit Paid', contactPerson: 'Lakshmi Rao', phone: '+91 94480 55667', email: 'info@greenearthngo.org', estimatedCost: Math.round(budgetNum * 0.10), depositPaid: Math.round(budgetNum * 0.04), notes: 'Waste segregation bins, housekeeping crew of 6, composting.' },
      { id: 'v-4', name: 'Annapurna Community Caterers', category: 'Catering & Banquet', status: 'Contacted', contactPerson: 'Suresh Babu', phone: '+91 98441 33221', email: 'annapurna@caterers.org', estimatedCost: Math.round(budgetNum * 0.20), depositPaid: 0, notes: `Tea, filter coffee, healthy snack boxes for ${guestsNum} attendees.` },
    ];

    aiIdeas = [
      {
        id: 'idea-1',
        type: 'theme',
        title: 'Eco-Forward Green Neighborhood Carnival',
        tag: 'Theme & Aesthetic',
        description: `Centered on sustainability with recycled paper lanterns, natural bamboo booth frames, and earthy terracotta accents reflecting "${theme}".`,
        costImpact: 'Budget-friendly',
        favorite: true,
      },
      {
        id: 'idea-2',
        type: 'decor',
        title: 'Community Wish Tree & Upcycled Art Installations',
        tag: 'Decor & Styling',
        description: 'An interactive centerpiece tree where families tie written celebration hopes on jute ribbons, surrounded by local student recycled sculptures.',
        costImpact: 'Budget-friendly',
        favorite: false,
      },
      {
        id: 'idea-3',
        type: 'food',
        title: 'Local Artisan Farmer Stalls & Millet Food Court',
        tag: 'Food & Menu',
        description: 'Highlighting local neighborhood vendors with ragi dosa counters, organic ice-pops, and fresh sugarcane juice stations.',
        costImpact: 'Budget-friendly',
        favorite: true,
      },
      {
        id: 'idea-4',
        type: 'entertainment',
        title: 'Open Mic, Folk Arts Showcase & Rhythm Circle',
        tag: 'Entertainment & Fun',
        description: 'Foster deep community bonding with all-ages acoustic performances, neighborhood storytelling, and an energetic street rhythm circle.',
        costImpact: 'Budget-friendly',
        favorite: false,
      },
    ];
  }

  // Calculate realistic expenses based on deposits already recorded
  const initialExpenses = vendors
    .filter((v) => v.depositPaid > 0)
    .map((v, idx) => ({
      id: `exp-${idx + 1}`,
      title: `${v.category} Initial Deposit (${v.name})`,
      categoryId: budgetCategories.find((c) => c.name.toLowerCase().includes(v.category.toLowerCase().split(' ')[0]))?.id || budgetCategories[0].id,
      amount: v.depositPaid,
      paidStatus: 'paid',
      vendorName: v.name,
      date: getDaysBefore(15 + idx * 5),
      notes: `Advance receipt #${1000 + idx} for event reservation.`,
    }));

  // Ensure category allocations sum to exactly the total budget
  const sumAllocated = budgetCategories.reduce((sum, c) => sum + (c.allocated || 0), 0);
  const diffAlloc = budgetNum - sumAllocated;
  if (diffAlloc !== 0 && budgetCategories.length > 0) {
    budgetCategories[0].allocated += diffAlloc;
  }

  return {
    id: `event-${Date.now()}`,
    name,
    type,
    date: eventDate,
    location,
    totalBudget: budgetNum,
    expectedGuests: guestsNum,
    theme: theme || 'Modern Celebration',
    specialRequirements: specialRequirements || 'None specified.',
    createdAt: new Date().toISOString(),
    isGeneratedByAI: true,
    aiModelLabel: 'Eventora AI Synthesis v1.0 (Ready for Gemini API)',
    budgetCategories,
    expenses: initialExpenses,
    timelineTasks,
    vendors,
    aiIdeas,
  };
};
