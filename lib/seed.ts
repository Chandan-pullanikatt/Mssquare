"use client";

import { coursesApi } from "@/lib/api/courses";
import { modulesApi } from "@/lib/api/modules";
import { lessonsApi } from "@/lib/api/lessons";

const subjects = [
  { 
    id: "ai", 
    name: "Artificial Intelligence", 
    desc: "Learn how to build intelligent systems using machine learning, neural networks, and natural language processing.", 
    img: "/assets/courses/ArtificialIntelligence.jpg",
    modules: [
      { title: "Introduction to AI", lessons: ["History of AI", "Agents & Environments", "Problem Solving by Searching"] },
      { title: "Machine Learning Foundations", lessons: ["Supervised Learning", "Unsupervised Learning", "Neural Networks Intro"] },
      { title: "Computer Vision", lessons: ["Image Processing", "Object Detection", "Face Recognition"] }
    ]
  },
  { 
    id: "ml", 
    name: "Machine Learning", 
    desc: "Master the algorithms that power modern technology, from predictive models to advanced computer vision.", 
    img: "/assets/courses/machinelearning.jpg",
    modules: [
      { title: "Regression Analysis", lessons: ["Linear Regression", "Logistic Regression", "Polynomial Regression"] },
      { title: "Deep Learning", lessons: ["TensorFlow Basics", "CNNs", "RNNs & LSTMs"] },
      { title: "Deployment", lessons: ["Model Pipelines", "Cloud Deployment", "API Integration"] }
    ]
  },
  { 
    id: "data", 
    name: "Data Analytics", 
    desc: "Transform raw data into meaningful insights using powerful tools like SQL, Python, and Tableau.", 
    img: "/assets/courses/dataanalytics.jpg",
    modules: [
      { title: "Excel for Data", lessons: ["Pivot Tables", "Advanced Formulas", "Data Visualization"] },
      { title: "SQL Mastery", lessons: ["JOINS & Aggregations", "Stored Procedures", "Query Optimization"] },
      { title: "Tableau/PowerBI", lessons: ["Dashboard Design", "Storyboarding", "Real-time Connections"] }
    ]
  },
  { 
    id: "cyber", 
    name: "Cyber Security", 
    desc: "Defend systems against sophisticated cyber threats and master the art of ethical hacking.", 
    img: "/assets/courses/cybersecurity.jpg",
    modules: [
      { title: "Network Security", lessons: ["Firewalls", "VPNs", "Wireless Security"] },
      { title: "Ethical Hacking", lessons: ["Reconnaissance", "Exploitation", "Post-Exploitation"] },
      { title: "Incident Response", lessons: ["Malware Analysis", "Forensics", "Risk Management"] }
    ]
  },
  { 
    id: "cloud", 
    name: "Cloud Computing", 
    desc: "Build scalable and secure infrastructure using leading cloud platforms like AWS and Azure.", 
    img: "/assets/courses/cloudcomputing.jpg",
    modules: [
      { title: "AWS Fundamentals", lessons: ["EC2 & S3", "IAM", "VPC Design"] },
      { title: "Serverless Architecture", lessons: ["Lambda Functions", "API Gateway", "DynamoDB"] },
      { title: "DevOps on Cloud", lessons: ["CI/CD Pipelines", "Terraform", "CloudWatch"] }
    ]
  },
  { 
    id: "web", 
    name: "Web Development", 
    desc: "Build modern, responsive, and high-performance websites from scratch using the latest web technologies.", 
    img: "/assets/courses/webdevelopment.jpg",
    modules: [
      { title: "Frontend Mastery", lessons: ["Advanced CSS/Tailwind", "React Hooks", "State Management"] },
      { title: "Backend Systems", lessons: ["Node.js/Express", "Prisma/Drizzle", "Authentication"] },
      { title: "Fullstack Project", lessons: ["E-commerce App", "Real-time Chat", "Deployment"] }
    ]
  },
  { 
    id: "marketing", 
    name: "Digital Marketing", 
    desc: "Grow brands online through SEO, content strategy, social media, and data-driven advertising.", 
    img: "/assets/courses/digitalmarketing.jpg",
    modules: [
      { title: "SEO Strategy", lessons: ["On-page Optimization", "Backlink Building", "Technical SEO"] },
      { title: "Social Media Ads", lessons: ["Facebook/IG Ads", "LinkedIn Marketing", "Content Calendar"] },
      { title: "Content Creation", lessons: ["Copywriting", "Video Marketing", "AI in Marketing"] }
    ]
  },
  { 
    id: "hr", 
    name: "Human Resources", 
    desc: "Master people management, talent acquisition, and modern corporate HR strategies.", 
    img: "/assets/courses/humanresources.jpg",
    modules: [
      { title: "Talent Acquisition", lessons: ["Sourcing Strategies", "Behavioral Interviewing", "ATS Systems"] },
      { title: "Employee Relations", lessons: ["Conflict Resolution", "Performance Reviews", "Diversity & Inclusion"] },
      { title: "HR Analytics", lessons: ["KPIs for HR", "Workforce Planning", "Compliance"] }
    ]
  },
  { 
    id: "autocad", 
    name: "AutoCAD", 
    desc: "Master architectural and engineering drawings with industry-standard 2D and 3D modeling tools.", 
    img: "/assets/courses/autocad.jpg",
    modules: [
      { title: "2D Drafting", lessons: ["Basic Geometric Shapes", "Layers & Blocks", "Dimensioning"] },
      { title: "3D Modeling", lessons: ["Extrusions & Sweeps", "Mesh Modeling", "Rendering"] },
      { title: "Real-world Project", lessons: ["Floor Plans", "Mechanical Parts", "Plotting"] }
    ]
  },
  { 
    id: "car", 
    name: "Car Designing", 
    desc: "Learn the fundamentals of automotive design, from conceptual sketching to digital surfacing.", 
    img: "/assets/courses/cardesign.jpg",
    modules: [
      { title: "Conceptual Sketching", lessons: ["Perspective Drawing", "Proportion Study", "Speed Forms"] },
      { title: "Digital Sculpting", lessons: ["Surface Modeling", "Aerodynamics", "Materials"] },
      { title: "Industrial Workflow", lessons: ["Clay Modeling", "VR in Design", "Portfolio Presentation"] }
    ]
  }
];

const programTypes = [
  { id: "Certification", price: 7999, suffix: "Certification" },
  { id: "Mentorship", price: 4999, suffix: "Mastery" },
  { id: "Placement", price: 80000, suffix: "Professional" }
];

export async function seedDatabase() {
  console.log("Seeding started...");
  let count = 0;
  
  for (const pt of programTypes) {
    for (const s of subjects) {
      try {
        const course = await coursesApi.createCourse({
          title: `${s.name} ${pt.suffix}`,
          description: s.desc,
          thumbnail: s.img,
          price: pt.price,
          category: pt.id as any,
          level: (s.id === "ml" || s.id === "car") ? "Advanced" : (s.id === "ai" || s.id === "cyber" || s.id === "cloud" || s.id === "autocad") ? "Intermediate" : "Beginner",
          overview: `Advance your career with our ${s.name} ${pt.id} program. This course at MSsquare Technologies is designed to provide a comprehensive understanding, enabling students to build cutting-edge solutions that transform industries and improve lives.`,
          skills: ["Real-world Project Implementation", "Professional Tooling", "Industry Analysis", "Collaborative Workflows", "Problem Solving", "Technical Leadership"],
          outcomes: ["Expert Certification", "Hands-on Project Portfolio", "Career Mentorship", "Lifetime Community Access"],
          duration: pt.id === "Placement" ? "24 Weeks" : pt.id === "Mentorship" ? "18 Weeks" : "12 Weeks"
        });

        if (course) {
          count++;
          console.log(`Created [${pt.id}] ${course.title}`);

          // Add detailed modules and lessons
          let lessonCounter = 1;
          for (let mIdx = 0; mIdx < s.modules.length; mIdx++) {
            const m = s.modules[mIdx];
            const moduleData = await modulesApi.createModule({
              course_id: course.id,
              title: m.title,
              order_index: mIdx + 1
            });

            if (moduleData) {
              for (let lIdx = 0; lIdx < m.lessons.length; lIdx++) {
                await lessonsApi.createLesson({
                  module_id: moduleData.id,
                  course_id: course.id,
                  title: m.lessons[lIdx],
                  notes: `Detailed content for ${m.lessons[lIdx]} in the ${s.name} program.`,
                  order_index: lessonCounter++,
                  video_url: ""
                });
              }
            }
          }
        }
      } catch (err: any) {
        console.error(`Failed to create ${s.name} ${pt.id}:`, err);
        throw new Error(`Database Error at '${s.name} ${pt.id}': ${err.message}. Please check your SQL permissions.`);
      }
    }
  }
  
  console.log("Seeding complete!");
  return count;
}
