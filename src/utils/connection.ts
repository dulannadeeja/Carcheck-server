import mongoose, { connect } from "mongoose";
import logger from "./logger";

// Connect to MongoDB
const connectMongo = async (): Promise<void> => {
    try {

        // Mongoose configuration
        const username = encodeURIComponent(process.env.MONGO_USERNAME as string);
        const password = encodeURIComponent(process.env.MONGO_PASSWORD as string);
        const cluster = process.env.MONGO_CLUSTER as string;
        const uri = `mongodb+srv://${username}:${password}@${cluster}/node_project?retryWrites=true&w=majority`;

        await mongoose.connect(uri);
        logger.info('Databse connected successfully!');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectMongo;