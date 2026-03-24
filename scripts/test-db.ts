import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing courses table...");
  const { data, error } = await supabase.from('courses').select('*').limit(1);
  if (error) {
    console.error("Select Error:", error.message, error.details, error.hint);
  } else {
    console.log("Select Success, found:", data?.length, "courses");
  }

  console.log("Testing insert...");
  const testCourse = {
    title: "Test Course " + Date.now(),
    description: "Test description",
    price: 100,
    category: "Certification",
    level: "Beginner"
  };

  const { data: insertData, error: insertError } = await supabase.from('courses').insert([testCourse]).select();
  if (insertError) {
    console.error("Insert Error:", insertError.message, insertError.details, insertError.hint);
  } else {
    console.log("Insert Success!");
  }
}

test();
