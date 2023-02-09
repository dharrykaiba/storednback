const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { conexion } = require('./Sequelize')
const usuario_router = require('../routers/Users')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT || 3001
    this.habilitarCORS()
    this.configurarBodyParser()
    this.definirRutas()
    /*this.conectarMongo();*/
  }
  habilitarCORS () {
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      next()
    })
  }

  configurarBodyParser () {
    this.app.use(bodyParser.json())
  }
  definirRutas() {
		this.app.use(morgan('dev'));
		this.app.get('/', (req, res) => {
			res.status(200).json({
				ok: true,
				message: 'La API Funciona! 😊🎃😎🎉'
			});
		});
		this.app.use('/user',usuario_router);

	}
  start () {
    this.app.listen(this.port, () => {
      console.log('Server ON Port: ' + this.port)
      //conexion.sync({ force: false, alter: true }).then(() => {
      //  console.log('Base de datos sincronizada correctamente')
      //})
    })
  }
}
module.exports = Server // export default class Server {....}
