const multer = require("multer");
const path = require("path")
const sharp = require("sharp")
const fs = require("fs")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join(__dirname,"../uploads/products") );
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+".jpeg";
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

const productImageResize = async(img,filename)=>{
  const outputDir = path.join(__dirname, "../uploads/products");
  const outputPath = path.join(outputDir,`resized_${filename}`);
  try {
    await sharp(img)
      .resize(300, 300) 
      .toFormat("jpeg") 
      .jpeg({ quality: 90 }) 
      .toFile(outputPath); 
    fs.unlink(img, (unlinkErr) => {
      if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
      }})
  } catch (error) {
    console.error('Error processing image:', error);
    throw error; 
  }


}

module.exports= {upload,productImageResize};
