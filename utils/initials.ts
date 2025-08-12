/**
 * Generates initials from a person's name
 * @param name - The full name of the person
 * @returns The initials (e.g., "EV" for "Eleanor Vance")
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') {
    return '?';
  }
  
  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single name - return first two characters
    return name.substring(0, 2).toUpperCase();
  }
  
  // Multiple words - return first letter of each word
  return words
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2); // Limit to 2 characters
}

/**
 * Generates a consistent color based on the name
 * @param name - The name to generate a color for
 * @returns A CSS color string
 */
export function getNameColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ];
  
  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
