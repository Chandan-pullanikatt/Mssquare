const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const courses = [
  {
    title: 'Biochemistry Mastery',
    description: 'Master the chemical processes of life, biomolecules, enzymes, and metabolic pathways with real-world applications in healthcare, pharmaceuticals, and research.',
    price: 4999,
    category: 'Mentorship',
    level: 'Intermediate',
    duration: '12 Weeks',
    overview: 'This program is architected to deliver high-impact results in life sciences. It combines foundational theory with practical understanding of biochemical processes, lab concepts, and industry applications to build a strong competitive edge in healthcare, research, and biotechnology.\n\nWhat You\'ll Learn:\n- Structure and function of biomolecules\n- Enzyme mechanisms and regulation\n- Major metabolic pathways and bioenergetics\n- Integration of biochemistry in cellular processes and disease mechanisms'
  },
  {
    title: 'Zoology Mastery',
    description: 'Explore the diversity, anatomy, physiology, behavior, and ecology of animals with a focus on classification, evolution, and conservation.',
    price: 4999,
    category: 'Mentorship',
    level: 'Beginner',
    duration: '12 Weeks',
    overview: 'This program is designed to deliver high-impact knowledge of the animal kingdom. It combines foundational theory with practical insights into animal diversity, adaptations, and real-world applications in wildlife conservation and research.\n\nWhat You\'ll Learn:\n- Animal classification and systematics\n- Anatomy and physiology of invertebrates and vertebrates\n- Animal behavior and adaptations\n- Ecology, evolution, and conservation biology'
  },
  {
    title: 'Botany Mastery',
    description: 'Dive deep into plant science — structure, physiology, taxonomy, photosynthesis, and their vital role in agriculture, environment, and biotechnology.',
    price: 4999,
    category: 'Mentorship',
    level: 'Beginner',
    duration: '12 Weeks',
    overview: 'This program delivers high-impact learning in plant biology. It combines strong foundational theory with practical applications in agriculture, ecology, and biotechnology to prepare you for real-world opportunities.\n\nWhat You\'ll Learn:\n- Plant cell, tissue, and organ structure\n- Photosynthesis and plant physiology\n- Plant taxonomy and reproduction\n- Economic importance and ecological roles of plants'
  },
  {
    title: 'Biotechnology Mastery',
    description: 'Master genetic engineering, molecular techniques, bioprocessing, and modern applications in medicine, agriculture, and industry using tools like CRISPR and recombinant DNA.',
    price: 4999,
    category: 'Mentorship',
    level: 'Intermediate',
    duration: '12 Weeks',
    overview: 'This program is architected to deliver high-impact results at the intersection of biology and technology. It combines core theory with practical lab techniques and real-world applications to build industry-ready skills in biotechnology.\n\nWhat You\'ll Learn:\n- Molecular biology and recombinant DNA technology\n- Key tools and techniques (PCR, CRISPR, cloning)\n- Applications in medical, plant, and industrial biotechnology\n- Bioprocessing, ethics, and regulatory aspects'
  }
];

supabase.from('courses').insert(courses).then(res => {
  if (res.error) console.error('Error:', res.error);
  else console.log('Successfully inserted courses');
});
