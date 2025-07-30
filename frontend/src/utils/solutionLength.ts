/**
 * Converts a solution string into a length pattern string.
 * 
 * Rules:
 * - Spaces become commas in the output
 * - Hyphens remain as hyphens in the output
 * - Letter sequences are converted to their length
 * - Multiple words are wrapped in parentheses
 * 
 * Examples:
 * - "dog-gone" -> "3-4"
 * - "hello world" -> "(5,5)"
 * - "my gee-golly" -> "(2,3-4)"
 * - "cat" -> "3"
 * 
 * @param solution The solution string containing letters, spaces, and hyphens
 * @returns The length pattern string
 */
export function getSolutionLengthPattern(solution: string): string {
  if (!solution) return '';
  
  // Split by spaces to get words
  const words = solution.split(' ');
  
  // Convert each word to its length pattern
  const wordPatterns = words.map(word => {
    if (!word) return '';
    
    // Split by hyphens and get length of each part
    const parts = word.split('-');
    const partLengths = parts.map(part => part.length.toString());
    
    // Join with hyphens
    return partLengths.join('-');
  });
  
  // Filter out empty patterns
  const validPatterns = wordPatterns.filter(pattern => pattern !== '');

  // Multiple words - wrap in parentheses and join with commas
  return `(${validPatterns.join(',')})`;
}