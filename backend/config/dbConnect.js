const mongoose = require('mongoose');

dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected successfully')
    }catch(error){
        console.log('DB connected failed:', error)
    }
}
dbConnect();