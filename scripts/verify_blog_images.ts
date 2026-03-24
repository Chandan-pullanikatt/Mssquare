
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
    const { data, error } = await supabase.from('blogs').select('title, image');
    if (error) {
        console.error('Error fetching blogs:', error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

verify();
