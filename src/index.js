const express = require('express');
const app = express();

app.use(express.json());


app.post('/paciente', (request,response)=>{
    console.log(request.body);
    return response.json({"mensagem":`Olá ${request.body.nome}`});
});

app.get('/paciente/:nome', (request,response) =>{
    return response.send("Olá mundo" + request.params.nome);

});

app.listen(3333);
