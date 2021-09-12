import Sequelize, { Model } from "sequelize";
const sequelize = require("../index");

export class AutenticacaoModelo extends Model {
  id!: string
  id_usuario: string
  tipo: string
  codigo_link: string
  avaliacao: number
  avaliacao_seguranca: number
  avaliacao_privacidade: number
  data: Date
  pendente: boolean
  duracao: string
  turno_preferencial: string
  qtd_falha_credencial: string
  qtd_recuperacao_credencial: string
}

AutenticacaoModelo.init(
  {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    id_usuario: {
      type: Sequelize.UUIDV4,
    },
    tipo: Sequelize.STRING(20),
    codigo_link: Sequelize.STRING(255),
    avaliacao: Sequelize.INTEGER,
    avaliacao_seguranca: Sequelize.INTEGER,
    avaliacao_privacidade: Sequelize.INTEGER,
    data: Sequelize.DATE,
    pendente: Sequelize.BOOLEAN,
    duracao: Sequelize.STRING(20),
    turno_preferencial: Sequelize.STRING(20),
    qtd_falha_credencial: Sequelize.INTEGER,
    qtd_recuperacao_credencial: Sequelize.INTEGER
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: "autenticacoes",
    timestamps: false
  }
);
