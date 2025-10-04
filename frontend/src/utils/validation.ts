export const validateSolution = (solution: string): boolean => {
  const validChars = /^[A-Za-z\s-]+$/.test(solution);
  if (!validChars) return false;

  const chars = solution.toLowerCase().split('');
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