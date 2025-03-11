import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}
// in this page we are connecting the database in NEXT.js 
const connection: ConnectionObject = {}

 export default async function dbConnect(): Promise<void> {

    if (connection.isConnected) {
        console.log("Alrady Connected To Database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGOOSE_URI!)
        console.log(db);
        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected");

    } catch (error) {
        console.log("DataBase Connection Failed", error);
        process.exit(1);
    }

}

