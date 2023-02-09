// npm i sequelize
const Sequelize = require('sequelize')

const usuarios_model = require('../models/Users')

const conexion = new Sequelize(
  // base_datos, usuario, password
  'x82tpa97h7tphgou',
  'r23j7plo93i86u6h',
  'sgafn3e20e4g5rmx',
  {
    //'logisticabd', 'root', '', {
    host: 'en1ehf30yom7txe7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    //host: 'localhost',
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
