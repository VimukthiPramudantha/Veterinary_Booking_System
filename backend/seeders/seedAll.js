const doctorSeeder = require('./doctorSeeder');
const userSeeder = require('./userSeeder');

const seedAll = async () => {
  try {
    console.log('Starting database seeding process...\n');
    
    console.log('=== SEEDING DOCTORS ===');
    await doctorSeeder();
    
    console.log('\n=== SEEDING USERS ===');
    await userSeeder();
    
    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log('\nLogin Credentials:');
    console.log('\nDoctors (use email and password "doctor123"):');
    console.log('- dr.silva@pawcare.com');
    console.log('- dr.perera@pawcare.com');
    console.log('- dr.fernando@pawcare.com');
    console.log('- dr.jayasekara@pawcare.com');
    console.log('- dr.amarasinghe@pawcare.com');
    console.log('- dr.wickramasinghe@pawcare.com');
    console.log('- dr.rathnayake@pawcare.com');
    console.log('- dr.mendis@pawcare.com');
    console.log('- dr.gunasekara@pawcare.com');
    console.log('- dr.rajapakse@pawcare.com');
    
    console.log('\nUsers (use email and password "user123"):');
    console.log('- john.doe@email.com');
    console.log('- jane.smith@email.com');
    console.log('- mike.johnson@email.com');
    console.log('- sarah.wilson@email.com');
    console.log('- david.brown@email.com');
    console.log('- lisa.davis@email.com');
    console.log('- alex.garcia@email.com');
    console.log('- emma.martinez@email.com');
    console.log('- ryan.lee@email.com');
    console.log('- olivia.taylor@email.com');
    
  } catch (error) {
    console.error('Error during seeding process:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAll();
}

module.exports = seedAll;