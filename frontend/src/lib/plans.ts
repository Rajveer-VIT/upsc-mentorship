// Single source of truth for mentorship plans on the frontend.
// Prices MUST match backend Application/Common/PlanCatalog.cs (the backend is authoritative for charging).
export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  desc: string;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'prelims-blueprint',
    name: 'Prelims Blueprint',
    price: 299,
    duration: 'one-time',
    desc: 'Build a strong foundation. Stop guessing where to start.',
    features: [
      '12-month study roadmap',
      'Subject-wise booklist',
      'PYQ analysis framework',
      'Revision tracker system',
      'Daily & weekly planner',
      'What to skip — clearly listed',
    ]
  },
  {
    id: 'mains-blueprint',
    name: 'Mains Mastery Blueprint',
    price: 499,
    duration: 'one-time',
    desc: 'Learn the art of writing marks-winning answers.',
    features: [
      'GS Paper strategy (GS1–GS4)',
      'Essay writing framework',
      'Answer writing structure',
      'Value addition techniques',
      'Mains revision system',
      'Common mistakes to avoid',
    ]
  },
  {
    id: 'current-affairs',
    name: 'Current Affairs Decoded',
    price: 399,
    duration: 'monthly',
    desc: 'Stop reading everything. Study only what matters.',
    features: [
      'Weekly current affairs — filtered',
      'Prelims + Mains integration',
      'Editorial simplification',
      'Important schemes & reports',
      'Monthly revision magazine',
      'What\'s irrelevant — clearly flagged',
    ]
  },
  {
    id: 'sociology-circle',
    name: 'Sociology Mentorship Circle',
    price: 2999,
    duration: 'monthly',
    desc: 'Sociology feels like memorising a dictionary — until you understand the patterns. This circle changes everything.',
    features: [
      'Sociology answer writing guidance',
      'Weekly mentorship call',
      'Thinker–theory–example framework',
      'PYQ Sociology trend discussions',
      'Paper 1 & Paper 2 strategy',
      'Current affairs to Sociology linking',
      'Monthly progress check',
      'WhatsApp doubt support Mon–Sat',
      'Answer review — 2 per week',
      'Group discussion sessions',
    ]
  },
  {
    id: 'personal-mentorship',
    popular: true,
    name: 'Personal UPSC Mentorship',
    price: 4999,
    duration: 'monthly',
    desc: 'Structured, personal, honest. Built around your schedule, your stage, your weaknesses.',
    features: [
      '2 x 1-on-1 calls per month (45 min each)',
      'Personalised monthly roadmap',
      'Weekly targets & accountability',
      'WhatsApp support Mon–Sat',
      'Monthly review & progress report',
      'Daily Activity Tracker',
      'PYQ discussion & mock analysis',
      'Current affairs direction',
      'Honest feedback — no sugarcoating',
    ]
  },
  {
    id: 'intensive-mentorship',
    name: 'Intensive UPSC Mentorship',
    price: 9999,
    duration: 'monthly',
    desc: 'For the all-in aspirant. Weekly calls, daily accountability, priority everything. Only 3 seats ever.',
    features: [
      '4 x weekly 1-on-1 calls (45 min each)',
      'Daily accountability check-in',
      'Priority WhatsApp — response within 2 hrs',
      'Customised system — built only for you',
      'Weekly progress report',
      'Full Prelims + Mains roadmap',
      'Answer writing & essay direction',
      'Mock test analysis every week',
      'Exam day strategy session',
    ]
  }
];

export const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;
