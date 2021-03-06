const express = require("express");
const cors = require('cors');

const routes = require('./routes/pacienteRota');
const routes2 = require('./routes/vacinaRota');
const Authroutes = require("./routes/authRota");
const connectDB = require("./infra/database");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', Authroutes);
app.use('/paciente', routes);
app.use('/vacina', routes2);


module.exports = app.listen(process.env.PORT || 3333, () => {
    console.log("Server running");
});