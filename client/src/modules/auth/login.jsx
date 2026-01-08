import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Shield, Eye, EyeOff } from 'lucide-react';
import { login } from './authService';
import { siteContent } from '@/data/siteContent';

export default function Login() {
  const [loginType, setLoginType] = useState('admin');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Super Admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login({
        username: formData.username,
        password: formData.password,
        loginType,
        role: loginType === 'admin' ? formData.role : undefined
      });

      setLoading(false);

      if (result.success) {
        console.log('Login successful:', result.user);
        alert(`Welcome ${result.user.username}!${result.user.role ? ` (${result.user.role})` : ''}`);
      } else {
        setError(result.message);
      }
    }, 800);
  };

  const toggleLoginType = (type) => {
    setLoginType(type);
    setError('');
    setFormData({
      username: '',
      password: '',
      role: 'Super Admin'
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb,0,0,0),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb,0,0,0),0.03)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        {/* Login Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center pt-8 pb-6 px-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <LogIn className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue
            </p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex gap-2 px-6 pb-6">
            <button
              type="button"
              onClick={() => toggleLoginType('admin')}
              className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium rounded-lg transition-all ${
                loginType === 'admin'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-accent/50 text-muted-foreground hover:bg-accent'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => toggleLoginType('user')}
              className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium rounded-lg transition-all ${
                loginType === 'user'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-accent/50 text-muted-foreground hover:bg-accent'
              }`}
            >
              <User className="w-4 h-4" />
              User
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-2.5 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground placeholder:text-muted-foreground/50"
                placeholder="Enter username"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground placeholder:text-muted-foreground/50 pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection (Admin Only) */}
            {loginType === 'admin' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="role" className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-foreground cursor-pointer"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                </select>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25 text-sm mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-center text-xs text-muted-foreground mb-2">Demo Credentials</p>
              <div className="bg-accent/30 rounded-lg p-3 space-y-1 text-xs text-center">
                {loginType === 'admin' ? (
                  <>
                    <p className="text-muted-foreground">
                      Admin: <span className="font-mono text-foreground">admin / admin123</span>
                    </p>
                    <p className="text-muted-foreground">
                      Manager: <span className="font-mono text-foreground">manager / manager123</span>
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    User: <span className="font-mono text-foreground">user / user123</span>
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-xs text-muted-foreground"
        >
          <p>© {new Date().getFullYear()} {siteContent.brand.name}. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}