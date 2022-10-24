const mongoose = require('mongoose');

const dbConection = async () => {
     try {
        await mongoose.connect(process.env.DB_CNN_STRING, {
             useNewUrlParser: true,
             useUnifiedTopology: true,
         });

        console.log('db online')

    } catch (error) {
        console.log(error)
         throw new Error('error en la base de datos');
    }
}

module.exports = {
    dbConection
}