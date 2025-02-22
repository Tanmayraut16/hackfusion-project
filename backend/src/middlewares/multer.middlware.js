

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public")
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const extName = file.originalname.split(" ").pop();

      const filename = `${timestamp}.${extName}`
      cb(null, filename)
    }
  })
  
export const upload = multer({ 
    storage, 
})