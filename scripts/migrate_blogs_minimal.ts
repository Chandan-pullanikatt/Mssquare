
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { BLOG_POSTS } from '../content/blogs/blogs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateBlogs() {
  console.log('Migrating blogs (minimal)...');
  for (const post of BLOG_POSTS) {
    const { data, error } = await supabase
      .from('blogs')
      .upsert({
        slug: post.slug,
        title: post.title,
        content: post.content,
        image: post.image,
        published: true
      }, { onConflict: 'slug' })
      .select();

    if (error) {
        console.error(`Error migrating blog ${post.slug}:`, error.message);
    } else {
      console.log(`Migrated blog: ${post.slug}`);
    }
  }
}

async function run() {
  await migrateBlogs();
  console.log('Migration complete!');
}

run();
