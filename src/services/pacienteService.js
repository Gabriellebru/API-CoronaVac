const pacienteRepositorio = require('../data/pacienteRepositorio.js');
const calculadoraImc = require('../util/imc');

module.exports.RedefinirSenha = async function (email, senha) {
  const login = await pacienteRepositorio.buscaPacientePorEmail(email);
  if (login != null && login.email != undefined) {
    login.senha = senha
    return await pacienteRepositorio.atualizaSenha(login)
  }
  else {
    return false;
  }
}

module.exports.removeUsuario = async function (email) {
  const pacienteRetorno = await pacienteRepositorio.buscaPacientePorEmail(email);
  if (pacienteRetorno != null && pacienteRetorno.length == 0) {
    return false;
  }
  await pacienteRepositorio.removeUsuario(email)
  const retorno = await pacienteRepositorio.buscaPacientePorEmail(email);
  return true
}


//ok
module.exports.buscaPacientePorEmail = async function (email) {
  return await pacienteRepositorio.buscaPacientePorEmail(email);
};


module.exports.cadastraUsuario = async function (novoUsuario) {
  const usuarioRetorno = await pacienteRepositorio.buscaPacientePorEmail(novoUsuario.email);
  if (!usuarioRetorno) {
    return pacienteRepositorio.insereUsuario(novoUsuario);
  }
  return null
};

// module.exports.atualizaPaciente = async function (atualizaPaciente) {
//   const pacienteRetorno = await pacienteRepositorio.buscaPacientePorEmail(
//     atualizaPaciente.email
//   );
//   if (pacienteRetorno.length == 0) {
//     return false;
//   }

//   const resultadoPaciente = await pacienteRepositorio.atualizaPaciente(
//     atualizaPaciente
//   );
//   return true;
// };


//#region Antigo

module.exports.buscaPaciente = async function () {
  return pacienteRepositorio.buscaPaciente();
};

module.exports.buscaPacientePorCpf = async function (cpf) {
  return await pacienteRepositorio.buscaPacientePorCpf(cpf);
};

module.exports.inserePaciente = async function (novoPaciente) {
  const pacienteRetorno = await pacienteRepositorio.buscaPaciente(
    novoPaciente.cpf
  );
  if (!pacienteRetorno) {
    return null;
  }
  const { peso, altura } = novoPaciente;
  let imc = calculadoraImc.imc(peso, altura);
  let classificacao = calculadoraImc.classificacao(imc);
  novoPaciente.imc = imc;
  novoPaciente.classificacao = classificacao;
  return pacienteRepositorio.inserePaciente(novoPaciente);
};

module.exports.atualizaPaciente = async function (atualizaPaciente) {
  const pacienteRetorno = await pacienteRepositorio.buscaPacientePorEmail(
    atualizaPaciente.email
  );
  if (pacienteRetorno.length == 0) {
    return false;
  }
  const resultadoPaciente = await pacienteRepositorio.atualizaPaciente(atualizaPaciente);
  return true;
};

module.exports.removePaciente = async function (cpf) {
  const pacienteRetorno = await pacienteRepositorio.buscaPacientePorCpf(cpf);
  if (pacienteRetorno.length == 0) {
    return false;
  }

  const resultadoPaciente = await pacienteRepositorio.removePaciente(cpf);
  return true;
};

module.exports.verificaEmailSenha = function (email, senha) {
  return pacienteRepositorio.verificaEmailSenha(email, senha);
};

//#endregion Antigo
