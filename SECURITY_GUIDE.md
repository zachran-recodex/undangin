# 🔐 Panduan Keamanan Undangan Digital

## Fitur Keamanan yang Diimplementasikan

### 1. **Sistem Autentikasi Multi-Layer**

- ✅ Kode akses unik untuk setiap tamu
- ✅ Validasi nama tamu dengan guest list
- ✅ URL parameter authentication
- ✅ Session management dengan auto-extend
- ✅ Master codes untuk admin access

### 2. **Rate Limiting & Lockout Protection**

- ✅ Maksimal 5 percobaan login per 5 menit
- ✅ Auto-lockout selama 5 menit setelah gagal
- ✅ Real-time countdown timer
- ✅ Per-user tracking untuk mencegah abuse

### 3. **Enkripsi Data Sensitif**

- ✅ Nomor rekening bank dienkripsi dengan AES
- ✅ Secret key terpisah dari kode utama
- ✅ Dekripsi otomatis saat ditampilkan
- ✅ Copy to clipboard menggunakan data terdekripsi

### 4. **Time-based Access Control**

- ✅ Undangan hanya aktif dalam rentang waktu tertentu
- ✅ Periode akses: 20 Desember - 26 Desember 2024
- ✅ Auto-blocking di luar periode tersebut

### 5. **Input Sanitization & XSS Protection**

- ✅ Sanitasi input untuk mencegah XSS
- ✅ Validasi karakter berbahaya
- ✅ Security headers di HTML meta tags

## Cara Menggunakan

### Untuk Penyelenggara Acara

1. **Setup Guest List**
   - Edit `src/config/config.js`
   - Tambahkan nama tamu di array `guestList`
   - Berikan kode akses unik untuk setiap tamu

2. **Generate Invitation URLs**

   ```bash
   node src/lib/generateInvites.js
   ```

   Script ini akan menghasilkan:
   - URL unik untuk setiap tamu
   - Link WhatsApp ready-to-send
   - Master access codes untuk admin

3. **Kirim Undangan**
   - Kirim URL melalui WhatsApp/Email
   - Atau berikan kode akses secara terpisah
   - Pastikan tamu memasukkan nama yang sesuai

### Untuk Tamu

1. **Akses Melalui URL**
   - Klik link yang diberikan
   - Sistem akan auto-login jika valid

2. **Akses Manual**
   - Buka website undangan
   - Masukkan kode akses yang diberikan

3. **Jika Lupa Kode**
   - Hubungi penyelenggara
   - Admin bisa memberikan master code

## Konfigurasi Keamanan

### Guest List Example

```javascript
{
  id: 1,
  name: "John Doe",
  code: "JOHN2024",
  email: "john@example.com",
  phone: "+62812345678",
  category: "family",
  allowedGuests: 2,
  specialNotes: "Vegetarian meal"
}
```

### Master Codes

- `ADMIN2024` - Admin access
- `ORGANIZER24` - Organizer access  
- `MASTER2024` - Master access

### Security Settings

```javascript
security: {
  accessControl: {
    enabled: true,
    requireCode: true,
    requireGuestValidation: true,
    maxLoginAttempts: 5,
    lockoutDuration: 300000, // 5 minutes
  },
  accessWindow: {
    enabled: true,
    startDate: "2024-12-20T00:00:00Z",
    endDate: "2024-12-26T23:59:59Z",
  }
}
```

## Testing Credentials

### Sample Guest Accounts

1. **John Doe** - Code: `JOHN2024`
2. **Jane Smith** - Code: `JANE2024`  
3. **Ahmad Rahman** - Code: `AHMAD24`
4. **Sarah Johnson** - Code: `SARAH24`
5. **Michael Chen** - Code: `MIKE2024`

### Admin Access

- Name: `Admin` - Code: `ADMIN2024`
- Name: `Organizer` - Code: `ORGANIZER24`
- Name: `Master` - Code: `MASTER2024`

## URL Examples

### Direct Access URLs

```bash
http://localhost:5173?code=JOHN2024
http://localhost:5173?code=JANE2024
http://localhost:5173?code=ADMIN2024
```

### WhatsApp Share Format

```bash
https://wa.me/6281234567890?text=Halo John! Kode akses undangan: JOHN2024. Link: http://localhost:5173?code=JOHN2024
```

## Troubleshooting

### Common Issues

1. **"Kode akses tidak valid"**
   - Periksa ejaan kode akses
   - Pastikan kode masih aktif
   - Coba gunakan master code jika admin

2. **"Terlalu banyak percobaan"**
   - Tunggu 5 menit untuk reset
   - Atau restart browser untuk clear localStorage

3. **"Undangan tidak tersedia"**
   - Periksa tanggal akses di config
   - Pastikan dalam rentang waktu yang valid

4. **"Session expired"**
   - Session berlaku 24 jam
   - Login ulang untuk extend session

## Security Best Practices

### Untuk Production

1. **Environment Variables**

   ```bash
   VITE_SECRET_KEY=your-secret-key-here
   VITE_BASE_URL=https://your-domain.com
   ```

2. **HTTPS Required**
   - Deploy dengan SSL certificate
   - Update base URL di config

3. **Regular Updates**
   - Update guest list sesuai kebutuhan
   - Rotate secret keys secara berkala
   - Monitor access logs

4. **Backup Strategy**
   - Backup config file
   - Export guest responses
   - Save access analytics

## Monitoring & Analytics

### Check Session Data

```javascript
// In browser console
localStorage.getItem('undangin_session')
```

### Clear All Sessions

```javascript
// Reset all authentication
localStorage.clear()
location.reload()
```

---

**📞 Support:** Hubungi developer jika ada masalah teknis  
**🔒 Security:** Sistem ini menggunakan encryption dan best practices untuk melindungi data tamu
