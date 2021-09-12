import Sequelize from "sequelize";
import { Model } from "sequelize";
const sequelize = require("../index");

export class UsuarioModelo extends Model {
  id!: string
  nome: string
  cpf: string
  celular: string
  senha: string
  area_atuacao: string
  inicializado: boolean
  notificado: boolean
}

UsuarioModelo.init(
  {
    nome: Sequelize.STRING(60),
    cpf: Sequelize.STRING(11),
    celular: Sequelize.STRING(11),
    senha: Sequelize.STRING(255),
    area_atuacao: Sequelize.STRING(40),
    inicializado: Sequelize.BOOLEAN, 
    notificado: Sequelize.BOOLEAN,
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: "usuarios",
    timestamps: false
  }
);
