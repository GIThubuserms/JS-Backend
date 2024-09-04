import dotenv from"dotenv";
import databaseConnectionn from"./db/connection.js";

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

databaseConnectionn()
