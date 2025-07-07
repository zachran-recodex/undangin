// Generate invitation URLs for all guests
// This utility helps generate unique invitation links for each guest

import config from '../config/config.js';
import { generateGuestCode, generateInvitationURL } from './auth.js';

const baseURL = 'https://your-domain.com'; // Replace with your actual domain

console.log('=== INVITATION URLS ===\n');

config.guestList.forEach((guest, index) => {
  const invitationURL = generateInvitationURL(guest, baseURL);
  
  console.log(`${index + 1}. ${guest.name}`);
  console.log(`   Category: ${guest.category}`);
  console.log(`   Code: ${guest.code}`);
  console.log(`   URL: ${invitationURL}`);
  console.log(`   WhatsApp: https://wa.me/${guest.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Halo ${guest.name}! Kami mengundang Anda ke pernikahan kami. Kode akses: ${guest.code}. Link undangan: ${invitationURL}`
  )}`);
  console.log('---');
});

// Generate master access info
console.log('\n=== MASTER ACCESS CODES ===\n');
config.masterCodes.forEach((code, index) => {
  console.log(`${index + 1}. ${code} (Admin access)`);
});

console.log('\n=== SECURITY SETTINGS ===\n');
console.log('Access Control:', config.security.accessControl.enabled ? 'Enabled' : 'Disabled');
console.log('Max Login Attempts:', config.security.accessControl.maxLoginAttempts);
console.log('Lockout Duration:', config.security.accessControl.lockoutDuration / 60000, 'minutes');
console.log('Access Window:', config.security.accessWindow.enabled ? 'Enabled' : 'Disabled');
if (config.security.accessWindow.enabled) {
  console.log('Start Date:', config.security.accessWindow.startDate);
  console.log('End Date:', config.security.accessWindow.endDate);
}