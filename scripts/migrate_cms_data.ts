
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { BLOG_POSTS } from '../content/blogs/blogs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateBlogs() {
  console.log('Migrating blogs...');
  for (const post of BLOG_POSTS) {
    const { data, error } = await supabase
      .from('blogs')
      .upsert({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category,
        author: post.author,
        date: post.date,
        read_time: post.readTime,
        published: true
      }, { onConflict: 'slug' })
      .select();

    if (error) {
           if (error.message.toLowerCase().includes('column') || error.message.toLowerCase().includes('author')) {
                console.log(`Retrying blog ${post.slug} without extra columns...`);
                const { error: retryError } = await supabase.from('blogs').upsert({
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content,
                    image: post.image,
                    category: post.category,
                    date: post.date,
                    published: true
                }, { onConflict: 'slug' });
                if (retryError) console.error(`Retry error for ${post.slug}:`, retryError.message);
                else console.log(`Migrated blog (subset): ${post.slug}`);
           } else {
                console.error(`Error migrating blog ${post.slug}:`, error.message);
           }
    } else {
      console.log(`Migrated blog: ${post.slug}`);
    }
  }
}

async function migrateLandingContent() {
  console.log('Migrating landing content...');
  
  const sections = [
    {
        name: 'privacy_policy',
        content: {
            title: "Privacy Policy",
            last_updated: "March 17, 2026",
            sections: [
                {
                    heading: "1. Information We Collect",
                    content: "We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, fill out a form, or participate in our courses and consultancy services. The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.",
                    list: ["Account Data: Name, email address, phone number, and password.", "Billing Data: Transaction details, credit card numbers, and billing addresses utilized for our EdTech and Business platforms.", "Interaction Data: Chat logs, forum posts, submitted projects, and general course activity."]
                },
                {
                    heading: "2. How We Use Your Information",
                    content: "We use the information we collect in various ways, including to:",
                    list: ["Provide, operate, and maintain our educational and consulting platforms.", "Improve, personalize, and expand our services by analyzing usage statistics.", "Process transactions and send related information, including confirmations and invoices.", "Communicate with you directly, for customer service, updates, and promotional content.", "Find and prevent fraud to ensure a secure environment for all users."]
                },
                {
                    heading: "3. Data Security",
                    content: "MSSquare implements a variety of state-of-the-art security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. We utilize regular Malware Scanning, SSL encryption for sensitive data flows, and restrict data access solely to authorized personnel."
                },
                {
                    heading: "4. Cookies and Web Beacons",
                    content: "Like any other website, MSSquare uses \"cookies\". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information."
                },
                {
                    heading: "5. Third-Party Privacy Policies",
                    content: "MSSquare's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options."
                },
                {
                    heading: "6. GDPR Data Protection Rights",
                    content: "We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:",
                    list: ["The right to access: You have the right to request copies of your personal data.", "The right to rectification: You have the right to request that we correct any information you believe is inaccurate.", "The right to erasure: You have the right to request that we erase your personal data, under certain conditions."]
                },
                {
                    heading: "7. Contact Us",
                    content: "If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at operations@mssquaretechnologies.com."
                }
            ]
        }
    },
    {
        name: 'refund_policy',
        content: {
            title: "Refund Policy",
            last_updated: "March 17, 2026",
            intro: "At MSSquare, we strive to provide the highest quality education and mentorship. We understand that circumstances can change, and we have established this Refund Policy to be as fair as possible to both our students and our operational commitments.",
            sections: [
                {
                    heading: "1. Self-Paced Certification Programs",
                    content: "Our self-paced certification programs are eligible for a refund only if a refund request is raised within 1 week of the purchase date.",
                    note: "Please note that the registration charges, which are 20% of the course fee or Rs. 1000/- (whichever is higher), are non-refundable at any point in time."
                },
                {
                    heading: "2. Mentorship Programs",
                    content: "Mentorship program certification programs are eligible for a refund only if a refund request is raised within 1 week of the enrollment date.",
                    note: "Please note that the registration charges, which are 20% of the course fee or Rs. 1000/- (whichever is higher), are non-refundable at any point in time."
                },
                {
                    heading: "3. Placement Programs",
                    content: "Placement program certification programs are eligible for a refund only if a refund request is raised within 1 week of the enrollment date.",
                    note: "Please note that the registration charges, which are 20% of the course fee or Rs. 1000/- (whichever is higher), are non-refundable at any point in time."
                },
                {
                    heading: "4. Refund Processing",
                    content: "Once your refund request is approved, the refund amount will take some time to credit to your original payment method or bank account. We appreciate your patience during this process."
                },
                {
                    heading: "5. Contact for Refunds",
                    content: "To initiate a refund request or for any questions regarding our policy, please contact our support team at operations@mssquaretechnologies.com."
                }
            ]
        }
    },
    {
        name: 'terms_and_conditions',
        content: {
            title: "Terms & Conditions",
            last_updated: "March 16, 2026",
            intro: "Please read these terms carefully before using our services. By using MSsquare Technologies, you agree to be bound by these terms.",
            sections: [
                {
                    heading: "1. Account Registration",
                    content: "If you are under the age of 18, please do not sign up for an account. If you are accessing or using our site on behalf of any entity, you represent that you are authorized to accept these Terms of Use on that entity's behalf, and that entity agrees to be responsible to MSsquare Technologies if you violate these Terms of Use.\n\nYou may access some areas of our site(s) without registering. However, in order to access certain features of the Site or to post content on the Site you must register to create an account (\"Account\"). You must complete the registration process by providing us with current, complete and accurate information. You will not share your password, let anyone else access your Account, or do anything else that might jeopardize the security of your Account. We have the right to cancel any account at any time if we believe you are not in compliance with any or all of the terms."
                },
                {
                    heading: "2. Courses & Offered Payment",
                    content: "Information about courses offered and prices would be provided in the Website. You agree to pay the price for the courses registered as per the pricing schedule indicated in the Site. At the time of a payment, you need to provide accurate information regarding your account, including a valid credit card or debit card or net banking credentials, and you must certify that you are over 18 years of age and legally able to enter into a valid and binding agreement with MSsquare Technologies."
                },
                {
                    heading: "3. Processing & Account Payment",
                    content: "MSsquare Technologies may use third party electronic payment processors and/or financial institutions (\"EPPs\") to process financial transactions. You irrevocably authorize us, as necessary, to instruct such EPPs to handle such transaction and you irrevocably agree that MSsquare Technologies may give such instructions on your behalf in accordance with your requests as submitted on the Site. While availing any of the EPPs available on the Site, We will not be responsible or assume any liability, whatsoever in respect of any loss or damage arising directly or indirectly to you due to:\n- Lack of authorization for any transactions.\n- Any payment issues arising out of the transaction or Decline of such transaction for any reason.\n\nYou understand, accept and agree that the payment facility provided us, is neither a banking nor financial service."
                },
                {
                    heading: "4. Intellectual Property",
                    content: "MSsquare Technologies expressly reserves all intellectual property rights in all text, programs, products, processes, technology, content, software and other materials, which appear on this Website. The compilation (meaning the collection, arrangement and assembly) of the content on the Website is the exclusive property of MSsquare Technologies. Reproduction in whole or in part of the same is strictly prohibited without the express written permission of MSsquare Technologies."
                }
            ]
        }
    }
  ];

  for (const section of sections) {
    const { data, error } = await supabase
      .from('website_sections')
      .upsert({
        section_name: section.name,
        content_json: section.content
      }, { onConflict: 'section_name' })
      .select();

    if (error) {
      console.error(`Error migrating section ${section.name}:`, error.message);
    } else {
      console.log(`Migrated section: ${section.name}`);
    }
  }
}

async function run() {
  await migrateBlogs();
  await migrateLandingContent();
  console.log('Migration complete!');
}

run();
