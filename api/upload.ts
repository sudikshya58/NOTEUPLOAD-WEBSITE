import { google } from 'googleapis';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: { bodyParser: false },
};

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const level = fields.level?.[0] || 'General';
    const faculty = fields.faculty?.[0] || 'General';
    const semester = fields.semester?.[0] || '';
    const subject = fields.subject?.[0] || 'Unknown';

    const organizedName = [level, faculty, semester, subject]
      .filter(Boolean)
      .join('_')
      .replace(/\s+/g, '_') + '.pdf';

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.create({
      requestBody: {
        name: organizedName,
        mimeType: 'application/pdf',
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: {
        mimeType: 'application/pdf',
        body: fs.createReadStream(file.filepath),
      },
      fields: 'id',
    });

    const fileId = response.data.id!;

    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    return res.status(200).json({ url: previewUrl });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}