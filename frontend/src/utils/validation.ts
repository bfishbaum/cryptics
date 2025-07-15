export const validateSolution = (solution: string): boolean => {
  // Check if solution contains only lowercase letters, hyphens, and spaces
  const validChars = /^[a-z\s-]+$/.test(solution);
  if (!validChars) return false;
  
  // Check that hyphens and spaces are only between letters
  const chars = solution.split('');
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (char === '-' || char === ' ') {
      // Check that there's a letter before and after
      if (i === 0 || i === chars.length - 1) return false;
      if (!/[a-z]/.test(chars[i - 1]) || !/[a-z]/.test(chars[i + 1])) return false;
    }
  }
  
  return true;
};