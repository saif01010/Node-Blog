import {connectDB} from './db/db.js';
import {app} from './app.js';

connectDB().then(async()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err=>{
    console.log(err, "Database connection failed");
    process.exit(1);
}))