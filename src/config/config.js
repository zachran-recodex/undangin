// Wedding Invitation Configuration
const config = {
  data: {
    title: "Pernikahan Fulan & Fulana",
    description:
      "Kami akan menikah dan mengundang Anda untuk turut merayakan momen istimewa ini.",
    groomName: "Fulan",
    brideName: "Fulana",
    parentGroom: "Bapak Groom & Ibu Groom",
    parentBride: "Bapak Bride & Ibu Bride",
    date: "2024-12-24",
    maps_url: "https://goo.gl/maps/abcdef",
    maps_embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0000000000005!2d106.8270733147699!3d-6.175392995514422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4f1b6d7b1e7%3A0x2e69f4f1b6d7b1e7!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1633666820004!5m2!1sid!2sid",
    time: "16:16 - 17:30 WIB",
    location: "Grand Ballroom, Hotel Majesty",
    address: "Jl. Jend. Sudirman No.1, Jakarta",
    ogImage: "/images/og-image.jpg",
    favicon: "/images/favicon.ico",
    agenda: [
      {
        title: "Akad Nikah",
        date: "2024-12-24",
        startTime: "16:16",
        endTime: "17:30",
        location: "Grand Ballroom, Hotel Majesty",
        address: "Jl. Jend. Sudirman No.1, Jakarta",
      },
      {
        title: "Resepsi Nikah",
        date: "2024-12-24",
        startTime: "16:16",
        endTime: "17:30",
        location: "Grand Ballroom, Hotel Majesty",
        address: "Jl. Jend. Sudirman No.1, Jakarta",
      }
    ],
    audio: {
      src: "/audio/fulfilling-humming.mp3",
      title: "Fulfilling Humming",
      autoplay: true,
      loop: true
    },
    // Encrypted bank account data for security
    banks: [
      {
        bank: "Bank Central Asia",
        accountNumber: "U2FsdGVkX1+J+y5oclc1CCsV7ZveiWZy1KcbdZCLTV4=", // Encrypted: 1234567890
        accountName: "FULAN",
      },
      {
        bank: "Bank Mandiri",
        accountNumber: "U2FsdGVkX1/NURthRAjddnRyxGkQj2sitOIuSzioGNk=", // Encrypted: 0987654321
        accountName: "FULANA",
      }
    ]
  },
  
  // Security configuration
  security: {
    // Access control settings
    accessControl: {
      enabled: true,
      requireCode: true,
      requireGuestValidation: true,
      maxLoginAttempts: 5,
      lockoutDuration: 300000, // 5 minutes in milliseconds
    },
    
    // Access window (invitation active period)
    accessWindow: {
      enabled: true,
      startDate: "2024-12-20T00:00:00Z",
      endDate: "2024-12-26T23:59:59Z",
    },
    
    // Session settings
    session: {
      duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      autoExtend: true,
    }
  },
  
  // Guest list with access codes
  guestList: [
    {
      id: 1,
      name: "John Doe",
      code: "JOHN2024",
      email: "john@example.com",
      phone: "+62812345678",
      category: "family",
      allowedGuests: 2,
      specialNotes: "Vegetarian meal"
    },
    {
      id: 2,
      name: "Jane Smith",
      code: "JANE2024",
      email: "jane@example.com",
      phone: "+62812345679",
      category: "friend",
      allowedGuests: 1,
      specialNotes: ""
    },
    {
      id: 3,
      name: "Ahmad Rahman",
      code: "AHMAD24",
      email: "ahmad@example.com",
      phone: "+62812345680",
      category: "colleague",
      allowedGuests: 2,
      specialNotes: "Halal meal required"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      code: "SARAH24",
      email: "sarah@example.com",
      phone: "+62812345681",
      category: "family",
      allowedGuests: 3,
      specialNotes: "Child seat needed"
    },
    {
      id: 5,
      name: "Michael Chen",
      code: "MIKE2024",
      email: "michael@example.com",
      phone: "+62812345682",
      category: "friend",
      allowedGuests: 1,
      specialNotes: ""
    }
  ],
  
  // Master access codes for organizers
  masterCodes: [
    "ADMIN2024",
    "ORGANIZER24",
    "MASTER2024"
  ]
};

export default config;
