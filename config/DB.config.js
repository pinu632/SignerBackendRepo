import mongoose  from "mongoose";

export const ConnectMongoDB = async () =>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`database connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}