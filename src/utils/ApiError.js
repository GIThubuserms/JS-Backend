export class ApiError extends Error{

constructor(
    statuscode,
    message="Something went wrong",
    error=[],
    stack=""
)
{
    super(message),
    this.statuscode=statuscode,
    this.error=error,
    this.stack=stack,
    this.data=null
    // basically ye capturestack location pata karta ha error ki jo kay Error class main already hoti  ha so ham apna obj or constructor pass krty ha
    Error.captureStackTrace(this,this.constructor)
} 
             
}
