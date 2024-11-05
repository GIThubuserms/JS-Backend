import multer from'multer'

const storage=multer.diskStorage({
   destination:function(req,file,cb){
    return cb(null,'./public/temp')
   },
   filename:function(req,file,cb){
     return cb(null,`+${file.originalname}`)
   },
})
export const upload = multer({ 
  storage
})




//   fileFilter:function(req, file, cb){
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true); // Accept file
//   } else {
//     cb(new Error('Invalid file type!'), false); // Reject file
//   }
// }




