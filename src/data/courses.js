// Course translations and data
export const translations = {
  oromo: {
    title: 'Barnoota Keenyaa',
    subtitle: 'Afaan Oromoo fi barnootaan guddachuu',
    categories: {
      all: 'Hunda',
      language: 'Afaan',
      education: 'Barnootaa'
    },
    courseDetails: {
      duration: 'Yeroo',
      students: 'Barattoota',
      lessons: 'Barnoota',
      level: 'Sadarkaa',
      instructor: 'Barsiisaa',
      description: 'Ibsa',
      startCourse: 'Barnoota Jalqabi',
      watchOnYoutube: 'YouTube irratti Ilaali',
      backToCourses: 'Gara Barnootaatti Deebi\'i',
      courseContent: 'Qabiyyee Barnoota'
    },
    levels: {
      beginner: 'Jalqabaa',
      intermediate: 'Giddu-galeessa',
      advanced: 'Olaanaa'
    }
  },
  somali: {
    title: 'Koorsaskeenna',
    subtitle: 'Af-Soomaali iyo waxbarasho horumarinta',
    categories: {
      all: 'Dhammaantood',
      language: 'Luqad',
      education: 'Waxbarasho'
    },
    courseDetails: {
      duration: 'Muddo',
      students: 'Ardayda',
      lessons: 'Casharrada',
      level: 'Heer',
      instructor: 'Macalin',
      description: 'Sharax',
      startCourse: 'Bilow Koorsada',
      watchOnYoutube: 'Ka daawo YouTube',
      backToCourses: 'Ku noqo Koorsaska',
      courseContent: 'Nuxurka Koorsada'
    },
    levels: {
      beginner: 'Bilowga',
      intermediate: 'Dhexe',
      advanced: 'Horumarsan'
    }
  }
};

// Helper function to extract YouTube video ID
export const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Oromo courses data with nested lessons
export const oromoCourses = [
  {
    id: 1,
    title: 'Afaan Oromoo beginner',
    category: 'language',
    description: 'Qubee, jecha fi hima baratta',
    instructor: 'Obbo Gammachuu Tasfaayee',
    duration: '8',
    students: '1,234',
    lessons: '12',
    level: 'beginner',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
    videos: [
      {
        id: 'v1',
        title: 'Qubee Afaan Oromoo - Qubee Jalqabaa',
        duration: '3:18',
        youtubeUrl: 'https://www.youtube.com/watch?v=sqsrm4O_hic&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd', // Replace with actual URLs
        description: 'Qubee Afaan Oromoo barnoota jalqabaa'
      },
      {
        id: 'v2',
        title: 'Jecha Jalqabaa - Maqaa fi Gochaa',
        duration: '5:07',
        youtubeUrl: 'https://www.youtube.com/watch?v=ONdTzCapCKg&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=2',
        description: 'Jecha jalqabaa fi akkaataa itti fayyadamnu'
      },
      {
        id: 'v3',
        title: 'Hima Uumuu - Jalqaba',
        duration: '3:43',
        youtubeUrl: 'https://www.youtube.com/watch?v=vRHD2xB5uck&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=3',
        description: 'Hima salphaa akkaataa uumnu'
      },
      {
        id: 'v4',
        title: 'Dubbisuu fi Barreessuu',
        duration: '5:50',
        youtubeUrl: 'https://www.youtube.com/watch?v=zMm5ujN7xao&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=4',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v5',
        title: 'Dubbisuu fi Barreessuu',
        duration: '3:32',
        youtubeUrl: 'https://www.youtube.com/watch?v=fhg0AHe3LTc&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=5',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
     {
        id: 'v6',
        title: 'Dubbisuu fi Barreessuu',
        duration: '2:29',
        youtubeUrl: 'https://www.youtube.com/watch?v=vhSnDG5FhH4&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=6',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v7',
        title: 'Dubbisuu fi Barreessuu',
        duration: '5:52',
        youtubeUrl: 'https://www.youtube.com/watch?v=MkPFZcIFQSk&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=7',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v8',
        title: 'Dubbisuu fi Barreessuu',
        duration: '6:08',
        youtubeUrl: 'https://www.youtube.com/watch?v=xcn556K8hqo&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=8',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v9',
        title: 'Dubbisuu fi Barreessuu',
        duration: '3:17',
        youtubeUrl: 'https://www.youtube.com/watch?v=ozZbCzRo47Q&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=9',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v10',
        title: 'Dubbisuu fi Barreessuu',
        duration: '3:39',
        youtubeUrl: 'https://www.youtube.com/watch?v=Z6yKURRHkyU&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=10',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v11',
        title: 'Dubbisuu fi Barreessuu',
        duration: '2:26',
        youtubeUrl: 'https://www.youtube.com/watch?v=Bz-lXycQQmc&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=11',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v12',
        title: 'Dubbisuu fi Barreessuu',
        duration: '5:41',
        youtubeUrl: 'https://www.youtube.com/watch?v=XQETlnG3DnY&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=12',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v13',
        title: 'Dubbisuu fi Barreessuu',
        duration: '2:40',
        youtubeUrl: 'https://www.youtube.com/watch?v=yYYQ8HWL9X8&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=13',
        description: 'Dubbisuu fi barreessuu barnoota'
      },
      {
        id: 'v14',
        title: 'Dubbisuu fi Barreessuu',
        duration: '3:01',
        youtubeUrl: 'https://www.youtube.com/watch?v=8XofJCuQzNU&list=PLiGk7GTSSgU8bSXRHmEPrYOKfRw5J8Trd&index=14',
        description: 'Dubbisuu fi barreessuu barnoota'
      }
    ]
  },
  {
    id: 2,
    title: 'Afaan Oromoo intermediate',
    category: 'language',
    description: 'Hima walxaxaa fi mata duree',
    instructor: 'Add. Caaltuu Sanbatuu',
    duration: '12',
    students: '856',
    lessons: '18',
    level: 'intermediate',
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    videos: [
      {
        id: 'v1',
        title: 'Seerluga Afaan Oromoo',
        duration: '5:29',
        youtubeUrl: 'https://www.youtube.com/watch?v=cQ4_lYFJUCs&list=PLiGk7GTSSgU-UJO1o_lD4EkqFf-eCJFm8',
        description: 'Seerluga afaan Oromoo barnoota'
      },
      {
        id: 'v2',
        title: 'Hima Walxaxaa',
        duration: '6:14',
        youtubeUrl: 'https://www.youtube.com/watch?v=WWxlK11hAaY&list=PLiGk7GTSSgU-UJO1o_lD4EkqFf-eCJFm8&index=2',
        description: 'Hima walxaxaa uumuu fi hubachuu'
      },
            {
        id: 'v3',
        title: 'Seerluga Afaan Oromoo',
        duration: '6:38',
        youtubeUrl: 'https://www.youtube.com/watch?v=jCmbYx0xj1k&list=PLiGk7GTSSgU-UJO1o_lD4EkqFf-eCJFm8&index=3',
        description: 'Seerluga afaan Oromoo barnoota'
      },
      {
        id: 'v4',
        title: 'Hima Walxaxaa',
        duration: '7:39',
        youtubeUrl: 'https://www.youtube.com/watch?v=rSobMkEwk8M&list=PLiGk7GTSSgU-UJO1o_lD4EkqFf-eCJFm8&index=4',
        description: 'Hima walxaxaa uumuu fi hubachuu'
      },
            {
        id: 'v5',
        title: 'Seerluga Afaan Oromoo',
        duration: '4:55',
        youtubeUrl: 'https://www.youtube.com/watch?v=_AUuLmz0OPs&list=PLiGk7GTSSgU-UJO1o_lD4EkqFf-eCJFm8&index=5',
        description: 'Seerluga afaan Oromoo barnoota'
      },
      {
        id: 'v6',
        title: 'Hima Walxaxaa',
        duration: '13:56',
        youtubeUrl: 'https://www.youtube.com/watch?v=5ZSil0mqKOw&list=PLiGk7GTSSgU-UJO1o_lD4EkqFf-eCJFm8&index=6',
        description: 'Hima walxaxaa uumuu fi hubachuu'
      },
            {
        id: 'v7',
        title: 'Seerluga Afaan Oromoo',
        duration: '5:50',
        youtubeUrl: 'https://www.youtube.com/watch?v=dpbMRajwZJY&list=PLiGk7GTSSgU-UJO1o_lD4EkqFf-eCJFm8&index=7',
        description: 'Seerluga afaan Oromoo barnoota'
      }
    ]
  },
  {
    id: 3,
    title: 'Barnoota Ammayyaa',
    category: 'education',
    description: 'Teeknooloojii fi tooftaa haaraa',
    instructor: 'Dr. Abeebaa Wayyanaa',
    duration: '10',
    students: '678',
    lessons: '15',
    level: 'advanced',
    rating: 4.7,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
    videos: [
      {
        id: 'v7',
        title: 'Teeknooloojii Barnoota',
        duration: '30:15',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Teeknooloojii haaraa barnoota keessatti'
      }
    ]
  }
];

// Somali courses data with nested lessons
export const somaliCourses = [
  {
    id: 4,
    title: 'Af-Soomaali beginner',
    category: 'language',
    description: 'Xarfaha, ereyada iyo jumlada',
    instructor: 'Ust. Cali Maxamed',
    duration: '6',
    students: '2,103',
    lessons: '10',
    level: 'beginner',
    rating: 4.7,
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    videos: [
      {
        id: 'v1',
        title: 'Xarfaha Af-Soomaaliga - Bilowga',
        duration: '14:36',
        youtubeUrl: 'https://www.youtube.com/watch?v=2bGS2B5y9OQ&list=PLjpETFXflReRJ_7uH451G6SBkeBdElymr&index=12',
        description: 'Xarfaha Af-Soomaaliga barashada bilowga'
      },
      {
        id: 'v2',
        title: 'Ereyada Aasaasiga ah',
        duration: '11:57',
        youtubeUrl: 'https://www.youtube.com/watch?v=kCWyeYeFSq8&list=PLjpETFXflReRJ_7uH451G6SBkeBdElymr&index=11',
        description: 'Ereyada aasaasiga ah ee maalinlaha'
      },
      {
        id: 'v3',
        title: 'Jumlado Fudud',
        duration: '15:35',
        youtubeUrl: 'https://www.youtube.com/watch?v=AhJ4Mc696eY&list=PLjpETFXflReRJ_7uH451G6SBkeBdElymr&index=10',
        description: 'Jumlado fudud dhisid iyo isticmaalka'
      },
      {
        id: 'v4',
        title: 'Xarfaha Af-Soomaaliga - Bilowga',
        duration: '16:18',
        youtubeUrl: 'https://www.youtube.com/watch?v=t15KY7w3ZtA&list=PLjpETFXflReRJ_7uH451G6SBkeBdElymr&index=9',
        description: 'Xarfaha Af-Soomaaliga barashada bilowga'
      },
      {
        id: 'v5',
        title: 'Ereyada Aasaasiga ah',
        duration: '24:29',
        youtubeUrl: 'https://www.youtube.com/watch?v=zJvcHFNfPPc&list=PLjpETFXflReRJ_7uH451G6SBkeBdElymr&index=8',
        description: 'Ereyada aasaasiga ah ee maalinlaha'
      },
      {
        id: 'v6',
        title: 'Jumlado Fudud',
        duration: '26:54',
        youtubeUrl: 'https://www.youtube.com/watch?v=ZUUVr5uaJlg&list=PLjpETFXflReRJ_7uH451G6SBkeBdElymr&index=6',
        description: 'Jumlado fudud dhisid iyo isticmaalka'
      },
      {
        id: 'v7',
        title: 'Jumlado Fudud',
        duration: '19:54',
        youtubeUrl: 'https://www.youtube.com/watch?v=98R6RrCmeFs&list=PLjpETFXflReRJ_7uH451G6SBkeBdElymr&index=5',
        description: 'Jumlado fudud dhisid iyo isticmaalka'
      },
      {
        id: 'v8',
        title: 'Jumlado Fudud',
        duration: '34:25',
        youtubeUrl: 'https://www.youtube.com/watch?v=3paCD0GqrQ4&list=PLjpETFXflReRJ_7uH451G6SBkeBdElymr&index=4',
        description: 'Jumlado fudud dhisid iyo isticmaalka'
      },
      
    ]
  },
  {
    id: 5,
    title: 'Af-Soomaali intermediate',
    category: 'language',
    description: 'Jumlado adag iyo mawduucyo',
    instructor: 'Md. Khadiija Axmed',
    duration: '10',
    students: '1,456',
    lessons: '15',
    level: 'intermediate',
    rating: 4.6,
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    videos: [
      {
        id: 'v123',
        title: 'Naxwaha Af-Soomaaliga',
        duration: '11:42',
        youtubeUrl: 'https://www.youtube.com/watch?v=UFoAjLYg9mI',
        description: 'Naxwaha iyo xeerarka af-Soomaaliga'
      },
      {
        id: 'v456',
        title: 'Naxwaha Af-Soomaaliga',
        duration: '10:17',
        youtubeUrl: 'https://www.youtube.com/watch?v=XyDRaRXaC_w',
        description: 'Naxwaha iyo xeerarka af-Soomaaliga',
        startTime: 225,
        endTime: 456
      },
      {
        id: 'v789',
        title: 'Naxwaha Af-Soomaaliga',
        duration: '12:28',
        youtubeUrl: 'https://www.youtube.com/watch?v=EfRTqBi7yFQ',
        description: 'Naxwaha iyo xeerarka af-Soomaaliga'
      },
      {
        id: 'v101112',
        title: 'Naxwaha Af-Soomaaliga',
        duration: '13:20',
        youtubeUrl: 'https://www.youtube.com/watch?v=qAuUF44kcyc',
        description: 'Naxwaha iyo xeerarka af-Soomaaliga'
      }
    ]
  }
];

// Helper function to get courses by language
export const getCoursesByLanguage = (language) => {
  return language === 'oromo' ? oromoCourses : somaliCourses;
};

// Helper function to find a course by ID
export const getCourseById = (courseId, language) => {
  const courses = getCoursesByLanguage(language);
  return courses.find(course => course.id === parseInt(courseId));
};