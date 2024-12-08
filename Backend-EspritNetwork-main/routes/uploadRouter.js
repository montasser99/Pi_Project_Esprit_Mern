const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the destination folder
      const uploadPath = 'DocumentsPdf';
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Retrieve documentName from query parameters
      const documentName = req.query.documentName;
  
      // Log the values of documentName and file.originalname
      console.log('documentName:', documentName);
      console.log('file.originalname:', file.originalname);
  
      // Use the documentName as the new filename
      const newFilename = `${documentName}`;
      cb(null, newFilename);
    },
  });
  
  // Configure multer
  const upload = multer({ storage: storage });
  
  // Define the file upload endpoint
  router.post('/', upload.single('file'), (req, res) => {
    try {
      // File has been uploaded successfully
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Add your existing routes here
  
  module.exports = router;