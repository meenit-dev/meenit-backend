import * as fs from 'fs';
import axios from 'axios';

async function uploadWithPresignedUrl() {
  const presignedUrl = '';
  const filePath = './cat.jpg'; // 업로드할 파일
  const file = fs.readFileSync(filePath);

  try {
    const res = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': 'image/jpeg',
        //   'Content-Length': 199491,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    console.log('Upload success:', res.status);
  } catch (err: any) {
    console.error(
      'Upload error:',
      err.response?.status,
      err.response?.data || err.message,
    );
  }
}

uploadWithPresignedUrl();
