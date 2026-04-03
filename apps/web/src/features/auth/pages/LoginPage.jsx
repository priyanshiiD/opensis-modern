import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './LoginPage.module.css';

/**
 * LoginPage Component
 * 
 * Displays the login form with:
 * - Email/Username input
 * - Password input
 * - Form validation
 * - Error handling
 * - Loading state
 * - Auto-redirect on successful login
 * 
 * Matches the UI design of the original PHP-based openSIS system
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username or email is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear server error when user modifies form
    if (error) {
      clearError();
    }
  };

  /**
   * Handle field blur (for touched state)
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      username: true,
      password: true
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.username.trim(), formData.password);
      // Navigation happens automatically via useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by AuthContext and displayed via the error state
      if (err.message.includes('404') || err.message.includes('invalid response')) {
        console.warn('Backend connection issue - check if API is running on port 4000');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.panel}>
          {/* Header with logo */}
          <div className={styles.panelHeading}>
            <div className={styles.logo}>
              <img
                src="/opensis_logo.png"
                alt="openSIS Logo"
                className={styles.logoImg}
              />
            </div>
            <h3 className={styles.title}>Student Information System</h3>
          </div>

          {/* Login form */}
          <div className={styles.panelBody}>
          {/* Display server error */}
            {error && (
              <div className={styles.alert + ' ' + styles.alertDanger}>
                <span className={styles.alertIcon}>⚠</span>
                <div className={styles.alertText}>
                  <p><strong>Login Error:</strong></p>
                  <p>{error}</p>
                  {error.includes('Invalid') && (
                    <small style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
                      💡 Hint: Make sure the demo user exists in the database. 
                      See DATABASE_SEEDING_HELP.md for setup instructions.
                    </small>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Username input */}
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username or Email
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`${styles.formControl} ${
                    touched.username && validationErrors.username
                      ? styles.inputError
                      : ''
                  }`}
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  autoComplete="username"
                  autoFocus
                />
                {touched.username && validationErrors.username && (
                  <p className={styles.errorText}>
                    {validationErrors.username}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`${styles.formControl} ${
                    touched.password && validationErrors.password
                      ? styles.inputError
                      : ''
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                {touched.password && validationErrors.password && (
                  <p className={styles.errorText}>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Login button */}
              <button
                type="submit"
                className={styles.btnLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.loadingSpinner}>
                    <span className={styles.spinner}></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>

              {/* Help text */}
              <p className={styles.helpText}>
                Contact your administrator if you forgot your password
              </p>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className={styles.loginInfo}>
          <p>openSIS &copy; 2026 Open Solutions for Education, Inc.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
