const { body, validationResult } = require("express-validator");
const { validarCPF } = require("../validations/cpfValidations");
const pacienteServico = require("../services/pacienteService");

const PacienteCadastroRules = () => {
  return [
    body("nome")
      .notEmpty()
      .withMessage("Nome é obrigatório"),

    body("email")
      .custom(async (value) => {
        const resultadoPaciente = await pacienteServico.buscaPacientePorEmail(value);
        if (resultadoPaciente != null) {
          throw new Error("Email já existe, cadastro não permitido!");
        }
        return false;
      })
      .withMessage("Email já existe , cadastro não permitido"),

    body("email")
      .isEmail()
      .withMessage("Email inválido"),

    body("senha")
      .notEmpty()
      .withMessage("Senha obrigatória")
  ]
}

const PacienteValidationRules = () => {
  return [
    body("email").isEmail().withMessage("E-mail inválido"),
    body("email").notEmpty().withMessage("E-mail obrigatório!!"),
    body("nome").notEmpty().withMessage("Nome obrigatório!!"),
    body("nome")
      .isLength({ min: 5, max: 100 })
      .withMessage("Mínimo 5 caracteres e Máximo 100 caracteres"),
    body("senha").notEmpty().withMessage("Senha obrigatória!!"),
    body("peso")
      .notEmpty()
      .isLength({ min: 1, max: Infinity })
      .withMessage("Inserir o peso!!"),

    body("altura")
      .notEmpty()
      .isLength({ min: 1, max: Infinity })
      .withMessage("Inserir a altura!!"),

    body("cpf")
      .isLength({ min: 11, max: 11 })
      .withMessage("Tamanho deve ser de 11 caracteres"),

    body("dataNascimento")
      .notEmpty()
      .withMessage("Data de Nascimento é obrigatória!!"),

    body("email")
      .custom(async (value) => {
        const resultadoPaciente = await pacienteServico.buscaPacientePorEmail(
          value
        );
        if (resultadoPaciente != null) {
          throw new Error("Email já existe, cadastro não permitido!");
        }
        return true;
      })
      .withMessage("Email já existe , cadastro não permitido"),

    body("cpf").notEmpty().withMessage("CPF obrigatório"),
    body("cpf")
      .custom((value) => {
        if (!validarCPF(value)) throw new Error("CPF é inválido!");
        return true;
      })
      .withMessage("Cpf inválido"),
    body("cpf").custom(async (value) => {
      const resultadoPaciente = await pacienteServico.buscaPacientePorCpf(
        value
      );
      if (resultadoPaciente != null) {
        throw new Error("CPF já existe, cadastro não permitido!");
      }
      return true;
    }),
  ];
};

const CompletaCadastroValidationRules = () => {
  const errors = [
    body("cpf")
      .custom((value) => {
        if (!validarCPF(value)) throw new Error("CPF é inválido!");
        return true;
      })
      .withMessage("CPF: inválido"),

    body("peso").isLength({ min: 1, max: Infinity }).withMessage("Peso: inválido"),

    body("altura").isLength({ min: 1, max: Infinity }).withMessage("Altura: inválido"),

    body("dataNascimento").notEmpty().withMessage("Data de nascimento: obrigatório"),

    body("cidade").notEmpty().withMessage("Cidade: obrigatório"),

    body("UF").notEmpty().withMessage("UF: obrigatório"),

    body("listaComorbidades").notEmpty().withMessage("Comorbidades: obrigatório"),

    body("JaTeveCovid").notEmpty().withMessage("Covid: obrigatório")
  ]
  return errors
}

module.exports = {
  PacienteValidationRules,
  PacienteCadastroRules,
  CompletaCadastroValidationRules
};