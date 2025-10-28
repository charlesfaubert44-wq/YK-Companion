/**
 * Array and collection utilities for YK Buddy
 * Provides helper functions for sorting, filtering, and manipulating arrays
 */

/**
 * Sort an array of objects by a property value
 * @param array - Array to sort
 * @param key - Property key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array (does not mutate original)
 * @example
 * sortByProperty(sales, 'sale_date', 'asc') // Earliest dates first
 * sortByProperty(users, 'created_at', 'desc') // Newest first
 */
export function sortByProperty<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort array of objects by multiple properties
 * @param array - Array to sort
 * @param sortConfig - Array of sort configurations
 * @returns Sorted array
 * @example
 * sortByMultiple(sales, [
 *   { key: 'sale_date', order: 'asc' },
 *   { key: 'start_time', order: 'asc' }
 * ]) // Sort by date, then by time
 */
export function sortByMultiple<T>(
  array: T[],
  sortConfig: Array<{ key: keyof T; order: 'asc' | 'desc' }>
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, order } of sortConfig) {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal !== bVal) {
        const comparison = aVal < bVal ? -1 : 1;
        return order === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}

/**
 * Remove duplicate objects from array based on a unique key
 * @param array - Array to deduplicate
 * @param key - Property key that should be unique
 * @returns Array with duplicates removed (keeps first occurrence)
 * @example
 * uniqueBy(sales, 'id') // Remove duplicate sales by ID
 * uniqueBy(users, 'email') // Remove duplicate users by email
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Chunk an array into smaller arrays of specified size
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of arrays
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * chunk(sales, 10) // Break sales into pages of 10
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle an array randomly
 * @param array - Array to shuffle
 * @returns Shuffled array (does not mutate original)
 * @example
 * shuffle(featuredActivities) // Randomize featured activities
 * shuffle(testimonials) // Random order of testimonials
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random items from an array
 * @param array - Array to sample from
 * @param count - Number of random items to get
 * @returns Array of random items (without duplicates)
 * @example
 * getRandomItems(allActivities, 3) // Get 3 random activities
 * getRandomItems(sponsors, 5) // Get 5 random sponsors to feature
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Find items that exist in first array but not in second
 * @param array1 - First array
 * @param array2 - Second array
 * @param key - Optional key to compare objects by
 * @returns Items unique to first array
 * @example
 * difference([1, 2, 3], [2, 3, 4]) // [1]
 * difference(savedSales, allSales, 'id') // Find saved sales that no longer exist
 */
export function difference<T>(array1: T[], array2: T[], key?: keyof T): T[] {
  if (!key) {
    return array1.filter((item) => !array2.includes(item));
  }

  const set2 = new Set(array2.map((item) => item[key]));
  return array1.filter((item) => !set2.has(item[key]));
}

/**
 * Find items that exist in both arrays
 * @param array1 - First array
 * @param array2 - Second array
 * @param key - Optional key to compare objects by
 * @returns Items common to both arrays
 * @example
 * intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 * intersection(userInterests, availableActivities, 'id') // Matching activities
 */
export function intersection<T>(array1: T[], array2: T[], key?: keyof T): T[] {
  if (!key) {
    return array1.filter((item) => array2.includes(item));
  }

  const set2 = new Set(array2.map((item) => item[key]));
  return array1.filter((item) => set2.has(item[key]));
}

/**
 * Partition array into two arrays based on a predicate function
 * @param array - Array to partition
 * @param predicate - Function that returns true/false for each item
 * @returns Tuple with [matching items, non-matching items]
 * @example
 * const [active, inactive] = partition(sales, s => s.status === 'active');
 * const [today, future] = partition(events, e => isToday(e.date));
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const matching: T[] = [];
  const nonMatching: T[] = [];

  array.forEach((item) => {
    if (predicate(item)) {
      matching.push(item);
    } else {
      nonMatching.push(item);
    }
  });

  return [matching, nonMatching];
}

/**
 * Count occurrences of each unique value in an array
 * @param array - Array to count
 * @param key - Optional key for object arrays
 * @returns Object with value counts
 * @example
 * countOccurrences(['red', 'blue', 'red', 'green']) // { red: 2, blue: 1, green: 1 }
 * countOccurrences(sales, 'status') // { active: 10, completed: 5 }
 */
export function countOccurrences<T>(array: T[], key?: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};

  array.forEach((item) => {
    const value = key ? String(item[key]) : String(item);
    counts[value] = (counts[value] || 0) + 1;
  });

  return counts;
}

/**
 * Find the most common value in an array
 * @param array - Array to analyze
 * @param key - Optional key for object arrays
 * @returns Most common value or null if array is empty
 * @example
 * mostCommon(['red', 'blue', 'red', 'green']) // 'red'
 * mostCommon(sales, 'status') // 'active'
 */
export function mostCommon<T>(array: T[], key?: keyof T): T | string | null {
  if (array.length === 0) return null;

  const counts = countOccurrences(array, key);
  const maxCount = Math.max(...Object.values(counts));
  const mostCommonValue = Object.keys(counts).find((k) => counts[k] === maxCount);

  return mostCommonValue || null;
}

/**
 * Calculate average of numeric property in array of objects
 * @param array - Array of objects
 * @param key - Property key with numeric values
 * @returns Average value or 0 if array is empty
 * @example
 * average(sales, 'price') // 125.50
 * average(reviews, 'rating') // 4.3
 */
export function average<T>(array: T[], key: keyof T): number {
  if (array.length === 0) return 0;

  const sum = array.reduce((acc, item) => {
    const value = item[key];
    return acc + (typeof value === 'number' ? value : 0);
  }, 0);

  return sum / array.length;
}

/**
 * Get sum of numeric property in array of objects
 * @param array - Array of objects
 * @param key - Property key with numeric values
 * @returns Sum of values
 * @example
 * sum(cartItems, 'price') // 456.78
 * sum(activities, 'duration') // 720 (minutes)
 */
export function sum<T>(array: T[], key: keyof T): number {
  return array.reduce((acc, item) => {
    const value = item[key];
    return acc + (typeof value === 'number' ? value : 0);
  }, 0);
}

/**
 * Group array into pages for pagination
 * @param array - Array to paginate
 * @param page - Page number (0-indexed)
 * @param pageSize - Items per page
 * @returns Object with paginated items and pagination info
 * @example
 * const result = paginate(sales, 0, 10);
 * // { items: [...], page: 0, pageSize: 10, totalPages: 5, totalItems: 47 }
 */
export function paginate<T>(
  array: T[],
  page: number,
  pageSize: number
): {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const items = array.slice(startIndex, endIndex);

  return {
    items,
    page,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage: page < totalPages - 1,
    hasPreviousPage: page > 0,
  };
}

/**
 * Move an item in an array from one position to another
 * Useful for drag-and-drop reordering
 * @param array - Array to reorder
 * @param fromIndex - Current index
 * @param toIndex - Target index
 * @returns Reordered array (does not mutate original)
 * @example
 * moveItem(itineraryItems, 0, 2) // Move first item to third position
 */
export function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Filter array by multiple search terms (OR logic)
 * @param array - Array to filter
 * @param searchTerms - Array of search terms
 * @param keys - Object keys to search in
 * @returns Filtered array
 * @example
 * filterBySearch(sales, ['furniture', 'tools'], ['title', 'description', 'items_description'])
 * // Returns sales that mention furniture OR tools in any of those fields
 */
export function filterBySearch<T>(
  array: T[],
  searchTerms: string[],
  keys: (keyof T)[]
): T[] {
  if (searchTerms.length === 0) return array;

  const lowerTerms = searchTerms.map((term) => term.toLowerCase());

  return array.filter((item) => {
    return lowerTerms.some((term) => {
      return keys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (Array.isArray(value)) {
          return value.some((v) => String(v).toLowerCase().includes(term));
        }
        return false;
      });
    });
  });
}
