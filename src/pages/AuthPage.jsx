import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Clock,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import config from '@/config/config';
import { 
  validateAccessCode, 
  rateLimiter, 
  sanitizeGuestName,
  sanitizeAccessCode,
  createGuestSession,
  getAccessParamsFromURL,
  isWithinAccessWindow
} from '@/lib/auth';

const AuthPage = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    accessCode: ''
  });
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = getAccessParamsFromURL();
    if (urlParams.code) {
      setFormData({
        accessCode: urlParams.code
      });
      // Auto-validate if code parameter is present
      handleAutoValidation(urlParams.code);
    }
  }, []);

  // Check if access window is valid
  useEffect(() => {
    if (config.security.accessWindow.enabled) {
      const { startDate, endDate } = config.security.accessWindow;
      if (!isWithinAccessWindow(startDate, endDate)) {
        setError('Undangan tidak tersedia pada waktu ini. Silakan coba lagi nanti.');
      }
    }
  }, []);

  // Handle lockout timer
  useEffect(() => {
    let timer;
    if (isLocked && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutTime]);

  const handleAutoValidation = async (code) => {
    if (!code) return;
    
    setIsLoading(true);
    
    try {
      // Check master codes first
      const isMasterCode = config.masterCodes.includes(code.toUpperCase());
      
      if (isMasterCode) {
        const masterSession = createGuestSession({
          name: 'Admin',
          code: code,
          isMaster: true,
          category: 'admin'
        });
        
        setSuccess('Selamat datang, Admin!');
        setTimeout(() => {
          onAuthSuccess(masterSession);
        }, 1500);
        return;
      }
      
      // Find guest by access code
      const guest = config.guestList.find(g => 
        g.code.toUpperCase() === code.toUpperCase()
      );
      
      if (guest) {
        const session = createGuestSession(guest);
        setSuccess(`Selamat datang, ${guest.name}!`);
        
        setTimeout(() => {
          onAuthSuccess(session);
        }, 1500);
      } else {
        setError('Kode akses tidak valid');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat validasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    const sanitizedValue = sanitizeAccessCode(value);
    
    setFormData({
      accessCode: sanitizedValue
    });
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(lockoutTime / 60)} menit.`);
      return;
    }
    
    const { accessCode } = formData;
    
    if (!accessCode.trim()) {
      setError('Mohon masukkan kode akses');
      return;
    }
    
    // Check rate limiting using IP or browser fingerprint
    const identifier = 'browser_' + (navigator.userAgent + navigator.language).slice(0, 20);
    if (!rateLimiter.canAttempt(identifier)) {
      setIsLocked(true);
      setLockoutTime(300); // 5 minutes
      setError('Terlalu banyak percobaan. Silakan coba lagi dalam 5 menit.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check master codes first
      const isMasterCode = config.masterCodes.includes(accessCode.toUpperCase());
      
      if (isMasterCode) {
        const masterSession = createGuestSession({
          name: 'Admin',
          code: accessCode,
          isMaster: true,
          category: 'admin'
        });
        
        setSuccess('Selamat datang, Admin!');
        setTimeout(() => {
          onAuthSuccess(masterSession);
        }, 1500);
        return;
      }
      
      // Find guest by access code
      const guest = config.guestList.find(g => 
        g.code.toUpperCase() === accessCode.toUpperCase()
      );
      
      if (guest) {
        const session = createGuestSession(guest);
        setSuccess(`Selamat datang, ${guest.name}!`);
        
        setTimeout(() => {
          onAuthSuccess(session);
        }, 1500);
      } else {
        rateLimiter.recordAttempt(identifier);
        setAttempts(prev => prev + 1);
        
        if (attempts >= config.security.accessControl.maxLoginAttempts - 1) {
          setIsLocked(true);
          setLockoutTime(config.security.accessControl.lockoutDuration / 1000);
          setError('Terlalu banyak percobaan gagal. Akun dikunci sementara.');
        } else {
          setError(`Kode akses tidak valid. Percobaan ke-${attempts + 1}`);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Terjadi kesalahan saat validasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-rose-100/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-pink-100/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl border border-rose-100/50 shadow-2xl p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-serif text-gray-800 mb-2">
                Akses Undangan
              </h1>
              <p className="text-gray-600 text-sm">
                Masukkan kode akses Anda untuk melihat undangan
              </p>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lockout Timer */}
            <AnimatePresence>
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-3"
                >
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-orange-700">
                    Akun dikunci. Sisa waktu: {formatTime(lockoutTime)}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Access Code Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Akses
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showCode ? "text" : "password"}
                    name="accessCode"
                    value={formData.accessCode}
                    onChange={handleInputChange}
                    placeholder="Masukkan kode akses"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={isLoading || isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading || isLocked}
                  >
                    {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                type="submit"
                disabled={isLoading || isLocked}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                  isLoading || isLocked
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memvalidasi...
                  </div>
                ) : (
                  'Masuk ke Undangan'
                )}
              </motion.button>
            </form>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500 mb-2">
                Butuh bantuan? Hubungi penyelenggara acara
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>Kode akses diberikan melalui WhatsApp atau email</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;