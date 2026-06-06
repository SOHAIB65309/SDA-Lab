// import multer from 'multer';
// import path from 'path';

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: './upload/images',
//   filename: (req, file, cb) => {
//     return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// // Multer instance
// const upload = multer({ storage: storage });

// export default upload;

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;

// Multer storage configuration
let storage;

if (isVercel) {
  // Use memory storage on Vercel to avoid "Read-only file system" errors
  storage = multer.memoryStorage();
} else {
  // Local development: Ensure upload directory exists
  const uploadDir = './upload/images';
  if (!fs.existsSync(uploadDir)) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
      console.warn('Could not create upload directory:', err.message);
    }
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
  });
}

// Multer instance with limits
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
