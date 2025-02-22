import multer from "multer";

const storage = multer.memoryStorage();

const uploadFileCloud=multer({ storage: storage }).single("file");

export default uploadFileCloud;