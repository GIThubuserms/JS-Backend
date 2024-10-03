import multer from'multer'


// multer.diskstorage 2obj both are function  1 destination 2 filename

const storage=multer.diskStorage({
   destination:function(req,file,cb){
    return cb(null,'./public/temp')
   },
   filename:function(req,file,cb){
     return cb(null,`${Date.now}+${file.originalname}`)
   },
})
export const upload = multer({ 
  storage
})




