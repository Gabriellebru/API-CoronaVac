const { Router, request } = require('express');
const pacienteServico = require('../services/pacienteService.js');
const autenticacaoJWT = require('../services/authService.js');
const { validate } = require('../validations/validations.js');
const {
  PacienteValidationRules,
  PacienteCadastroRules,
  CompletaCadastroValidationRules,
  RedefinirSenhaValidationRules
} = require('../validations/pacienteValidations.js');

const routes = Router();

//Metodo para login
//ok
routes.post(
  "/Login", async (request, response) => {
    const { email, senha } = request.body;

    const Login = {
      email,
      senha
    };

    const pacienteRetorno = await pacienteServico.buscaPacientePorEmail(email);
    if (pacienteRetorno != null && pacienteRetorno.length != 0 && pacienteRetorno.email == Login.email && pacienteRetorno.senha == Login.senha) {
      if (
        pacienteRetorno.cpf != undefined &&
        pacienteRetorno.cidade != undefined &&
        pacienteRetorno.peso != undefined &&
        pacienteRetorno.altura != undefined &&
        pacienteRetorno.dataNascimento != undefined &&
        pacienteRetorno.UF != undefined &&
        pacienteRetorno.listaComorbidades != undefined &&
        pacienteRetorno.JaTeveCovid != undefined
      ) {
        return response.status(200).json({ "auth": true, "needMoreInfo": false, pacienteRetorno })
      }
      else {
        return response.status(200).json({ "auth": true, "needMoreInfo": true, pacienteRetorno });
      }
    }
    return response.status(401).json({ ERROR: "Login incorreto" });
  }
);


routes.delete("/DeletarUsuario/:email", async (request, response) => {
  const { email } = request.params;
  const pacienteRetorno = await pacienteServico.removeUsuario(email);
  if (!pacienteRetorno) {
    return response.status(404).json({ error: "usuario não encontrado!!" });
  }
  return response.status(200).json({ Message: `usuario ${email} removido` });
}
);


routes.post('/AtualizaCadastro', CompletaCadastroValidationRules(), validate, async (request, response) => {
  const {
    email,
    cpf,
    peso,
    altura,
    dataNascimento,
    cidade,
    UF,
    listaComorbidades,
    JaTeveCovid
  } = request.body

  const Login = {
    email,
    cpf,
    peso,
    altura,
    dataNascimento,
    cidade,
    UF,
    listaComorbidades,
    JaTeveCovid
  }

  const Atualizado = await pacienteServico.atualizaPaciente(Login)
  if (Atualizado) {
    return response.status(200).json({ "atualizado": true, "Mensagem": "Atualizado" })
  } else {
    return response.status(404).json({ "atualizado": false, "Mensagem": "Paciente não encontrado" })
  }

})

//Metodo para cadastro 
//ok
routes.post(
  "/Cadastro",
  PacienteCadastroRules(),
  validate,
  async (request, response) => {
    const { nome, email, senha } = request.body;
    const novoUsuario = { nome, email, senha };
    const usuarioRetorno = await pacienteServico.cadastraUsuario(novoUsuario);
    if (usuarioRetorno == null) {
      return response.status(500).json({ "error": "Email ja cadastrado" })
    }
    return response.status(201).json({ "auth": true, usuarioRetorno });
  }
);

//Metodo para redefinir senha 

routes.put("/RedefinirSenha", RedefinirSenhaValidationRules(), validate, async (request, response) => {
  const { email, senha } = request.body;
  const redefinida = await pacienteServico.RedefinirSenha(email, senha)
  if (redefinida) {
    return response.status(200).json({ "Mensagem": "Senha alterada com sucesso" });
  }
  else {
    return response.status(404).json({ "Mensagem": "Email não encontrado" });
  }

});


routes.get("/", async (request, response) => {
  const pacienteRetorno = await pacienteServico.buscaPaciente();
  return response.json(pacienteRetorno);
});

routes.get(
  "/:cpf",
  autenticacaoJWT.verificarToken,
  async (request, response) => {
    const { cpf } = request.params;
    const pacienteRetorno = await pacienteServico.buscaPacientePorCpf(cpf);
    return response.json(pacienteRetorno);
  }
);

routes.post(
  "/",
  PacienteValidationRules(),
  validate,
  async (request, response) => {
    const {
      nome, cpf, altura, peso, imc, classificacao, dataNascimento, cidade, UF, listaComorbidades, JaTeveCovid, email, senha,
    } = request.body;

    const novoPaciente = {
      nome, cpf, altura, peso, imc, classificacao, dataNascimento, cidade, UF, listaComorbidades, JaTeveCovid, email, senha,
    };
    const pacienteRetorno = await pacienteServico.inserePaciente(novoPaciente);
    if (pacienteRetorno === null) {
      response
        .status(500)
        .json({ ERROR: "CPF Paciente já existe. Paciente do not be inserted" });
    }
    return response.status(201).json({ pacienteRetorno });
  }
);

// routes.put("/:cpf", async (request, response) => {
//   const { cpf } = request.params;
//   const {
//     nome, altura, peso, dataNascimento, cidade, UF, listaComorbidades, JaTeveCovid,
//   } = request.body;
//   const pacienteAtualizar = {
//     nome, cpf, nome, altura, peso, dataNascimento, cidade, UF, listaComorbidades, JaTeveCovid, email, senha,
//   };
//   const pacienteRetorno = await pacienteServico.atualizaPaciente(
//     pacienteAtualizar
//   );
//   if (!pacienteRetorno) {
//     return response.status(404).json({ error: "Paciente não encontado!" });
//   }
//   return response.status(200).json({ ok: "Paciente Atualizado!" });
// });

// routes.delete(
//   "/:cpf",
//   autenticacaoJWT.verificarToken,
//   async (request, response) => {
//     const { cpf } = request.params;
//     const pacienteRetorno = await pacienteServico.removePaciente(cpf);
//     if (!pacienteRetorno) {
//       return response.status(404).json({ error: "Paciente não encontrado!!" });
//     }
//     return response.status(200).json({ Message: `Paciente ${cpf} removido` });
//   }
// );

module.exports = routes;
