const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
require('dotenv').config();

const doctors = [
  {
    doctorId: 'DOC001',
    email: 'dr.silva@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Pradeep Silva',
    specialization: 'General Veterinary',
    experience: 8,
    qualifications: ['BVSc', 'MVSc Animal Medicine'],
    contactNumber: '+94771234567',
    clinicAddress: {
      street: '123 Galle Road',
      city: 'Colombo',
      location: 'Colombo'
    },
    consultationFee: 3500,
    rating: 4.5,
    totalRatings: 150
  },
  {
    doctorId: 'DOC002',
    email: 'dr.perera@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Kamani Perera',
    specialization: 'Surgery',
    experience: 12,
    qualifications: ['BVSc', 'Diploma in Veterinary Surgery'],
    contactNumber: '+94772345678',
    clinicAddress: {
      street: '45 High Level Road',
      city: 'Nugegoda',
      location: 'Nugegoda'
    },
    consultationFee: 4500,
    rating: 4.8,
    totalRatings: 200
  },
  {
    doctorId: 'DOC003',
    email: 'dr.fernando@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Ruwan Fernando',
    specialization: 'Dentistry',
    experience: 6,
    qualifications: ['BVSc', 'Certificate in Veterinary Dentistry'],
    contactNumber: '+94773456789',
    clinicAddress: {
      street: '67 Baseline Road',
      city: 'Dehiwala',
      location: 'Dehiwala'
    },
    consultationFee: 4000,
    rating: 4.3,
    totalRatings: 85
  },
  {
    doctorId: 'DOC004',
    email: 'dr.jayasekara@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Nimal Jayasekara',
    specialization: 'Dermatology',
    experience: 10,
    qualifications: ['BVSc', 'MSc Veterinary Dermatology'],
    contactNumber: '+94774567890',
    clinicAddress: {
      street: '89 Kandawala Road',
      city: 'Rajagiriya',
      location: 'Rajagiriya'
    },
    consultationFee: 5000,
    rating: 4.7,
    totalRatings: 120
  },
  {
    doctorId: 'DOC005',
    email: 'dr.amarasinghe@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Sanduni Amarasinghe',
    specialization: 'Internal Medicine',
    experience: 9,
    qualifications: ['BVSc', 'Diploma in Small Animal Internal Medicine'],
    contactNumber: '+94775678901',
    clinicAddress: {
      street: '12 Panadura Road',
      city: 'Battaramulla',
      location: 'Battaramulla'
    },
    consultationFee: 4200,
    rating: 4.6,
    totalRatings: 95
  },
  {
    doctorId: 'DOC006',
    email: 'dr.wickramasinghe@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Chamara Wickramasinghe',
    specialization: 'Emergency Care',
    experience: 7,
    qualifications: ['BVSc', 'Certificate in Emergency Medicine'],
    contactNumber: '+94776789012',
    clinicAddress: {
      street: '34 Thalahena Road',
      city: 'Malabe',
      location: 'Malabe'
    },
    consultationFee: 5500,
    rating: 4.4,
    totalRatings: 110
  },
  {
    doctorId: 'DOC007',
    email: 'dr.rathnayake@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Anjali Rathnayake',
    specialization: 'General Veterinary',
    experience: 5,
    qualifications: ['BVSc', 'Certificate in Companion Animal Medicine'],
    contactNumber: '+94777890123',
    clinicAddress: {
      street: '56 Nawala Road',
      city: 'Nugegoda',
      location: 'Nugegoda'
    },
    consultationFee: 3200,
    rating: 4.2,
    totalRatings: 70
  },
  {
    doctorId: 'DOC008',
    email: 'dr.mendis@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Kasun Mendis',
    specialization: 'Surgery',
    experience: 11,
    qualifications: ['BVSc', 'Fellowship in Advanced Surgery'],
    contactNumber: '+94778901234',
    clinicAddress: {
      street: '78 Union Place',
      city: 'Colombo',
      location: 'Colombo'
    },
    consultationFee: 4800,
    rating: 4.9,
    totalRatings: 180
  },
  {
    doctorId: 'DOC009',
    email: 'dr.gunasekara@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Thilini Gunasekara',
    specialization: 'Dermatology',
    experience: 8,
    qualifications: ['BVSc', 'PgDip Veterinary Dermatology'],
    contactNumber: '+94779012345',
    clinicAddress: {
      street: '90 Attidiya Road',
      city: 'Dehiwala',
      location: 'Dehiwala'
    },
    consultationFee: 4600,
    rating: 4.5,
    totalRatings: 130
  },
  {
    doctorId: 'DOC010',
    email: 'dr.rajapakse@pawcare.com',
    password: 'doctor123',
    fullName: 'Dr. Mahesh Rajapakse',
    specialization: 'Internal Medicine',
    experience: 13,
    qualifications: ['BVSc', 'MVSc Internal Medicine', 'PhD Veterinary Medicine'],
    contactNumber: '+94770123456',
    clinicAddress: {
      street: '101 Kotte Road',
      city: 'Rajagiriya',
      location: 'Rajagiriya'
    },
    consultationFee: 5200,
    rating: 4.8,
    totalRatings: 220
  }
];

const generateAvailableSlots = () => {
  const slots = [];
  const today = new Date();
  
  // Generate slots for next 30 days
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Sundays
    if (date.getDay() !== 0) {
      slots.push({
        date: date,
        slots: [
          { time: '09:00', isBooked: false },
          { time: '10:00', isBooked: false },
          { time: '11:00', isBooked: false },
          { time: '14:00', isBooked: false },
          { time: '15:00', isBooked: false },
          { time: '16:00', isBooked: false },
          { time: '17:00', isBooked: false }
        ]
      });
    }
  }
  
  return slots;
};

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding doctors');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Add available slots to each doctor
    const doctorsWithSlots = doctors.map(doctor => ({
      ...doctor,
      availableSlots: generateAvailableSlots()
    }));

    // Insert new doctors one by one to trigger password hashing
    const insertedDoctors = [];
    for (const doctorData of doctorsWithSlots) {
      const doctor = new Doctor(doctorData);
      await doctor.save();
      insertedDoctors.push(doctor);
    }
    console.log(`Successfully seeded ${insertedDoctors.length} doctors`);

    console.log('\nSeeded Doctors:');
    insertedDoctors.forEach(doctor => {
      console.log(`- ${doctor.fullName} (${doctor.specialization}) - ${doctor.email}`);
    });

  } catch (error) {
    console.error('Error seeding doctors:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

if (require.main === module) {
  seedDoctors();
}

module.exports = seedDoctors;