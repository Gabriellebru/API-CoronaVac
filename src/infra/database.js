require('dotenv').config({path: './src/Config/.env'});

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log("Sucesso ao conectar no MongoDB ");
    } catch (error) {
        console.error("Falha ao conectar no MongoDB");
        process.exit(1);
    }
};

module.exports = connectDB;