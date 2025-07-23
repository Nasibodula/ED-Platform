const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Message = require('../models/Message');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional)
    const clearData = process.argv.includes('--clear');
    if (clearData) {
      await Course.deleteMany({});
      await Message.deleteMany({});
      console.log('🗑️  Cleared existing data');
    }

    // Get admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin found. Please run seedAdmin.js first');
      return;
    }

    // Create comprehensive courses
    const courses = [
      {
        title: 'Fundamentals of Oromo Language',
        description: 'A comprehensive introduction to Oromo language covering alphabet, basic vocabulary, and simple sentence structures.',
        instructor: 'Dr. Tolosa Gadisa',
        category: 'Basic Cushite',
        level: 'Beginner',
        language: 'Oromo',
        duration: '6 weeks',
        isPublished: true,
        lessons: [
          {
            title: 'Oromo Alphabet and Pronunciation',
            content: 'Learn the Oromo alphabet and proper pronunciation of letters.',
            order: 1,
            duration: '20:00'
          },
          {
            title: 'Basic Greetings and Introductions',
            content: 'Master essential greetings and how to introduce yourself.',
            order: 2,
            duration: '25:00'
          },
          {
            title: 'Numbers and Counting',
            content: 'Learn numbers from 1-100 and basic counting principles.',
            order: 3,
            duration: '18:00'
          }
        ],
        createdBy: admin._id
      },
      {
        title: 'Conversational Somali',
        description: 'Develop practical conversation skills in Somali for everyday situations.',
        instructor: 'Amina Hassan Farah',
        category: 'Intermediate Cushite',
        level: 'Intermediate',
        language: 'Somali',
        duration: '8 weeks',
        isPublished: true,
        lessons: [
          {
            title: 'Shopping and Market Conversations',
            content: 'Learn to navigate shopping situations in Somali.',
            order: 1,
            duration: '30:00'
          },
          {
            title: 'Family and Relationships',
            content: 'Vocabulary and phrases related to family members.',
            order: 2,
            duration: '28:00'
          }
        ],
        createdBy: admin._id
      },
      {
        title: 'Advanced Borana Grammar',
        description: 'Deep dive into complex grammatical structures of Borana Oromo.',
        instructor: 'Prof. Guyo Huka',
        category: 'Advanced Cushite',
        level: 'Advanced',
        language: 'Borana',
        duration: '10 weeks',
        isPublished: true,
        lessons: [
          {
            title: 'Complex Sentence Structures',
            content: 'Master advanced sentence formation and clause construction.',
            order: 1,
            duration: '45:00'
          }
        ],
        createdBy: admin._id
      }
    ];

    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Create sample students
    const students = [
      {
        name: 'Fatuma Mohammed',
        email: 'fatuma@example.com',
        password: 'student123',
        role: 'student',
        country: 'Kenya',
        preferences: { language: 'Oromo' }
      },
      {
        name: 'Ahmed Ali',
        email: 'ahmed@example.com',
        password: 'student123',
        role: 'student',
        country: 'Somalia',
        preferences: { language: 'Somali' }
      },
      {
        name: 'Dima Boru',
        email: 'dima@example.com',
        password: 'student123',
        role: 'student',
        country: 'Ethiopia',
        preferences: { language: 'Borana' }
      }
    ];

    const createdStudents = await User.insertMany(students);
    console.log(`✅ Created ${createdStudents.length} students`);

    // Enroll students in courses
    for (let i = 0; i < createdStudents.length; i++) {
      const student = createdStudents[i];
      const course = createdCourses[i % createdCourses.length];
      
      // Enroll student in course
      await student.enrollInCourse(course._id);
      await course.enrollStudent(student._id);
      
      console.log(`📚 Enrolled ${student.name} in ${course.title}`);
    }

    // Create sample messages
    const messages = [
      {
        studentId: createdStudents[0]._id,
        subject: 'Question about Oromo pronunciation',
        message: 'I need help with the pronunciation of certain letters in the Oromo alphabet.',
        type: 'course_request',
        priority: 'medium'
      },
      {
        studentId: createdStudents[1]._id,
        subject: 'Technical issue with video player',
        message: 'The video lessons are not loading properly on my browser.',
        type: 'technical',
        priority: 'high'
      }
    ];

    await Message.insertMany(messages);
    console.log(`✅ Created ${messages.length} sample messages`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Courses: ${createdCourses.length}`);
    console.log(`- Students: ${createdStudents.length}`);
    console.log(`- Messages: ${messages.length}`);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seedDatabase();