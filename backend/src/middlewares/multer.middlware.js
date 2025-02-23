// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })
  
// export const upload = multer({ 
//     storage, 
// })

// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public")
//     },
//     filename: function (req, file, cb) {
//       const timestamp = Date.now();
//       const extName = file.originalname.split(" ").pop();

//       const filename = `${timestamp}.${extName}`
//       cb(null, filename)
//     }
//   })
  
// export const upload = multer({ 
//     storage, 
// })

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Ensure './public' directory exists
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const extName = path.extname(file.originalname); // Extract file extension
    const filename = `${timestamp}${extName}`; // Unique filename
    cb(null, filename);
  }
});

// Optional: File type filter (e.g., allow only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, PNG, GIF) are allowed"), false);
  }
};

export const upload = multer({ 
  storage,
  fileFilter, // Enable file type filtering
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
});
