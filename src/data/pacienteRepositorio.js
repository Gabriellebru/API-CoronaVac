const pacienteRepositorio = require('../models/paciente.js');
const calculadoraImc = require('../util/imc.js')

//ok
module.exports.buscaPacientePorEmail = async function (email) {
    return pacienteRepositorio.findOne({ email });
}

//ok
module.exports.insereUsuario = async function (novoUsuario) {
    const { nome, email, senha } = novoUsuario;
    const retornoUsuario = await pacienteRepositorio.create({
        nome, email, senha
    });
    return retornoUsuario;
}

module.exports.removeUsuario = async function (email) {
    return await pacienteRepositorio.deleteOne({ email })
}


//#region Antigo
module.exports.buscaPaciente = async function () {
    return pacienteRepositorio.find();
}

module.exports.buscaPacientePorCpf = async function (cpf) {
    return await pacienteRepositorio.find({ cpf });
}

module.exports.inserePaciente = async function (novoPaciente) {
    const { nome, cpf, altura, peso, imc, classificacao, dataNascimento, cidade, UF, listaComorbidades, JaTeveCovid, email, senha } = novoPaciente;
    const retornoPaciente = await pacienteRepositorio.create({
        nome, cpf, altura, peso, imc, classificacao, dataNascimento, cidade, UF, listaComorbidades, JaTeveCovid, email, senha
    });
    return retornoPaciente;
}
module.exports.atualizaSenha = async function (Login) {
    const { email, senha } = Login;
    await pacienteRepositorio.updateOne(
        {
            email
        },
        {
            $set: { senha }
        }
    );
    return true;
}

module.exports.atualizaPaciente = async function (atualizaPaciente) {
    const {
        email,
        cpf,
        altura,
        peso,
        dataNascimento,
        cidade,
        UF,
        listaComorbidades,
        JaTeveCovid,
        imc = calculadoraImc.imc(peso, altura),
        classificacao = calculadoraImc.classificacao(calculadoraImc.imc(peso, altura))
    } = atualizaPaciente;

    const PacienteAtualizado = await pacienteRepositorio.updateOne(
        { email },
        {
            $set:
            {
                email,
                cpf,
                altura,
                peso,
                dataNascimento,
                cidade,
                UF,
                listaComorbidades,
                JaTeveCovid,
                imc,
                classificacao
            }
        }
    );
    return true;
}

module.exports.removePaciente = async function (cpf) {
    return pacienteRepositorio.deleteOne({ cpf });
}

module.exports.verificaEmailSenha = function (email, senha) {
    return pacienteRepositorio.findOne({ email, senha });
}

//#endregion Antigo
