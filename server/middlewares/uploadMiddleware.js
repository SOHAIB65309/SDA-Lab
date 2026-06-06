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

// Ensure upload directory exists
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Multer instance with limits
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
