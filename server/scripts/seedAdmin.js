const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Message = require('../models/Message');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists:', existingAdmin.email);
      console.log('🔑 Email:', existingAdmin.email);
      console.log('🔑 Use existing password or reset if needed');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'CushLearn Admin',
      email: 'admin@cushite.com',
      password: 'admin123456', 
      role: 'admin',
      isActive: true,
      profilePicture: null,
      bio: 'Administrator of the CushLearn platform',
      country: 'Kenya',
      preferences: {
        language: 'English',
        notifications: true,
        theme: 'light',
        timezone: 'Africa/Nairobi'
      }
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@cushite.com');
    console.log('🔑 Password: admin123456');
    console.log('⚠️  Please change the password after first login');

    // Create some sample courses
    const sampleCourses = [
      {
        title: 'Basic Oromo Language',
        description: 'Learn the fundamentals of Oromo language including basic vocabulary, grammar, and conversation skills.',
        instructor: 'Obbo Gammachuu Tasfaayee',
        category: 'Basic Cushite',
        level: 'Beginner',
        language: 'Oromo',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
        duration: '8 weeks',
        isPublished: true,
        isPremium: false,
        price: 0,
        tags: ['oromo', 'basics', 'language', 'beginner'],
        requirements: ['No prior knowledge required', 'Access to internet for video lessons'],
        learningObjectives: [
          'Understand basic Oromo vocabulary',
          'Form simple sentences in Oromo',
          'Engage in basic conversations',
          'Read and write Oromo script'
        ],
        lessons: [
          {
            title: 'Introduction to Oromo',
            content: 'Welcome to the world of Oromo language learning.',
            order: 1,
            duration: '15:00',
            videoUrl: 'https://example.com/video1'
          },
          {
            title: 'Basic Greetings',
            content: 'Learn essential greetings and polite expressions.',
            order: 2,
            duration: '20:00',
            videoUrl: 'https://example.com/video2'
          }
        ],
        createdBy: admin._id
      },
      {
        title: 'Somali Conversation Skills',
        description: 'Improve your Somali speaking abilities with practical conversation exercises and real-world scenarios.',
        instructor: 'Ust. Cali Maxamed',
        category: 'Intermediate Cushite',
        level: 'Intermediate',
        language: 'Somali',
        thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        duration: '6 weeks',
        isPublished: true,
        isPremium: false,
        price: 0,
        tags: ['somali', 'conversation', 'intermediate', 'speaking'],
        requirements: ['Basic Somali knowledge', 'Microphone for practice sessions'],
        learningObjectives: [
          'Hold everyday conversations in Somali',
          'Express opinions and preferences',
          'Understand cultural context in communication',
          'Improve pronunciation and fluency'
        ],
        lessons: [
          {
            title: 'Daily Conversations',
            content: 'Practice common daily conversation scenarios.',
            order: 1,
            duration: '25:00',
            videoUrl: 'https://example.com/somali1'
          },
          {
            title: 'Cultural Context',
            content: 'Understanding cultural nuances in Somali communication.',
            order: 2,
            duration: '30:00',
            videoUrl: 'https://example.com/somali2'
          }
        ],
        createdBy: admin._id
      },
      {
        title: 'Cultural Studies: Horn of Africa',
        description: 'Explore the rich cultural heritage of the Horn of Africa region, including traditions, history, and customs.',
        instructor: 'Dr. Fatima Hassan',
        category: 'Culture',
        level: 'Advanced',
        language: 'Mixed',
        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
        duration: '12 weeks',
        isPublished: true,
        isPremium: true,
        price: 49.99,
        tags: ['culture', 'history', 'traditions', 'horn of africa'],
        requirements: ['Interest in cultural studies', 'Basic knowledge of the region'],
        learningObjectives: [
          'Understand historical development of the region',
          'Appreciate cultural diversity and similarities',
          'Learn about traditional practices and beliefs',
          'Analyze contemporary cultural changes'
        ],
        lessons: [
          {
            title: 'Historical Overview',
            content: 'Introduction to the history of the Horn of Africa.',
            order: 1,
            duration: '45:00',
            videoUrl: 'https://example.com/culture1'
          },
          {
            title: 'Traditional Practices',
            content: 'Exploring traditional customs and practices.',
            order: 2,
            duration: '40:00',
            videoUrl: 'https://example.com/culture2'
          }
        ],
        createdBy: admin._id
      }
    ];

    const createdCourses = await Course.insertMany(sampleCourses);
    console.log(`✅ Created ${createdCourses.length} sample courses`);

    // Create sample students
    const sampleStudents = [
      {
        name: 'Amina Hassan',
        email: 'amina.hassan@example.com',
        password: 'student123',
        role: 'student',
        country: 'Kenya',
        preferences: {
          language: 'Oromo',
          notifications: true,
          theme: 'light'
        }
      },
      {
        name: 'Mohamed Ali',
        email: 'mohamed.ali@example.com',
        password: 'student123',
        role: 'student',
        country: 'Somalia',
        preferences: {
          language: 'Somali',
          notifications: true,
          theme: 'light'
        }
      },
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: 'student123',
        role: 'student',
        country: 'United States',
        preferences: {
          language: 'English',
          notifications: false,
          theme: 'dark'
        }
      }
    ];

    const createdStudents = await User.insertMany(sampleStudents);
    console.log(`✅ Created ${createdStudents.length} sample students`);

    // Enroll some students in courses
    for (let i = 0; i < Math.min(createdStudents.length, createdCourses.length); i++) {
      const student = createdStudents[i];
      const course = createdCourses[i];
      
      // Add course to student's enrolled courses
      student.enrolledCourses.push({
        courseId: course._id,
        enrolledAt: new Date(),
        progress: Math.floor(Math.random() * 80) + 20, // Random progress between 20-100
        lastAccessed: new Date()
      });
      
      // Add student to course's enrolled students
      course.enrolledStudents.push({
        studentId: student._id,
        enrolledAt: new Date(),
        progress: student.enrolledCourses[student.enrolledCourses.length - 1].progress
      });
      
      await student.save();
      await course.save();
    }

    console.log('✅ Enrolled students in sample courses');

    // Create sample messages
    const sampleMessages = [
      {
        studentId: createdStudents[0]._id,
        subject: 'Request for Advanced Oromo Course',
        message: 'I have completed the basic Oromo course and would like to know when an advanced course will be available. I am particularly interested in advanced grammar and literature.',
        type: 'course_request',
        priority: 'medium',
        status: 'pending',
        requestedCourse: {
          title: 'Advanced Oromo Literature',
          description: 'Deep dive into Oromo poetry and prose',
          category: 'Advanced Cushite',
          language: 'Oromo'
        }
      },
      {
        studentId: createdStudents[1]._id,
        subject: 'Technical Issue with Video Playback',
        message: 'I am experiencing problems with video playback on mobile devices. The videos stop loading after a few seconds. Please help.',
        type: 'technical',
        priority: 'high',
        status: 'in_progress',
        adminResponse: 'We are aware of this issue and working on a fix. Please try clearing your browser cache as a temporary solution.',
        respondedBy: admin._id,
        respondedAt: new Date()
      },
      {
        studentId: createdStudents[2]._id,
        subject: 'Great Platform!',
        message: 'I just wanted to say thank you for creating this wonderful platform. Learning Cushitic languages has never been easier!',
        type: 'general',
        priority: 'low',
        status: 'resolved',
        adminResponse: 'Thank you so much for your kind words! We are thrilled that you are enjoying your learning experience.',
        respondedBy: admin._id,
        respondedAt: new Date()
      }
    ];

    const createdMessages = await Message.insertMany(sampleMessages);
    console.log(`✅ Created ${createdMessages.length} sample messages`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • 1 Admin user created`);
    console.log(`   • ${createdStudents.length} Sample students created`);
    console.log(`   • ${createdCourses.length} Sample courses created`);
    console.log(`   • ${createdMessages.length} Sample messages created`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin:');
    console.log('   Email: admin@cushite.com');
    console.log('   Password: admin123456');
    console.log('\n   Sample Students:');
    createdStudents.forEach(student => {
      console.log(`   Email: ${student.email}`);
      console.log(`   Password: student123`);
    });
    
    console.log('\n⚠️  SECURITY NOTICE:');
    console.log('   Please change all default passwords in production!');
    console.log('   Consider enabling 2FA for admin accounts.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Handle script execution
if (require.main === module) {
  console.log('🌱 Starting database seeding...\n');
  seedAdmin();
}

module.exports = seedAdmin;