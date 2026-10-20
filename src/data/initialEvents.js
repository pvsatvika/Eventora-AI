import { generateEventPlan } from './templateGenerators';
import { getFutureDateString } from '../utils/date';

export const getInitialEvents = () => {
  const wedding = generateEventPlan({
    name: "Aarav & Meera's Sangeet & Reception",
    type: 'wedding',
    date: getFutureDateString(48),
    location: 'Jaipur, Rajasthan',
    totalBudget: 1850000,
    expectedGuests: 250,
    theme: 'Royal Rajputana & Twilight Glow',
    specialRequirements: 'Pure vegetarian catering for traditional rituals, wheelchair accessibility for grandparents, and evening fireworks display permit.',
  });
  wedding.id = 'demo-wedding-1';

  const birthday = generateEventPlan({
    name: "Rohan's 30th Evening Gathering",
    type: 'birthday',
    date: getFutureDateString(21),
    location: 'Bengaluru, Karnataka',
    totalBudget: 150000,
    expectedGuests: 45,
    theme: 'Speakeasy Jazz & Warm Amber Glow',
    specialRequirements: 'Curated mixology bar with craft mocktails, Polaroid camera guestbook, and gluten-free dessert option.',
  });
  birthday.id = 'demo-birthday-1';

  const community = generateEventPlan({
    name: 'Indiranagar Spring Cultural Festival',
    type: 'community',
    date: getFutureDateString(35),
    location: 'Bengaluru, Karnataka',
    totalBudget: 400000,
    expectedGuests: 450,
    theme: 'Eco-Friendly Heritage & Folk Arts',
    specialRequirements: 'Plastic-free food zone, solar-assisted stage lighting, and child-safe interactive pottery workshops.',
  });
  community.id = 'demo-community-1';

  return [wedding, birthday, community];
};
