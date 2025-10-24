// NWT Public Holidays and Special Dates
// Reference: https://www.gov.nt.ca/en/services/employment-and-labour/public-holidays

export interface Holiday {
  id: string;
  name: string;
  date: string; // Format: "MM-DD" for fixed dates, or function for variable dates
  type: 'statutory' | 'cultural' | 'special';
  description: string;
  bannerTheme?: 'halloween' | 'remembrance' | 'christmas' | 'newyear' | 'easter' | 'canada' | 'indigenous';
  twoWeekWarning?: boolean; // Show special banner 2 weeks before
}

export const NWT_HOLIDAYS: Holiday[] = [
  // Fixed Statutory Holidays
  {
    id: 'new-year',
    name: "New Year's Day",
    date: '01-01',
    type: 'statutory',
    description: 'Start of the new year',
    bannerTheme: 'newyear',
    twoWeekWarning: true,
  },
  {
    id: 'family-day',
    name: 'Family Day',
    date: '02-third-monday', // Third Monday in February
    type: 'statutory',
    description: 'Family Day (third Monday in February)',
  },
  {
    id: 'good-friday',
    name: 'Good Friday',
    date: 'easter-minus-2', // 2 days before Easter
    type: 'statutory',
    description: 'Good Friday',
    bannerTheme: 'easter',
  },
  {
    id: 'victoria-day',
    name: 'Victoria Day',
    date: '05-monday-before-25', // Monday before May 25
    type: 'statutory',
    description: 'Victoria Day',
  },
  {
    id: 'national-indigenous-day',
    name: 'National Indigenous Peoples Day',
    date: '06-21',
    type: 'statutory',
    description: 'Celebrating Indigenous cultures and heritage',
    bannerTheme: 'indigenous',
    twoWeekWarning: true,
  },
  {
    id: 'canada-day',
    name: 'Canada Day',
    date: '07-01',
    type: 'statutory',
    description: 'Canadian national holiday',
    bannerTheme: 'canada',
    twoWeekWarning: true,
  },
  {
    id: 'labour-day',
    name: 'Labour Day',
    date: '09-first-monday', // First Monday in September
    type: 'statutory',
    description: 'Labour Day (first Monday in September)',
  },
  {
    id: 'truth-reconciliation',
    name: 'National Day for Truth and Reconciliation',
    date: '09-30',
    type: 'statutory',
    description: 'Day of reflection and remembrance',
    bannerTheme: 'indigenous',
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving Day',
    date: '10-second-monday', // Second Monday in October
    type: 'statutory',
    description: 'Thanksgiving Day (second Monday in October)',
  },
  {
    id: 'halloween',
    name: 'Halloween',
    date: '10-31',
    type: 'cultural',
    description: 'Halloween celebrations',
    bannerTheme: 'halloween',
    twoWeekWarning: true,
  },
  {
    id: 'remembrance-day',
    name: 'Remembrance Day',
    date: '11-11',
    type: 'statutory',
    description: 'Honouring those who served',
    bannerTheme: 'remembrance',
    twoWeekWarning: true,
  },
  {
    id: 'christmas',
    name: 'Christmas Day',
    date: '12-25',
    type: 'statutory',
    description: 'Christmas celebrations',
    bannerTheme: 'christmas',
    twoWeekWarning: true,
  },
  {
    id: 'boxing-day',
    name: 'Boxing Day',
    date: '12-26',
    type: 'statutory',
    description: 'Boxing Day',
  },
];

// Helper function to get date for variable holidays
export function getHolidayDate(year: number, datePattern: string): Date | null {
  // Handle fixed dates (MM-DD format)
  if (/^\d{2}-\d{2}$/.test(datePattern)) {
    const [month, day] = datePattern.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Handle variable dates
  if (datePattern === '02-third-monday') {
    // Third Monday in February
    const firstDay = new Date(year, 1, 1); // Feb 1
    const firstMonday = 1 + ((8 - firstDay.getDay()) % 7);
    return new Date(year, 1, firstMonday + 14); // Third Monday
  }

  if (datePattern === '05-monday-before-25') {
    // Monday before May 25
    const may25 = new Date(year, 4, 25);
    const dayOfWeek = may25.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return new Date(year, 4, 25 - daysToSubtract);
  }

  if (datePattern === '09-first-monday') {
    // First Monday in September
    const firstDay = new Date(year, 8, 1);
    const firstMonday = 1 + ((8 - firstDay.getDay()) % 7);
    return new Date(year, 8, firstMonday);
  }

  if (datePattern === '10-second-monday') {
    // Second Monday in October
    const firstDay = new Date(year, 9, 1);
    const firstMonday = 1 + ((8 - firstDay.getDay()) % 7);
    return new Date(year, 9, firstMonday + 7);
  }

  // Easter calculation (simplified - you may want to use a library for accuracy)
  if (datePattern.startsWith('easter')) {
    const easterDate = calculateEaster(year);
    if (datePattern === 'easter-minus-2') {
      easterDate.setDate(easterDate.getDate() - 2); // Good Friday
    }
    return easterDate;
  }

  return null;
}

// Simplified Easter calculation (Meeus/Jones/Butcher algorithm)
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Get upcoming holiday within X days
export function getUpcomingHoliday(daysAhead: number = 14): Holiday | null {
  const today = new Date();
  const currentYear = today.getFullYear();

  for (const holiday of NWT_HOLIDAYS) {
    if (!holiday.twoWeekWarning) continue;

    const holidayDate = getHolidayDate(currentYear, holiday.date);
    if (!holidayDate) continue;

    const daysUntil = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Check if holiday is within the specified days ahead
    if (daysUntil >= 0 && daysUntil <= daysAhead) {
      return holiday;
    }
  }

  // Check next year's holidays if near end of year
  if (today.getMonth() === 11) { // December
    for (const holiday of NWT_HOLIDAYS) {
      if (!holiday.twoWeekWarning) continue;

      const holidayDate = getHolidayDate(currentYear + 1, holiday.date);
      if (!holidayDate) continue;

      const daysUntil = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil >= 0 && daysUntil <= daysAhead) {
        return holiday;
      }
    }
  }

  return null;
}

// Get current active holiday theme
export function getCurrentHolidayTheme(): Holiday['bannerTheme'] | null {
  const upcomingHoliday = getUpcomingHoliday(14); // 2 weeks ahead
  return upcomingHoliday?.bannerTheme || null;
}
