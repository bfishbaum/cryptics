/**
 * Sanitization utilities to prevent XSS attacks
 */

/**
 * Sanitizes user input by removing/escaping HTML and potentially dangerous characters
 * This provides defense-in-depth, but output encoding in the frontend is still required
 */
export function sanitizeUserInput(input: string): string {
	if (!input) return '';

	return input
		.trim()
		// Remove any HTML tags
		.replace(/<[^>]*>/g, '')
		// Escape HTML entities
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes display names
 * - Max 50 characters
 * - Alphanumeric, spaces, underscores, hyphens only
 */
export function sanitizeDisplayName(name: string): string {
	if (!name) return '';

	return name
		.trim()
		.slice(0, 50)
		// Remove any non-alphanumeric except spaces, underscores, hyphens
		.replace(/[^a-zA-Z0-9 _-]/g, '');
}

/**
 * Sanitizes puzzle/solution text
 * - Allows most printable characters and special characters
 * - Max 1000 characters
 * - Only removes HTML tags and escapes < > to prevent HTML injection
 */
export function sanitizePuzzleText(text: string): string {
	if (!text) return '';

	return text
		.trim()
		.slice(0, 1000)
		// Remove HTML tags but allow most special characters
		.replace(/<[^>]*>/g, '')
		// Escape remaining < and > to prevent HTML injection
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * Sanitizes explanation text
 * - More permissive than puzzle text
 * - Max 5000 characters
 * - Removes HTML tags but allows basic punctuation
 */
export function sanitizeExplanation(text: string): string {
	if (!text) return '';

	return text
		.trim()
		.slice(0, 5000)
		// Remove HTML tags
		.replace(/<[^>]*>/g, '')
		// Allow most printable characters except < > & " '
		.replace(/[<>"'&]/g, (char) => {
			const entities = {
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#x27;',
				'&': '&amp;'
			};
			return entities[char] || char;
		});
}
