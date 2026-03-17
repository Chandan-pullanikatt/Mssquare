
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ASSETS_MAP: {[key: string]: string} = {};

async function uploadAssets() {
    const assetsDir = path.resolve(process.cwd(), 'public/assets');
    const files = fs.readdirSync(assetsDir);

    for (const file of files) {
        const filePath = path.join(assetsDir, file);
        if (fs.lstatSync(filePath).isDirectory()) continue;

        const fileBuffer = fs.readFileSync(filePath);
        const ext = path.extname(file).toLowerCase();
        let contentType = 'image/png';
        if (ext === '.webm') contentType = 'video/webm';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.svg') contentType = 'image/svg+xml';

        console.log(`Uploading ${file}...`);
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('website-media')
            .upload(file, fileBuffer, {
                contentType,
                upsert: true
            });

        if (uploadError) {
            console.error(`Error uploading ${file}:`, uploadError.message);
            continue;
        }

        const { data: urlData } = supabase.storage
            .from('website-media')
            .getPublicUrl(file);

        ASSETS_MAP[`/assets/${file}`] = urlData.publicUrl;
        console.log(`Mapped /assets/${file} to ${urlData.publicUrl}`);
    }

    // Now update website_sections
    const { data: sections, error: sectionsError } = await supabase
        .from('website_sections')
        .select('*');

    if (sectionsError) {
        console.error('Error fetching sections:', sectionsError.message);
        return;
    }

    for (const section of sections) {
        let contentJsonStr = JSON.stringify(section.content_json);
        let updated = false;

        for (const [localPath, remoteUrl] of Object.entries(ASSETS_MAP)) {
            if (contentJsonStr.includes(localPath)) {
                console.log(`Replacing ${localPath} in section ${section.section_name}`);
                contentJsonStr = contentJsonStr.split(localPath).join(remoteUrl);
                updated = true;
            }
        }

        if (updated) {
            const { error: updateError } = await supabase
                .from('website_sections')
                .update({ content_json: JSON.parse(contentJsonStr) })
                .eq('id', section.id);

            if (updateError) {
                console.error(`Error updating section ${section.section_name}:`, updateError.message);
            } else {
                console.log(`Updated section ${section.section_name} successfully.`);
            }
        }
    }
}

uploadAssets();
