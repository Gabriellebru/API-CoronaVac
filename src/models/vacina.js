const mongoose = require('mongoose');
const vacinaSchema = new mongoose.Schema({

    nome : String,
     dataSolicitacao : Date,
     dataPrevista : Date,
     numeroDose : Number,
     flTomou : String,
     dataVacinacao : Date,
     cpf : String
});

module.exports = mongoose.model('Vacina',vacinaSchema);
