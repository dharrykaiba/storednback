const Sequelize = require('sequelize')
const { DataTypes } = require('sequelize')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const usuarios_model = conexion => {
  let usuarios = conexion.define(
    'Usuarios',
    {
      usuId: {
        field: 'usuId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
        unique: true
      },
      usuName: {
        field: 'usuName',
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        noUpdate: true
      },
      usuEmail: {
        field: 'usuEmail',
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      usuActive: {
        field: 'usuActive',
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      usuHash: {
        field: 'usuHash',
        type: Sequelize.TEXT
      },
      usuSalt: {
        field: 'usuSalt',
        type: Sequelize.TEXT
      }
    },
    {
      tableName: 't_usuarios',
      timestamps: true
    }
  )
  usuarios.prototype.setSaltAndHash = function (password) {
    // uso su metodo randomBytes el cual va a generar una cadena aleatoria de bytes con una longitud de 16 y luego eso lo convierto a formato string para que pueda ser almacenado en la base de datos a formato hexadecimal
    // https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
    this.usuSalt = crypto.randomBytes(16).toString('hex')
    // agarra el salt generado anteriormente y lo combina con la contraseña mediante un cierto numero de ciclos pasados como 3er parametro y al final le decimos en que longitud queremos esa encriptacion y que algoritmo deseamos que se use para la encriptacion y luego eso lo convierto a formato string para que pueda ser almacenado en la base de datos a formato hexadecimal
    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    this.usuHash = crypto
      .pbkdf2Sync(password, this.usuSalt, 1000, 64, 'sha512')
      .toString('hex')
  }
  usuarios.prototype.validarPassword = function (password) {
    let hashTemporal = crypto
      .pbkdf2Sync(password, this.usuSalt, 1000, 64, 'sha512')
      .toString('hex')
    // si la hash temporal es exactamente igual que la hash almacenada en la bd significa que las contraseñas concuerdan y por ende retorno True
    if (hashTemporal === this.usuHash) {
      return true
    } else {
      return false
    }
  }
  usuarios.prototype.generarJWT = function () {
    // generar el payload
    // el payload es la parte intermedia del JWT y sirve para guardar informacion de timpo de vida e informacion adicional como el nombre del docente u otros.
    let payload = {
      usuId: this.usuId,
      perId: this.perId + ' ' + this.usuName
    }
    // esta es la forma de generar la token, se manda el payload, la contraseña de la token y algunas opciones extras como la duracion y el algoritmo para su encriptacion
    let token = jwt.sign(
      payload,
      'codigo',
      { expiresIn: 600 * 10 },
      { algorithm: 'RS256' }
    )
    //console.log(token);
    return token
  }
  return usuarios
}
module.exports = usuarios_model
