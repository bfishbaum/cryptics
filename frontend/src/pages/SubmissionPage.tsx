import React, { useMemo, useState } from 'react';
import { UserPuzzleDatabaseService } from '../services/userPuzzles';
import { Source } from '../types/cryptogram';
import { validateSolution } from '../utils/validation';
import { useAuth0 } from '@auth0/auth0-react';
import { encodeCryptogramToParams } from '../utils/cryptogramShare';

export const SubmissionPage: React.FC = () => {
  const { isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();

  const [formData, setFormData] = useState({
    puzzle: '',
    solution: '',
    explanation: '',
    difficulty: 1,
    date_added: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [shareStatus, setShareStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const sharedPuzzleBasePath = useMemo(() => (
    import.meta.env.MODE === 'production' ? '/cryptics/shared-puzzle' : '/shared-puzzle'
  ), []);

  // Helper function to get access token when needed
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'cryptic_api_id',
        },
        cacheMode: 'on', // Use cached token if available
      });
      return accessToken;
    } catch (error) {
      console.error('Error getting access token silently:', error);

      // If silent token retrieval fails, try with popup
      try {
        const accessToken = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: 'cryptic_api_id',
          },
        });
        if (!accessToken) {
          console.error('Failed to get access token with popup');
          return null;
        }
        return accessToken;
      } catch (popupError) {
        console.error('Error getting access token with popup:', popupError);
        return null;
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.puzzle.trim()) {
      newErrors.puzzle = 'Puzzle is required';
    }

    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution is required';
    } else if (!validateSolution(formData.solution)) {
      newErrors.solution = 'Solution must contain only lowercase letters, spaces, and hyphens. Spaces and hyphens must be between letters.';
    }

    if (formData.difficulty < 1 || formData.difficulty > 5) {
      newErrors.difficulty = 'Difficulty must be between 1 and 5';
    }

    if (!formData.date_added) {
      newErrors.date_added = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrors({ submit: 'Please log in to submit puzzles.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const normalizedSolution = formData.solution.toLowerCase();

      // Get access token when we actually need it
      const accessToken = await getAccessToken();

      if (!accessToken) {
        setErrors({ submit: 'Failed to get access token. Please try logging in again.' });
        return;
      }
      console.log(accessToken);

      await UserPuzzleDatabaseService.createUserPuzzle({
        puzzle: formData.puzzle,
        solution: normalizedSolution,
        explanation: formData.explanation || undefined,
        source: Source.OFFICIAL,
        difficulty: formData.difficulty,
        date_added: new Date(formData.date_added)
      }, accessToken);

      setSuccessMessage('Puzzle submitted successfully!');
      setFormData({
        puzzle: '',
        solution: '',
        explanation: '',
        difficulty: 1,
        date_added: new Date().toISOString().split('T')[0]
      });
      setErrors({});
      setShareStatus(null);
    } catch {
      setErrors({ submit: 'Failed to submit puzzle. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleShareLink = async () => {
    if (!validateForm()) {
      setShareStatus({ message: 'Fix the highlighted fields before creating a shareable link.', type: 'error' });
      return;
    }

    try {
      const normalizedSolution = formData.solution.toLowerCase();
      const params = encodeCryptogramToParams({
        puzzle: formData.puzzle,
        solution: normalizedSolution,
        explanation: formData.explanation || undefined,
        source: Source.USER_SUBMITTED,
        difficulty: formData.difficulty
      });

      const shareUrl = `${window.location.origin}${sharedPuzzleBasePath}?${params.toString()}`;

      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus({ message: 'Shareable link copied to your clipboard!', type: 'success' });
      } else {
        setShareStatus({ message: `Shareable link: ${shareUrl}`, type: 'success' });
      }
    } catch (error) {
      console.error('Failed to create share link', error);
      setShareStatus({ message: 'Failed to create shareable link. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Submit New Cryptic</h1>

        {successMessage && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-group">
            <label htmlFor="puzzle" className="form-label">
              Puzzle *
            </label>
            <textarea
              id="puzzle"
              className="form-textarea"
              value={formData.puzzle}
              onChange={(e) => handleInputChange('puzzle', e.target.value)}
              placeholder="Enter the puzzle text (shown to solvers)"
              required
            />
            {errors.puzzle && (
              <div className="error-message">{errors.puzzle}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="solution" className="form-label">
              Solution *
            </label>
            <input
              type="text"
              id="solution"
              className="form-input"
              value={formData.solution}
              onChange={(e) => handleInputChange('solution', e.target.value)}
              placeholder="Enter the solution (lowercase letters, spaces, and hyphens only)"
              required
            />
            {errors.solution && (
              <div className="error-message">{errors.solution}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="explanation" className="form-label">
              Explanation (optional)
            </label>
            <textarea
              id="explanation"
              className="form-textarea"
              value={formData.explanation}
              onChange={(e) => handleInputChange('explanation', e.target.value)}
              placeholder="Optional explanation or hint for the cryptogram"
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty" className="form-label">
              Difficulty *
            </label>
            <select
              id="difficulty"
              className="form-select"
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
              required
            >
              <option value={1}>1 - Very Easy</option>
              <option value={2}>2 - Easy</option>
              <option value={3}>3 - Medium</option>
              <option value={4}>4 - Hard</option>
              <option value={5}>5 - Very Hard</option>
            </select>
            {errors.difficulty && (
              <div className="error-message">{errors.difficulty}</div>
            )}
          </div>

          {errors.submit && (
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
              {errors.submit}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !isAuthenticated}
            >
              {isAuthenticated ? (isSubmitting ? 'Submitting...' : 'Submit Cryptogram') : 'Please log in to submit puzzles'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleShareLink}
              disabled={isSubmitting}
            >
              Create Shareable Link
            </button>
          </div>

          {shareStatus && (
            <div
              style={{
                marginTop: '16px',
                textAlign: 'center',
                color: shareStatus.type === 'success' ? '#155724' : '#dc3545'
              }}
            >
              {shareStatus.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};