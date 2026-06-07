import { google } from 'googleapis';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    const [, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.create({
      requestBody: {
        name: file.originalFilename || 'upload.pdf',
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
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    return res.status(200).json({ url: previewUrl });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}