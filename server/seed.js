require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await db.connect();
  console.log('Seeding...');
  try {
    const pw = await bcrypt.hash('password123', 10);
    
    // Create Admin User
    const admin = await db.findUserByEmail('admin@example.com');
    if (!admin) {
      await db.addUser({ 
        name: 'Admin User', 
        email: 'admin@example.com', 
        password: pw, 
        role: 'admin',
        phone: '1234567890',
        address: 'Admin Office, City',
        gender: 'Male',
        dob: '1980-01-01'
      });
      console.log('Admin user created');
    }

    // Create Patient User
    const patient = await db.findUserByEmail('patient@example.com');
    if (!patient) {
      await db.addUser({ 
        name: 'Avinash Kr', 
        email: 'patient@example.com', 
        password: pw, 
        role: 'user',
        phone: '0000000000',
        address: 'AECS Layout\nWhitefield, BLR, KA',
        gender: 'Male',
        dob: '1995-01-01',
        picture: '/assets/profile_pic.png'
      });
      console.log('Patient user created');
    } else if (!patient.picture) {
      // if patient exists but has no picture, update to use bundled profile picture
      try {
        await db.updateUser(patient.id || patient._id, { picture: '/assets/profile_pic.png' });
        console.log('Patient picture updated');
      } catch (err) {
        console.error('Failed to update patient picture', err);
      }
    }

    // Create Multiple Doctors with different specialties
    const doctorsData = [
      {
        name: 'Dr. Richard James',
        email: 'richard.james@example.com',
        specialty: 'General physician',
        experience: '4 Years',
        fees: 50,
        picture: '/assets/doc1.png',
        degree: 'MBBS - General physician',
        about: 'Dr. Richard James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        address1: '17 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567890',
        dob: '1985-05-15',
        gender: 'Male'
      },
      {
        name: 'Dr. Emily Larson',
        email: 'emily.larson@example.com',
        specialty: 'Gynecologist',
        experience: '3 Years',
        fees: 60,
        picture: '/assets/doc2.png',
        degree: 'MBBS - Gynecologist',
        about: 'Dr. Emily Larson is dedicated to providing comprehensive care for women at all stages of life, specializing in reproductive health and prenatal care.',
        address1: '27 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567891',
        dob: '1988-08-20',
        gender: 'Female'
      },
      {
        name: 'Dr. Sarah Patel',
        email: 'sarah.patel@example.com',
        specialty: 'Dermatologist',
        experience: '1 Year',
        fees: 30,
        picture: '/assets/doc3.png',
        degree: 'MBBS - Dermatologist',
        about: 'Dr. Sarah Patel specializes in the diagnosis and treatment of skin, hair, and nail conditions with a focus on both medical and cosmetic dermatology.',
        address1: '37 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567892',
        dob: '1992-03-12',
        gender: 'Female'
      },
      {
        name: 'Dr. Christopher Lee',
        email: 'christopher.lee@example.com',
        specialty: 'Pediatricians',
        experience: '2 Years',
        fees: 40,
        picture: '/assets/doc4.png',
        degree: 'MBBS - Pediatrics',
        about: 'Dr. Christopher Lee is committed to the health and well-being of children, providing expert care from infancy through adolescence.',
        address1: '47 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567893',
        dob: '1987-11-25',
        gender: 'Male'
      },
      {
        name: 'Dr. Jennifer Garcia',
        email: 'jennifer.garcia@example.com',
        specialty: 'Neurologist',
        experience: '4 Years',
        fees: 50,
        picture: '/assets/doc5.png',
        degree: 'MBBS - Neurology',
        about: 'Dr. Jennifer Garcia specializes in disorders of the nervous system, providing expert diagnosis and treatment for neurological conditions.',
        address1: '57 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567894',
        dob: '1984-06-18',
        gender: 'Female'
      },
      {
        name: 'Dr. Andrew Williams',
        email: 'andrew.williams@example.com',
        specialty: 'Neurologist',
        experience: '4 Years',
        fees: 50,
        picture: '/assets/doc6.png',
        degree: 'MBBS - Neurology',
        about: 'Dr. Andrew Williams has extensive experience in treating complex neurological disorders with a patient-centered approach.',
        address1: '57 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567895',
        dob: '1983-09-30',
        gender: 'Male'
      },
      {
        name: 'Dr. Christopher Davis',
        email: 'christopher.davis@example.com',
        specialty: 'General physician',
        experience: '4 Years',
        fees: 50,
        picture: '/assets/doc7.png',
        degree: 'MBBS - General physician',
        about: 'Dr. Christopher Davis provides comprehensive primary care services with a focus on patient education and preventive medicine.',
        address1: '17 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567896',
        dob: '1986-02-14',
        gender: 'Male'
      },
      {
        name: 'Dr. Timothy White',
        email: 'timothy.white@example.com',
        specialty: 'Gynecologist',
        experience: '3 Years',
        fees: 60,
        picture: '/assets/doc8.png',
        degree: 'MBBS - Gynecologist',
        about: 'Dr. Timothy White offers expert gynecological care with a compassionate approach to women\'s health issues.',
        address1: '27 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567897',
        dob: '1989-07-22',
        gender: 'Male'
      },
      {
        name: 'Dr. Ava Mitchell',
        email: 'ava.mitchell@example.com',
        specialty: 'Dermatologist',
        experience: '1 Year',
        fees: 30,
        picture: '/assets/doc9.png',
        degree: 'MBBS - Dermatologist',
        about: 'Dr. Ava Mitchell is passionate about helping patients achieve healthy skin through evidence-based treatments.',
        address1: '37 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567898',
        dob: '1993-12-08',
        gender: 'Female'
      },
      {
        name: 'Dr. Jeffrey King',
        email: 'jeffrey.king@example.com',
        specialty: 'Pediatricians',
        experience: '2 Years',
        fees: 40,
        picture: '/assets/doc10.png',
        degree: 'MBBS - Pediatrics',
        about: 'Dr. Jeffrey King provides exceptional pediatric care with a gentle and understanding approach to treating young patients.',
        address1: '47 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567899',
        dob: '1990-04-16',
        gender: 'Male'
      },
      {
        name: 'Dr. Zoe Kelly',
        email: 'zoe.kelly@example.com',
        specialty: 'Neurologist',
        experience: '4 Years',
        fees: 50,
        picture: '/assets/doc11.png',
        degree: 'MBBS - Neurology',
        about: 'Dr. Zoe Kelly brings expertise in neurological care with a focus on improving quality of life for patients with chronic conditions.',
        address1: '57 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567800',
        dob: '1985-10-03',
        gender: 'Female'
      },
      {
        name: 'Dr. Patrick Harris',
        email: 'patrick.harris@example.com',
        specialty: 'Gastroenterologist',
        experience: '4 Years',
        fees: 50,
        picture: '/assets/doc12.png',
        degree: 'MBBS - Gastroenterology',
        about: 'Dr. Patrick Harris specializes in digestive system disorders, offering advanced diagnostic and treatment options.',
        address1: '57 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567801',
        dob: '1982-01-28',
        gender: 'Male'
      },
      {
        name: 'Dr. Chloe Evans',
        email: 'chloe.evans@example.com',
        specialty: 'General physician',
        experience: '4 Years',
        fees: 50,
        picture: '/assets/doc13.png',
        degree: 'MBBS - General physician',
        about: 'Dr. Chloe Evans is committed to providing holistic primary care with an emphasis on preventive health and wellness.',
        address1: '17 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567802',
        dob: '1987-05-19',
        gender: 'Female'
      },
      {
        name: 'Dr. Ryan Martinez',
        email: 'ryan.martinez@example.com',
        specialty: 'Gynecologist',
        experience: '3 Years',
        fees: 60,
        picture: '/assets/doc14.png',
        degree: 'MBBS - Gynecologist',
        about: 'Dr. Ryan Martinez provides comprehensive gynecological services with a patient-first philosophy.',
        address1: '27 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567803',
        dob: '1988-09-11',
        gender: 'Male'
      },
      {
        name: 'Dr. Amelia Hill',
        email: 'amelia.hill@example.com',
        specialty: 'Dermatologist',
        experience: '1 Year',
        fees: 30,
        picture: '/assets/doc15.png',
        degree: 'MBBS - Dermatologist',
        about: 'Dr. Amelia Hill combines medical expertise with aesthetic knowledge to help patients achieve their skin health goals.',
        address1: '37 Cross, Richmond',
        address2: 'Circle, Ring Road, London',
        phone: '1234567804',
        dob: '1994-11-07',
        gender: 'Female'
      }
    ];

    // Create doctor users and profiles
    for (const docData of doctorsData) {
      const existingUser = await db.findUserByEmail(docData.email);
      let userId;
      
      if (!existingUser) {
        const newUser = await db.addUser({
          name: docData.name,
          email: docData.email,
          password: pw,
          role: 'doctor',
          phone: docData.phone,
          address: `${docData.address1}\n${docData.address2}`,
          gender: docData.gender,
          dob: docData.dob
        });
        userId = newUser.id || newUser._id;
        console.log(`Doctor user created: ${docData.name}`);
      } else {
        userId = existingUser.id || existingUser._id;
      }

      // Check if doctor profile already exists
      const doctors = await db.listDoctors();
      const existingProfile = doctors.find(d => String(d.userId) === String(userId) || d.email === docData.email);
      
      if (!existingProfile) {
        await db.addDoctor({
          name: docData.name,
          specialty: docData.specialty,
          experience: docData.experience,
          fees: docData.fees,
          picture: docData.picture,
          about: docData.about,
          degree: docData.degree,
          address1: docData.address1,
          address2: docData.address2,
          userId: userId,
          available: true
        });
        console.log(`Doctor profile created: ${docData.name}`);
      }
    }

    // For backward compatibility, make the first doctor accessible via doctor@example.com
    const mainDoctor = await db.findUserByEmail('doctor@example.com');
    if (!mainDoctor) {
      const richardUser = await db.findUserByEmail('richard.james@example.com');
      if (richardUser) {
        await db.addUser({
          name: 'Dr. Richard James',
          email: 'doctor@example.com',
          password: pw,
          role: 'doctor',
          phone: '1234567890',
          address: '17 Cross, Richmond\nCircle, Ring Road, London',
          gender: 'Male',
          dob: '1985-05-15'
        });
        console.log('Main doctor login created: doctor@example.com');
      }
    }

    console.log('Seed complete!');
    console.log('Admin: admin@example.com / password123');
    console.log('Doctor: doctor@example.com / password123');
    console.log('Patient: patient@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

seed();
