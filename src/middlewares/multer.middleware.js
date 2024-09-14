import multer from'multer'


export const upload=multer({storage})

const storage=multer.diskStorage({
   destination:function(req,file,cb){
    return cb(null,'./public/temp')
   },
   filename:function(req,file,cb){

     return cb(null,`${Date.now}+${file.originalname}`)
   },
})



