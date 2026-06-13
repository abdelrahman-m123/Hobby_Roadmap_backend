const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Roadmap = require('./models/Roadmap');
const Resource = require('./models/Resource');
const Quiz = require('./models/Quiz');
const QuizAttempt = require('./models/QuizAttempt');
const FlashcardSet = require('./models/FlashcardSet');

dotenv.config();

// SVG Icons for categories (stored as strings)
const categoryIcons = {
  'Web Development': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M10.5 14.5 8 12l2.5-2.5"/><path d="M13.5 9.5 16 12l-2.5 2.5"/></svg>`,
  'Data Science': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="M9 10.5 12 9l3 1.5"/><path d="M9 13.5 12 15l3-1.5"/></svg>`,
  'Mobile Development': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Roadmap.deleteMany(),
      Resource.deleteMany(),
      Quiz.deleteMany(),
      QuizAttempt.deleteMany(),
      FlashcardSet.deleteMany(),
    ]);

    console.log('Creating admin user...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@email.com',
      password: 'adminpassword',
      role: 'admin',
    });

    console.log('Creating sample users...');
    const beginnerUser = await User.create({
      username: 'beginner_coder',
      email: 'beginner@example.com',
      password: 'userpassword',
      role: 'user',
      savedRoadmaps: [],
      progress: [],
    });

    const advancedUser = await User.create({
      username: 'advanced_dev',
      email: 'advanced@example.com',
      password: 'userpassword',
      role: 'user',
      savedRoadmaps: [],
      progress: [],
    });

    console.log('Creating categories...');
    const webCategory = await Category.create({
      name: 'Web Development',
      slug: 'web-development',
      description: 'Complete web development from frontend to backend and everything in between.',
      icon: categoryIcons['Web Development'],
      createdBy: adminUser._id,
    });

    const dataScienceCategory = await Category.create({
      name: 'Data Science',
      slug: 'data-science',
      description: 'Learn data analysis, machine learning, and AI fundamentals.',
      icon: categoryIcons['Data Science'],
      createdBy: adminUser._id,
    });

    const mobileCategory = await Category.create({
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'Build iOS and Android apps with modern frameworks.',
      icon: categoryIcons['Mobile Development'],
      createdBy: adminUser._id,
    });

    console.log('Creating comprehensive Full Stack Web Development roadmap...');
    
    // First create resources, then assign them to stages
    const fullStackRoadmap = await Roadmap.create({
      title: 'Ultimate Full Stack Web Development',
      slug: 'ultimate-full-stack-web-development',
      description: 'The most comprehensive roadmap to becoming a full-stack web developer. Master frontend, backend, databases, DevOps, and deployment with real-world projects.',
      category: webCategory._id,
      coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      difficulty: 'intermediate',
      stages: [
        {
          title: 'Frontend Fundamentals',
          description: 'Master the core technologies of the web: HTML, CSS, and JavaScript.',
          order: 1,
          resources: [],
        },
        {
          title: 'Advanced Frontend Frameworks',
          description: 'Learn React, Next.js, and modern frontend architecture patterns.',
          order: 2,
          resources: [],
        },
        {
          title: 'Backend Development',
          description: 'Build robust APIs and server-side applications with Node.js and Express.',
          order: 3,
          resources: [],
        },
        {
          title: 'Database Management',
          description: 'Work with SQL, NoSQL databases, and database design patterns.',
          order: 4,
          resources: [],
        },
        {
          title: 'DevOps & Cloud Deployment',
          description: 'Deploy, scale, and monitor applications using Docker and cloud platforms.',
          order: 5,
          resources: [],
        },
      ],
      estimatedTime: '6-8 months',
      tags: ['full-stack', 'javascript', 'react', 'nodejs', 'mongodb', 'express', 'docker'],
      isPublished: true,
      createdBy: adminUser._id,
      enrolledCount: 2547,
    });

    console.log('Creating resources for Stage 1: Frontend Fundamentals...');
    
    const stage1Resources = await Resource.create([
      {
        title: 'HTML5 Masterclass: The Complete Guide',
        description: 'Comprehensive HTML5 course covering semantics, forms, multimedia, and modern APIs.',
        type: 'youtube',
        url: 'https://youtu.be/mJgBOIoGihA',
        youtubeId: 'mJgBOIoGihA',
        duration: '6.5 hours',
        roadmap: fullStackRoadmap._id,
        order: 1,
        stage: 'Frontend Fundamentals',
        tags: ['html5', 'semantics', 'accessibility'],
        createdBy: adminUser._id,
      },
      {
        title: 'CSS3: The Complete Guide to Modern CSS',
        description: 'Master CSS3 including Flexbox, Grid, animations, and responsive design.',
        type: 'youtube',
        url: 'https://youtu.be/1Rs2ND1ryYc',
        youtubeId: '1Rs2ND1ryYc',
        duration: '12 hours',
        roadmap: fullStackRoadmap._id,
        order: 2,
        stage: 'Frontend Fundamentals',
        tags: ['css3', 'flexbox', 'grid', 'responsive'],
        createdBy: adminUser._id,
      },
      {
        title: 'JavaScript: The Complete Guide',
        description: 'Deep dive into JavaScript including ES6+, async programming, and modern patterns.',
        type: 'pdf',
        url: 'https://example.com/javascript-complete-guide.pdf',
        roadmap: fullStackRoadmap._id,
        order: 3,
        stage: 'Frontend Fundamentals',
        tags: ['javascript', 'es6', 'async'],
        createdBy: adminUser._id,
      },
      {
        title: 'Responsive Web Design Guide',
        description: 'Learn to build websites that work perfectly on all devices.',
        type: 'pdf',
        url: 'https://example.com/responsive-design-guide.pdf',
        roadmap: fullStackRoadmap._id,
        order: 4,
        stage: 'Frontend Fundamentals',
        tags: ['responsive', 'mobile-first'],
        createdBy: adminUser._id,
      },
      {
        title: 'Git & GitHub Mastery',
        description: 'Learn Git fundamentals, branching strategies, and collaboration workflows.',
        type: 'youtube',
        url: 'https://youtu.be/RGOj5lHIXsk',
        youtubeId: 'RGOj5lHIXsk',
        duration: '3 hours',
        roadmap: fullStackRoadmap._id,
        order: 5,
        stage: 'Frontend Fundamentals',
        tags: ['git', 'github', 'version-control'],
        createdBy: adminUser._id,
      },
    ]);

    console.log('Creating resources for Stage 2: Advanced Frontend Frameworks...');
    
    const stage2Resources = await Resource.create([
      {
        title: 'React - The Complete Guide',
        description: 'Master React including Hooks, Context API, and performance optimization.',
        type: 'youtube',
        url: 'https://youtu.be/bMknfKXIFA8',
        youtubeId: 'bMknfKXIFA8',
        duration: '18 hours',
        roadmap: fullStackRoadmap._id,
        order: 1,
        stage: 'Advanced Frontend Frameworks',
        tags: ['react', 'hooks', 'context'],
        createdBy: adminUser._id,
      },
      {
        title: 'State Management with Redux Toolkit',
        description: 'Learn Redux Toolkit for managing complex application state.',
        type: 'youtube',
        url: 'https://youtu.be/bbkBuqC1rU4',
        youtubeId: 'bbkBuqC1rU4',
        duration: '8 hours',
        roadmap: fullStackRoadmap._id,
        order: 2,
        stage: 'Advanced Frontend Frameworks',
        tags: ['redux', 'state-management'],
        createdBy: adminUser._id,
      },
      {
        title: 'TypeScript for React Developers',
        description: 'Learn TypeScript from basics to advanced patterns.',
        type: 'pdf',
        url: 'https://example.com/typescript-guide.pdf',
        roadmap: fullStackRoadmap._id,
        order: 3,
        stage: 'Advanced Frontend Frameworks',
        tags: ['typescript', 'types'],
        createdBy: adminUser._id,
      },
      {
        title: 'Next.js 14: The React Framework',
        description: 'Learn App Router, Server Components, and full-stack Next.js.',
        type: 'youtube',
        url: 'https://youtu.be/9P8m330RErM',
        youtubeId: '9P8m330RErM',
        duration: '10 hours',
        roadmap: fullStackRoadmap._id,
        order: 4,
        stage: 'Advanced Frontend Frameworks',
        tags: ['nextjs', 'ssr', 'ssg'],
        createdBy: adminUser._id,
      },
    ]);

    console.log('Creating resources for Stage 3: Backend Development...');
    
    const stage3Resources = await Resource.create([
      {
        title: 'Node.js & Express.js Masterclass',
        description: 'Build RESTful APIs with Node.js and Express.',
        type: 'youtube',
        url: 'https://youtu.be/Oe421EPjeBE',
        youtubeId: 'Oe421EPjeBE',
        duration: '15 hours',
        roadmap: fullStackRoadmap._id,
        order: 1,
        stage: 'Backend Development',
        tags: ['nodejs', 'express', 'rest-api'],
        createdBy: adminUser._id,
      },
      {
        title: 'Authentication & Authorization Guide',
        description: 'Implement JWT, OAuth, and session management.',
        type: 'pdf',
        url: 'https://example.com/auth-guide.pdf',
        roadmap: fullStackRoadmap._id,
        order: 2,
        stage: 'Backend Development',
        tags: ['auth', 'jwt', 'oauth'],
        createdBy: adminUser._id,
      },
      {
        title: 'REST API Design Best Practices',
        description: 'Learn to design scalable and maintainable APIs.',
        type: 'pdf',
        url: 'https://example.com/api-design-best-practices.pdf',
        roadmap: fullStackRoadmap._id,
        order: 3,
        stage: 'Backend Development',
        tags: ['rest', 'api-design'],
        createdBy: adminUser._id,
      },
      {
        title: 'WebSockets & Real-time Communication',
        description: 'Build real-time features with Socket.io.',
        type: 'youtube',
        url: 'https://youtu.be/ZKEqqIO7n-k',
        youtubeId: 'ZKEqqIO7n-k',
        duration: '2 hours',
        roadmap: fullStackRoadmap._id,
        order: 4,
        stage: 'Backend Development',
        tags: ['websockets', 'realtime'],
        createdBy: adminUser._id,
      },
    ]);

    console.log('Creating resources for Stage 4: Database Management...');
    
    const stage4Resources = await Resource.create([
      {
        title: 'MongoDB - The Complete Guide',
        description: 'Master NoSQL databases with MongoDB and Mongoose.',
        type: 'youtube',
        url: 'https://youtu.be/cCI18qAoKq4',
        youtubeId: 'cCI18qAoKq4',
        duration: '12 hours',
        roadmap: fullStackRoadmap._id,
        order: 1,
        stage: 'Database Management',
        tags: ['mongodb', 'mongoose', 'nosql'],
        createdBy: adminUser._id,
      },
      {
        title: 'PostgreSQL for Beginners',
        description: 'Learn relational databases and advanced SQL queries.',
        type: 'youtube',
        url: 'https://youtu.be/qw--VYLpxG4',
        youtubeId: 'qw--VYLpxG4',
        duration: '8 hours',
        roadmap: fullStackRoadmap._id,
        order: 2,
        stage: 'Database Management',
        tags: ['postgresql', 'sql'],
        createdBy: adminUser._id,
      },
      {
        title: 'Database Design & Optimization',
        description: 'Learn indexing, query optimization, and schema design.',
        type: 'pdf',
        url: 'https://example.com/db-design-optimization.pdf',
        roadmap: fullStackRoadmap._id,
        order: 3,
        stage: 'Database Management',
        tags: ['db-design', 'optimization'],
        createdBy: adminUser._id,
      },
      {
        title: 'Redis for Caching',
        description: 'Implement caching and real-time data with Redis.',
        type: 'youtube',
        url: 'https://youtu.be/oop8BZkRJak',
        youtubeId: 'oop8BZkRJak',
        duration: '5 hours',
        roadmap: fullStackRoadmap._id,
        order: 4,
        stage: 'Database Management',
        tags: ['redis', 'caching'],
        createdBy: adminUser._id,
      },
    ]);

    console.log('Creating resources for Stage 5: DevOps & Cloud Deployment...');
    
    const stage5Resources = await Resource.create([
      {
        title: 'Docker & Containerization Mastery',
        description: 'Containerize applications and manage multi-container setups.',
        type: 'youtube',
        url: 'https://youtu.be/fqMOX6JJhGo',
        youtubeId: 'fqMOX6JJhGo',
        duration: '10 hours',
        roadmap: fullStackRoadmap._id,
        order: 1,
        stage: 'DevOps & Cloud Deployment',
        tags: ['docker', 'containers'],
        createdBy: adminUser._id,
      },
      {
        title: 'CI/CD with GitHub Actions',
        description: 'Automate testing and deployment pipelines.',
        type: 'youtube',
        url: 'https://youtu.be/R8_veQiYBjI',
        youtubeId: 'R8_veQiYBjI',
        duration: '6 hours',
        roadmap: fullStackRoadmap._id,
        order: 2,
        stage: 'DevOps & Cloud Deployment',
        tags: ['cicd', 'github-actions'],
        createdBy: adminUser._id,
      },
      {
        title: 'AWS Cloud Deployment Guide',
        description: 'Deploy applications to AWS using EC2, S3, and RDS.',
        type: 'pdf',
        url: 'https://example.com/aws-deployment.pdf',
        roadmap: fullStackRoadmap._id,
        order: 3,
        stage: 'DevOps & Cloud Deployment',
        tags: ['aws', 'cloud'],
        createdBy: adminUser._id,
      },
      {
        title: 'Monitoring & Logging',
        description: 'Implement observability with Prometheus and Grafana.',
        type: 'youtube',
        url: 'https://youtu.be/h4Sl21AKiDg',
        youtubeId: 'h4Sl21AKiDg',
        duration: '8 hours',
        roadmap: fullStackRoadmap._id,
        order: 4,
        stage: 'DevOps & Cloud Deployment',
        tags: ['monitoring', 'logging'],
        createdBy: adminUser._id,
      },
    ]);

    // Assign resources to stages
    fullStackRoadmap.stages[0].resources = stage1Resources.map(r => r._id);
    fullStackRoadmap.stages[1].resources = stage2Resources.map(r => r._id);
    fullStackRoadmap.stages[2].resources = stage3Resources.map(r => r._id);
    fullStackRoadmap.stages[3].resources = stage4Resources.map(r => r._id);
    fullStackRoadmap.stages[4].resources = stage5Resources.map(r => r._id);
    await fullStackRoadmap.save();

    console.log('Creating quizzes for each stage...');
    
    // Quiz for Stage 1 (associated with roadmap)
    const frontendQuiz = await Quiz.create({
      title: 'Frontend Fundamentals Quiz',
      description: 'Test your knowledge of HTML5, CSS3, and JavaScript fundamentals.',
      resource: stage1Resources[0]._id,
      roadmap: fullStackRoadmap._id,
      passingScore: 70,
      questions: [
        {
          question: 'What does HTML stand for?',
          options: [
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Hyper Transfer Markup Language',
            'Home Tool Markup Language',
          ],
          correctOption: 0,
          explanation: 'HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.',
        },
        {
          question: 'Which CSS property creates space between elements?',
          options: ['margin', 'padding', 'spacing', 'gap'],
          correctOption: 0,
          explanation: 'Margin creates space outside the element border.',
        },
        {
          question: 'How do you declare a variable in JavaScript?',
          options: ['var myVar;', 'let myVar;', 'const myVar;', 'All of the above'],
          correctOption: 3,
          explanation: 'JavaScript has three ways to declare variables: var, let, and const.',
        },
        {
          question: 'What is CSS Flexbox used for?',
          options: [
            'Creating responsive one-dimensional layouts',
            'Styling text',
            'Adding animations',
            'Creating 3D effects',
          ],
          correctOption: 0,
          explanation: 'Flexbox is a one-dimensional layout model for responsive designs.',
        },
      ],
      createdBy: adminUser._id,
    });

    // Quiz for Stage 2 (associated with roadmap)
    const reactQuiz = await Quiz.create({
      title: 'React & Modern Frontend Quiz',
      description: 'Test your knowledge of React, hooks, and modern frontend development.',
      resource: stage2Resources[0]._id,
      roadmap: fullStackRoadmap._id,
      passingScore: 70,
      questions: [
        {
          question: 'What is a React Hook?',
          options: [
            'A function that lets you use state in functional components',
            'A CSS-in-JS solution',
            'A build tool',
            'A testing library',
          ],
          correctOption: 0,
          explanation: 'Hooks let you use state and other React features in functional components.',
        },
        {
          question: 'Which hook is used for side effects?',
          options: ['useState', 'useEffect', 'useContext', 'useReducer'],
          correctOption: 1,
          explanation: 'useEffect handles side effects like data fetching and subscriptions.',
        },
        {
          question: 'What is the virtual DOM?',
          options: [
            'A lightweight copy of the actual DOM',
            'A database for React',
            'A CSS preprocessor',
            'A testing environment',
          ],
          correctOption: 0,
          explanation: 'The virtual DOM is a lightweight representation of the actual DOM.',
        },
      ],
      createdBy: adminUser._id,
    });

    // Quiz for Stage 3 (associated with roadmap)
    const backendQuiz = await Quiz.create({
      title: 'Backend Development Quiz',
      description: 'Test your knowledge of Node.js, Express, and backend concepts.',
      resource: stage3Resources[0]._id,
      roadmap: fullStackRoadmap._id,
      passingScore: 70,
      questions: [
        {
          question: 'What is Node.js?',
          options: [
            'A JavaScript runtime',
            'A frontend framework',
            'A database',
            'A CSS framework',
          ],
          correctOption: 0,
          explanation: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine.',
        },
        {
          question: 'What is middleware in Express?',
          options: [
            'Functions with access to request and response objects',
            'Database connection handlers',
            'View templates',
            'CSS preprocessors',
          ],
          correctOption: 0,
          explanation: 'Middleware functions have access to the request and response objects.',
        },
        {
          question: 'What is JWT used for?',
          options: ['Authentication', 'Database queries', 'Styling', 'Testing'],
          correctOption: 0,
          explanation: 'JWT (JSON Web Tokens) are used for authentication.',
        },
      ],
      createdBy: adminUser._id,
    });

    // Quiz for Stage 4 (associated with a specific resource)
    const databaseQuiz = await Quiz.create({
      title: 'Database Management Quiz',
      description: 'Test your knowledge of databases and data management.',
      resource: stage4Resources[0]._id, // Associated with MongoDB resource
      roadmap: fullStackRoadmap._id,
      passingScore: 70,
      questions: [
        {
          question: 'What type of database is MongoDB?',
          options: ['NoSQL Document DB', 'SQL Database', 'Graph Database', 'Key-Value Store'],
          correctOption: 0,
          explanation: 'MongoDB is a NoSQL document database.',
        },
        {
          question: 'What does SQL stand for?',
          options: [
            'Structured Query Language',
            'Simple Query Language',
            'Standard Query Language',
            'System Query Language',
          ],
          correctOption: 0,
          explanation: 'SQL stands for Structured Query Language.',
        },
        {
          question: 'What is a primary key?',
          options: [
            'Unique identifier for records',
            'Foreign key reference',
            'Database index',
            'Table join condition',
          ],
          correctOption: 0,
          explanation: 'A primary key uniquely identifies each record in a table.',
        },
      ],
      createdBy: adminUser._id,
    });

    console.log('Creating comprehensive flashcard sets...');
    
    // Flashcard Set 1: Associated with roadmap
    const htmlFlashcards = await FlashcardSet.create({
      title: 'HTML5 Mastery Cards',
      description: 'Essential HTML5 elements and attributes.',
      resource: stage1Resources[0]._id,
      roadmap: fullStackRoadmap._id,
      cards: [
        { 
          front: 'DOCTYPE Declaration', 
          back: '<!DOCTYPE html> - Declares HTML5 document type',
          hint: 'Always first line of HTML'
        },
        { 
          front: 'Semantic HTML Elements', 
          back: 'header, nav, main, article, section, aside, footer',
          hint: 'Meaningful structural elements'
        },
        { 
          front: 'Form Input Types', 
          back: 'text, email, password, number, tel, url, date, checkbox, radio',
          hint: 'Different mobile keyboards appear'
        },
      ],
      createdBy: adminUser._id,
    });

    // Flashcard Set 2: Associated with a specific resource
    const cssFlashcards = await FlashcardSet.create({
      title: 'CSS Mastery Cards',
      description: 'Complete CSS properties and layout techniques.',
      resource: stage1Resources[1]._id, // Associated with CSS resource
      roadmap: fullStackRoadmap._id,
      cards: [
        { 
          front: 'CSS Box Model', 
          back: 'Content → Padding → Border → Margin',
          hint: 'Total width calculation'
        },
        { 
          front: 'Flexbox Properties', 
          back: 'display: flex, justify-content, align-items, flex-direction',
          hint: 'One-dimensional layouts'
        },
        { 
          front: 'CSS Grid Properties', 
          back: 'display: grid, grid-template-columns, grid-template-rows, gap',
          hint: 'Two-dimensional layouts'
        },
      ],
      createdBy: adminUser._id,
    });

    // Flashcard Set 3: JavaScript concepts
    const jsFlashcards = await FlashcardSet.create({
      title: 'JavaScript Core Concepts',
      description: 'Essential JavaScript concepts and patterns.',
      resource: stage1Resources[2]._id,
      roadmap: fullStackRoadmap._id,
      cards: [
        { 
          front: 'Closure', 
          back: 'Function with access to outer scope variables',
          hint: 'Function + lexical scope'
        },
        { 
          front: 'Promise', 
          back: 'Object for async operation completion',
          hint: 'Pending, fulfilled, rejected'
        },
        { 
          front: 'Event Loop', 
          back: 'Handles async callbacks in JavaScript',
          hint: 'Call Stack → Web APIs → Callback Queue'
        },
      ],
      createdBy: adminUser._id,
    });

    // Flashcard Set 4: React concepts (associated with React resource)
    const reactFlashcards = await FlashcardSet.create({
      title: 'React & Hooks Mastery',
      description: 'Complete React concepts and hooks.',
      resource: stage2Resources[0]._id, // Associated with React resource
      roadmap: fullStackRoadmap._id,
      cards: [
        { 
          front: 'useState Hook', 
          back: 'Returns state value and setter function',
          hint: 'Triggers re-render'
        },
        { 
          front: 'useEffect Hook', 
          back: 'Handles side effects in components',
          hint: 'Dependencies array matters'
        },
        { 
          front: 'Context API', 
          back: 'Solves prop drilling for global state',
          hint: 'createContext, Provider, useContext'
        },
      ],
      createdBy: adminUser._id,
    });

    console.log('Creating quiz attempts for users...');
    
    // Beginner user attempts
    await QuizAttempt.create({
      user: beginnerUser._id,
      quiz: frontendQuiz._id,
      answers: [
        { questionIndex: 0, selectedOption: 0, isCorrect: true },
        { questionIndex: 1, selectedOption: 0, isCorrect: true },
        { questionIndex: 2, selectedOption: 3, isCorrect: true },
        { questionIndex: 3, selectedOption: 0, isCorrect: true },
      ],
      score: 100,
      passed: true,
    });

    await QuizAttempt.create({
      user: beginnerUser._id,
      quiz: reactQuiz._id,
      answers: [
        { questionIndex: 0, selectedOption: 0, isCorrect: true },
        { questionIndex: 1, selectedOption: 1, isCorrect: true },
        { questionIndex: 2, selectedOption: 0, isCorrect: false },
      ],
      score: 66,
      passed: false,
    });

    // Advanced user attempts
    await QuizAttempt.create({
      user: advancedUser._id,
      quiz: frontendQuiz._id,
      answers: [
        { questionIndex: 0, selectedOption: 0, isCorrect: true },
        { questionIndex: 1, selectedOption: 0, isCorrect: true },
        { questionIndex: 2, selectedOption: 3, isCorrect: true },
        { questionIndex: 3, selectedOption: 0, isCorrect: true },
      ],
      score: 100,
      passed: true,
    });

    await QuizAttempt.create({
      user: advancedUser._id,
      quiz: reactQuiz._id,
      answers: [
        { questionIndex: 0, selectedOption: 0, isCorrect: true },
        { questionIndex: 1, selectedOption: 1, isCorrect: true },
        { questionIndex: 2, selectedOption: 0, isCorrect: true },
      ],
      score: 100,
      passed: true,
    });

    await QuizAttempt.create({
      user: advancedUser._id,
      quiz: backendQuiz._id,
      answers: [
        { questionIndex: 0, selectedOption: 0, isCorrect: true },
        { questionIndex: 1, selectedOption: 0, isCorrect: true },
        { questionIndex: 2, selectedOption: 0, isCorrect: true },
      ],
      score: 100,
      passed: true,
    });

    // Update user progress and saved roadmaps
    beginnerUser.progress = [
      {
        roadmap: fullStackRoadmap._id,
        completedResources: stage1Resources.slice(0, 2).map(r => r._id),
      },
    ];
    beginnerUser.savedRoadmaps = [fullStackRoadmap._id];
    await beginnerUser.save();

    advancedUser.progress = [
      {
        roadmap: fullStackRoadmap._id,
        completedResources: [
          ...stage1Resources.map(r => r._id),
          ...stage2Resources.slice(0, 2).map(r => r._id),
          ...stage3Resources.slice(0, 1).map(r => r._id),
        ],
      },
    ];
    advancedUser.savedRoadmaps = [fullStackRoadmap._id];
    await advancedUser.save();

    // Increment enrolled count
    fullStackRoadmap.enrolledCount = 3;
    await fullStackRoadmap.save();

    console.log('\n========================================');
    console.log('✅ Database Seeding Complete!');
    console.log('========================================');
    console.log('\n📊 Seeding Summary:');
    console.log(`👤 Admin User: admin@email.com / adminpassword`);
    console.log(`👤 Beginner User: beginner@example.com / userpassword`);
    console.log(`👤 Advanced User: advanced@example.com / userpassword`);
    console.log(`\n📚 Categories Created: 3`);
    console.log(`🗺️  Roadmaps Created: 1`);
    console.log(`📹 Resources Created: ${stage1Resources.length + stage2Resources.length + stage3Resources.length + stage4Resources.length + stage5Resources.length}`);
    console.log(`📝 Quizzes Created: 4`);
    console.log(`🃏 Flashcard Sets Created: 4`);
    console.log(`🎯 Quiz Attempts Recorded: 5`);
    console.log(`\n📖 Main Roadmap Details:`);
    console.log(`   Title: ${fullStackRoadmap.title}`);
    console.log(`   Stages: ${fullStackRoadmap.stages.length}`);
    console.log(`   Total Resources: ${fullStackRoadmap.stages.reduce((sum, stage) => sum + stage.resources.length, 0)}`);
    console.log(`   Difficulty: ${fullStackRoadmap.difficulty}`);
    console.log(`   Estimated Time: ${fullStackRoadmap.estimatedTime}`);
    console.log(`   Enrolled: ${fullStackRoadmap.enrolledCount} users`);
    console.log(`\n🔗 API Testing URLs:`);
    console.log(`   GET /api/roadmaps/${fullStackRoadmap.slug}`);
    console.log(`   GET /api/categories`);
    console.log(`   GET /api/roadmaps`);
    console.log(`   POST /api/auth/login (test with created users)`);
    console.log(`   GET /api/quizzes?roadmapId=${fullStackRoadmap._id}`);
    console.log(`   GET /api/flashcards?roadmapId=${fullStackRoadmap._id}`);
    console.log('========================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();