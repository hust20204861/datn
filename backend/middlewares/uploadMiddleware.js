const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa có
const createUploadDirs = () => {
  const baseDir = path.join(__dirname, '../uploads');
  const commentsDir = path.join(baseDir, 'comments');
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  if (!fs.existsSync(commentsDir)) {
    fs.mkdirSync(commentsDir, { recursive: true });
  }
};

// Tạo thư mục khi khởi tạo
createUploadDirs();

// Cấu hình storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const uploadPath = path.join(__dirname, '../uploads/comments', year.toString(), month, day);
    
    // Tạo thư mục theo ngày nếu chưa có
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique: timestamp_originalname
    const timestamp = Date.now();
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    cb(null, fileName);
  }
});

// File filter - chỉ cho phép các loại file an toàn
const fileFilter = (req, file, cb) => {
  // Danh sách MIME types được phép
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text files
    'text/plain',
    'text/csv',
    
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed. Only images, documents, and archives are permitted.`), false);
  }
};

// Cấu hình multer
const uploadComment = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Tối đa 5 files per comment
  }
});

// Helper function để lấy file type từ mimetype
const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.includes('pdf')) return 'document';
  if (mimetype.includes('word') || mimetype.includes('excel') || mimetype.includes('powerpoint')) return 'document';
  if (mimetype.includes('text')) return 'text';
  if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('7z')) return 'archive';
  return 'other';
};

module.exports = {
  uploadComment,
  getFileType
}; 