
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectBlogs() {
  const { data, error } = await supabase.from('blogs').select('*').limit(1);
  if (error) {
    console.error('Error fetching blogs:', error.message);
  } else {
    console.log('Sample blog row:', JSON.stringify(data, null, 2));
    // Try to get columns by selecting from a non-existent column to trigger an error that lists valid columns
    const { error: colError } = await supabase.from('blogs').select('non_existent_column');
    if (colError) {
      console.log('Column info error (expected):', colError.message);
    }
  }
}

inspectBlogs();
