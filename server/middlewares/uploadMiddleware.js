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

// Multer Memory Storage Configuration (Vercel/Serverless Safe)
// Isse file local folder ke bajaye temporarily serverless RAM buffer mein save hogi
const storage = multer.memoryStorage();

// Multer Instance setup with limits (Optional: 5MB file limit)
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 Megabytes tak ki image allowed hai
  }
});

export default upload;
