const express = require("express");
const cors = require('cors');

const routes = require('./Routes/pacienteRota');
const routes2 = require ('./Routes/vacinaRota');
const Authroutes = require("./Routes/authRota");
const connectDB = require("./Infra/database");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', Authroutes );
app.use('/paciente', routes);
app.use('/vacina', routes2);

module.exports = app.listen(process.env.PORT || 3333, () => {
    console.log("Server running");
});