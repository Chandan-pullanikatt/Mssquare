
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listColumns() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'blogs' });
  if (error) {
    // If RPC doesn't exist, try querying a specific table that might have this info or just try to insert and see failure
    console.log('RPC get_table_columns failed, trying another way...');
    const { data: cols, error: err } = await supabase.from('blogs').select('*').limit(0);
    if (err) console.error(err);
    else console.log('Columns likely missing:', err);
  } else {
    console.log('Columns:', data);
  }
}

listColumns();
