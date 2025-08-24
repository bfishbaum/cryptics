import React, { useEffect, useState } from 'react';
import { DatabaseService } from '../services/database';
import { Source } from '../types/cryptogram';
import { validateSolution } from '../utils/validation';
import { useAuth0 } from '@auth0/auth0-react';
import CryptoJS from 'crypto-js';

export const SubmissionPage: React.FC = () => {
  // Use Auth0 API hook
  const [password, setPassword] = useState('');
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
  const [deleteId, setDeleteId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');

  // Helper function to get access token when needed
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'cryptic_api_id',
          scope: "delete:cryptic write:new_cryptic",
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
            scope: "delete:cryptic write:new_cryptic",
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Get access token when we actually need it
      const accessToken = await getAccessToken();

      if (!accessToken) {
        setErrors({ submit: 'Failed to get access token. Please try logging in again.' });
        return;
      }
      console.log(accessToken);

      await DatabaseService.createCryptogram({
        puzzle: formData.puzzle,
        solution: formData.solution,
        explanation: formData.explanation || undefined,
        source: Source.OFFICIAL,
        difficulty: formData.difficulty,
        date_added: new Date(formData.date_added)
      }, accessToken);

      setSuccessMessage('Cryptic submitted successfully!');
      setFormData({
        puzzle: '',
        solution: '',
        explanation: '',
        difficulty: 1,
        date_added: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    } catch {
      setErrors({ submit: 'Failed to submit cryptogram. Please try again.' });
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

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = parseInt(deleteId);
    if (isNaN(id) || id <= 0) {
      setErrors({ deleteId: 'Please enter a valid ID number' });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete cryptogram with ID ${id}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteSuccessMessage('');
    setErrors(prev => ({ ...prev, deleteId: '', deleteSubmit: '' }));

    try {
      // Get access token when we actually need it
      const accessToken = await getAccessToken();

      if (!accessToken) {
        setErrors(prev => ({ ...prev, deleteSubmit: 'Failed to get access token. Please try logging in again.' }));
        return;
      }

      await DatabaseService.deleteCryptogram(id, accessToken);
      setDeleteSuccessMessage(`Cryptogram with ID ${id} deleted successfully!`);
      setDeleteId('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete cryptogram';
      setErrors(prev => ({ ...prev, deleteSubmit: errorMessage }));
    } finally {
      setIsDeleting(false);
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
              placeholder="Enter the encrypted puzzle text"
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

          <div className="form-group">
            <label htmlFor="date_added" className="form-label">
              Publish Date *
            </label>
            <input
              type="date"
              id="date_added"
              className="form-input"
              value={formData.date_added}
              onChange={(e) => handleInputChange('date_added', e.target.value)}
              required
            />
            {errors.date_added && (
              <div className="error-message">{errors.date_added}</div>
            )}
          </div>

          {errors.submit && (
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
              {errors.submit}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Cryptogram'}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Section */}
      <div className="white-box" style={{ marginTop: '40px' }}>
        <h2 className="page-title" style={{ fontSize: '24px', marginBottom: '20px' }}>Delete Cryptogram</h2>

        {deleteSuccessMessage && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            {deleteSuccessMessage}
          </div>
        )}

        <form onSubmit={handleDelete} style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="form-group">
            <label htmlFor="deleteId" className="form-label">
              Cryptogram ID *
            </label>
            <input
              type="number"
              id="deleteId"
              className="form-input"
              value={deleteId}
              onChange={(e) => {
                setDeleteId(e.target.value);
                if (errors.deleteId) {
                  setErrors(prev => ({ ...prev, deleteId: '' }));
                }
              }}
              placeholder="Enter ID of cryptogram to delete"
              min="1"
              required
            />
            {errors.deleteId && (
              <div className="error-message">{errors.deleteId}</div>
            )}
          </div>

          {errors.deleteSubmit && (
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
              {errors.deleteSubmit}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: '1px solid #dc3545'
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Cryptogram'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};