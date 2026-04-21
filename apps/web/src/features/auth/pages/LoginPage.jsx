import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({ username: false, password: false });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  function validateForm() {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }));
    if (error) clearError();
  }

  function handleBlur(e) {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!validateForm()) return;
    try {
      await login(formData.username.trim(), formData.password);
    } catch {
      // error handled by AuthContext
    }
  }

  return (
    <div className={styles.loginContainer}>
      {/* Left branding panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandTop}>
          <div className={styles.brandLogo}>
            <div className={styles.brandLogoIcon}>🎓</div>
            <span className={styles.brandLogoText}>OpenSIS</span>
          </div>
          <h1 className={styles.brandHeadline}>
            Modern School<br />
            <span>Management</span><br />
            System
          </h1>
          <p className={styles.brandSubtext}>
            A complete student information system built for educators — manage students, teachers, classes, and attendance in one place.
          </p>
        </div>

        <div className={styles.brandFeatures}>
          <div className={styles.brandFeature}>
            <span className={styles.brandFeatureDot} />
            Student & Teacher Management
          </div>
          <div className={styles.brandFeature}>
            <span className={styles.brandFeatureDot} />
            Class Scheduling & Enrollment
          </div>
          <div className={styles.brandFeature}>
            <span className={styles.brandFeatureDot} />
            Attendance Tracking
          </div>
          <div className={styles.brandFeature}>
            <span className={styles.brandFeatureDot} />
            Role-Based Access Control
          </div>
        </div>

        <div className={styles.brandBottom}>
          © 2026 OpenSIS — Open Solutions for Education
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to your administrator account</p>
          </div>

          {error && (
            <div className={`${styles.alert} ${styles.alertDanger}`}>
              <span className={styles.alertIcon}>⚠</span>
              <div className={styles.alertText}>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className={`${styles.formControl} ${touched.username && validationErrors.username ? styles.inputError : ''}`}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
              {touched.username && validationErrors.username && (
                <p className={styles.errorText}>{validationErrors.username}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`${styles.formControl} ${touched.password && validationErrors.password ? styles.inputError : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                autoComplete="current-password"
              />
              {touched.password && validationErrors.password && (
                <p className={styles.errorText}>{validationErrors.password}</p>
              )}
            </div>

            <button type="submit" className={styles.btnLogin} disabled={isLoading}>
              {isLoading ? (
                <span className={styles.loadingSpinner}>
                  <span className={styles.spinner} />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <p className={styles.helpText}>
              Contact your administrator if you need access
            </p>
          </form>

          <div className={styles.formFooter}>
            OpenSIS Modern &mdash; Student Information System
          </div>
        </div>
      </div>
    </div>
  );
}
