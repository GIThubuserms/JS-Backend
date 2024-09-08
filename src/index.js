import dotenv from"dotenv";
import databaseConnectionn from"./db/connection.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

// Good approch but not recomended
// const App =express()

// ( async()=>{
//     try {
//     await mongoose.connect(`${process.env.MONGODB}/${DB_Name}`)
//     App.on('error',(error)=>
//         {
//             console.log('Server Connection failed :- ',error );
//             throw(error);
//         })

//     App.listen(process.env.PORT,()=>{
//         console.log(`Server is running on server ${process.env.PORT}`);

//     })
//     } catch (error) {
//         console.log('Connection Not formed :- ',error);
//         throw(error);
//     }
//     })()

// when async return something it will give a promise 
databaseConnectionn()
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
        console.log(`App listening on ${process.env.PORT}`);
    })
})
.catch((error)=>console.log("DB Connection Failed : -",error ))
