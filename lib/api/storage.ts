import { supabase } from '../supabase/client';


export const storageApi = {
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async uploadBlogImage(file: File, fileName: string) {
    return this.uploadFile('blog-images', fileName, file);
  },

  async uploadCourseThumbnail(file: File, fileName: string) {
    return this.uploadFile('course-thumbnails', fileName, file);
  },

  async uploadLessonResource(file: File, fileName: string) {
    return this.uploadFile('lesson-resources', fileName, file);
  },

  async uploadWebsiteMedia(file: File, fileName: string) {
    return this.uploadFile('website-media', fileName, file);
  },

  async uploadTeamImage(file: File, fileName: string) {
    return this.uploadFile('team-images', fileName, file);
  },

  async uploadCertificateTemplate(file: File, fileName: string) {
    return this.uploadFile('certificates', fileName, file);
  }
};
