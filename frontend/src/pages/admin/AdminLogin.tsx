import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react';

/**
 * Admin Login Page
 * Completely separate from regular user login
 * Only accepts users with role="admin"
 */
const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAdmin();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Error and validation state
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
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
   * Handle input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear general error
    if (error) setError('');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Call admin login
      await login(formData.email, formData.password);
      
      // Redirect to admin dashboard on success
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Brantech E-Shop</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Admin Login Card */}
          <Card className="border-slate-700 shadow-2xl">
            <CardHeader className="space-y-4 pb-6">
              {/* Shield Icon */}
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>

              {/* Title */}
              <div className="space-y-2 text-center">
                <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                <CardDescription>
                  Sign in to access the admin dashboard
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@brantech.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${validationErrors.email ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-sm text-destructive">{validationErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 ${validationErrors.password ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-destructive">{validationErrors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Signing in...</span>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    </>
                  ) : (
                    'Sign In to Admin Dashboard'
                  )}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  <Lock className="inline h-3 w-3 mr-1" />
                  This is a secure admin area. All activities are logged and monitored.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Main Site */}
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-slate-300"
            >
              ← Back to Main Site
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
