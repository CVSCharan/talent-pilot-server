import mongoose from 'mongoose';
import logger from './logger';

const connectDB = async () => {
    try {
        // For production, you might want to configure more options,
        // such as connection pooling (though Mongoose has defaults),
        // timeouts, and auto-reconnection.
        // Example:
        // const options = {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
        //   serverSelectionTimeoutMS: 5000,
        //   socketTimeoutMS: 45000,
        // };
        await mongoose.connect(process.env.MONGO_URI!);
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;