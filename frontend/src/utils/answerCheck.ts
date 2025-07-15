/**
 * Compares user input with the correct solution, ignoring spaces and hyphens
 * @param userInput - Array of user input characters
 * @param solution - The correct solution string
 * @returns boolean indicating if the answers match
 */
export const checkAnswer = (userInput: string[], solution: string): boolean => {
  // Extract only the letter characters from user input
  const userLetters = userInput.filter(char => char && char !== ' ' && char !== '-');
  
  // Extract only the letter characters from solution
  const solutionLetters = solution.split('').filter(char => char !== ' ' && char !== '-');
  
  // Compare the letter arrays
  if (userLetters.length !== solutionLetters.length) {
    return false;
  }
  
  return userLetters.every((char, index) => 
    char.toLowerCase() === solutionLetters[index].toLowerCase()
  );
};

/**
 * Normalizes a string by removing spaces and hyphens and converting to lowercase
 * @param str - The string to normalize
 * @returns The normalized string
 */
export const normalizeString = (str: string): string => {
  return str.replace(/[\s-]/g, '').toLowerCase();
};

/**
 * Checks if the user has filled in all the required letter positions
 * @param userInput - Array of user input characters
 * @param solution - The correct solution string
 * @returns boolean indicating if all letter positions are filled
 */
export const isAnswerComplete = (userInput: string[], solution: string): boolean => {
  let letterCount = 0;
  let filledCount = 0;
  
  solution.split('').forEach((char, index) => {
    if (char !== ' ' && char !== '-') {
      letterCount++;
      if (userInput[index] && userInput[index].trim() !== '') {
        filledCount++;
      }
    }
  });
  
  return letterCount === filledCount;
};