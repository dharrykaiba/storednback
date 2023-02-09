// npm i sequelize
const Sequelize = require('sequelize')

const usuarios_model = require('../models/Users')

const conexion = new Sequelize(
  // base_datos, usuario, password
  //"zdc58c8s6qvupnl6","akdwms2xpd649quo", "nc1dtn4c8w3wfdq4",{
  'logisticabd',
  'root',
  '',
  {
    //host:"vkh7buea61avxg07.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-05:00',
    logging: false, // para no mostrar los scripts en consola
    // opciones extras
    dialectOptions: {
      dateStrings: true
    }
  }
)

const Users = usuarios_model(conexion)

module.exports = {
  conexion: conexion,
  Users: Users
}
