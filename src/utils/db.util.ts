import mongoose from 'mongoose';

export const  createMongoConnection = async () => {
    try{
        if(mongoose.connection.readyState !==1){
            const MONGO_URL=process.env.MONGO_DB_URL!;
            await mongoose.connect(MONGO_URL, {
                minPoolSize: 5,
                dbName: process.env.MONGO_DB_NAME!,
            });
            console.log("MongoDB connection established successfully.");
        }else{
            console.log("Db already connected, reusing the connection.");
        }
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};