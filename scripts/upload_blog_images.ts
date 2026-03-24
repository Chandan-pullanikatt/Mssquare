
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadImages() {
    const blogAssetsDir = path.resolve(process.cwd(), 'public/assets/blog');
    const files = fs.readdirSync(blogAssetsDir);

    for (const file of files) {
        const filePath = path.join(blogAssetsDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        
        console.log(`Uploading ${file}...`);
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(file, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`Error uploading ${file}:`, uploadError.message);
            continue;
        }

        const { data: urlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(file);

        const publicUrl = urlData.publicUrl;
        console.log(`Public URL for ${file}: ${publicUrl}`);

        // Update the blog post record that uses this image
        // We match by filename in the image field
        const { data: blogs, error: fetchError } = await supabase
            .from('blogs')
            .select('id, image');

        if (fetchError) {
            console.error('Error fetching blogs:', fetchError.message);
            continue;
        }

        for (const blog of blogs) {
            if (blog.image && blog.image.includes(file)) {
                console.log(`Updating blog post ${blog.id} with new URL...`);
                const { error: updateError } = await supabase
                    .from('blogs')
                    .update({ image: publicUrl })
                    .eq('id', blog.id);

                if (updateError) {
                    console.error(`Error updating blog ${blog.id}:`, updateError.message);
                } else {
                    console.log(`Updated blog ${blog.id} successfully.`);
                }
            }
        }
    }
}

uploadImages();
