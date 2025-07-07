// src/pages/LandingPage.jsx
import config from '@/config/config';
import { formatEventDate } from '@/lib/formatEventDate';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, LogOut } from 'lucide-react';
import { clearGuestSession } from '@/lib/auth';

const LandingPage = ({ onOpenInvitation, guestSession }) => {
  const handleLogout = () => {
    clearGuestSession();
    window.location.reload();
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen relative overflow-hidden"
  >
    {/* Decorative Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white" />
    <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-rose-100/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-pink-100/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

    {/* User Info Bar */}
    {guestSession && (
      <div className="absolute top-4 right-4 z-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 backdrop-blur-sm bg-white/80 px-4 py-2 rounded-full border border-rose-100/50 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-gray-700">
              {guestSession.name}
            </span>
            {guestSession.isMaster && (
              <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="p-1 hover:bg-rose-50 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
          </button>
        </motion.div>
      </div>
    )}

    {/* Main Content */}
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="backdrop-blur-sm bg-white/50 p-6 sm:p-8 md:p-10 rounded-2xl border border-rose-100/50 shadow-xl">
          {/* Personal Greeting */}
          {guestSession && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-4"
            >
              <p className="text-rose-600 font-medium text-sm">
                {guestSession.isMaster ? 'Selamat datang, Admin!' : `Halo, ${guestSession.name}!`}
              </p>
              {guestSession.category && !guestSession.isMaster && (
                <p className="text-gray-500 text-xs mt-1">
                  Kategori: {guestSession.category === 'family' ? 'Keluarga' : 
                           guestSession.category === 'friend' ? 'Teman' : 
                           guestSession.category === 'colleague' ? 'Rekan Kerja' : 'Tamu'}
                </p>
              )}
            </motion.div>
          )}

          {/* Top Decorative Line */}
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <div className="h-px w-12 sm:w-16 bg-rose-200/50" />
            <div className="w-2 h-2 rounded-full bg-rose-300" />
            <div className="h-px w-12 sm:w-16 bg-rose-200/50" />
          </div>

          {/* Date and Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4 mb-6 sm:mb-8 items-center"
          >
            <div className="inline-flex flex-col items-center space-y-1 bg-white/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl">
              <Calendar className="w-5 h-5 text-rose-400" />
              <p className="text-gray-700 font-medium">
                {formatEventDate(config.data.date)}
              </p>
            </div>

            <div className="inline-flex flex-col items-center space-y-1 bg-white/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl">
              <Clock className="w-5 h-5 text-rose-400" />
              <p className="text-gray-700 font-medium">
                {config.data.time}
              </p>
            </div>
          </motion.div>

          {/* Couple Names */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-800 leading-tight">
                {config.data.groomName}
                <span className="text-rose-400 mx-2 sm:mx-3">&</span>
                {config.data.brideName}
              </h1>
              <div className="h-px w-16 sm:w-24 mx-auto bg-rose-200" />
            </div>
          </motion.div>

          {/* Open Invitation Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 sm:mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenInvitation}
              className="group relative w-full bg-rose-500 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-xl font-medium shadow-lg hover:bg-rose-600 transition-all duration-200"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Buka Undangan</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
    </motion.div>
  );
};

export default LandingPage;
