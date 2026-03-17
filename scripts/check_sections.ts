
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
    const { data, error } = await supabase.from('website_sections').select('section_name');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Sections in DB:', data.map(d => d.section_name));
    }
}

checkData();
