const { Users } = require('../config/Sequelize');
const { Op } = require('sequelize');

const RegistrarUsuario = (req, res) => {
	Users.findOne({
		where: {
			[Op.or]: [{ usuEmail: req.body.usuEmail }, { usuName: req.body.usuName }]
		}
	}).then(usuarioEncontrado => {
		if (usuarioEncontrado) {
			res.status(400).json({
				ok: false,
				message: 'Ya existe el usuario',
				content: null
			});
		} else {
			let nuevoUsuario = Users.build(req.body);
			nuevoUsuario.setSaltAndHash(req.body.password);
			nuevoUsuario
				.save()
				.then(usuarioCreado => {
					return res.status(201).json({
						ok: true,
						message: 'Usuario creado exitosamente',
						content: usuarioCreado
					});
				})
				.catch(error => {
					return res.status(500).json({
						ok: false,
						message: 'Hubo un error al crear el usuario: ' + error.name + error.fields,
						content: error
					});
				});
		}
	});
};

const LoginUsuario = (req, res) => {
	Users.findOne({
		where: {
			usuName: req.body.usuName
		}
	})
		.then(usuarioEncontrado => {
			if (usuarioEncontrado) {
				let resultado = usuarioEncontrado.validarPassword(req.body.password);
				if (resultado) {
					let token = usuarioEncontrado.generarJWT();
					return res.json({
						ok: true,
						content: null,
						token: token
					});
				} else {
					return res.json({
						ok: true,
						message: 'el usuario o la contraseña es incorrecta'
					});
				}
			} else {
				return res.status(404).json({
					ok: false,
					message: 'No existe el usuario',
					content: null
				});
			}
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({
				ok: false,
				content: error
			});
		});
};

const UpdateUsuario = (req, res) => {
	Users.findByPk(req.body.usuId)
		.then(usuarioBuscado => {
			//console.log(req.body);
			if (usuarioBuscado) {
				if (req.body.password) {
					let nuevapass = Users.build(req.body);
					nuevapass.setSaltAndHash(req.body.password);
					//console.log(nuevapass.dataValues)
					return Users.update(nuevapass.dataValues, {
						where: {
							usuId: req.body.usuId
						}
					});
				} else {
					return Users.update(req.body, {
						where: {
							usuId: req.body.usuId
						}
					});
				}
			} else {
				return res.status(404).json({
					ok: false,
					content: null,
					message: 'No se encontro al usuario'
				});
			}
		})
		.then(usuarioActualizado => {
			//console.log(usuarioActualizado.length);
			if (usuarioActualizado[0]) {
				return res.status(400).json({
					ok: true,
					content: null,
					message: 'Se actualizo los datos del usuario correctamente'
				});
			} else {
				return res.json({
					ok: false,
					content: null,
					message: 'No se actualizo los datos del usuario'
				});
			}
		})
		.catch(error => {
			res.status(500).json({
				ok: false,
				content: error,
				message: 'Hubo un error'
			});
		});
};

const DevolverUsuarios = async (req, res) => {
	try {
		let resultado = await Users.findAll();
		return res.json({
			ok: true,
			content: resultado,
			message: null
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			content: error,
			message: 'Hubo un error al devolver las sesiones'
		});
	}
};

const DesactivarUsuario =(req,res)=>{
    Users.findByPk(req.body.usuId).then((usuario)=>{
        if (usuario){
            return Users.update({usuActive:false}, {
                where:{
                    usuId: req.body.usuId
                }
            })
        }else{
            return res.status(404).json({
                ok: false,
                content: null,
                message: 'No se encontro el usuario'
            });
        }
    }).then((usuarioActualizado)=>{
        return res.json({
            ok:true,
            content: null,
            message:'Se elimino exitosamente el usuario'
        })
        
    }).catch((error)=>{
        res.status(500).json({
            ok:false,
            content:error,
            message:'Hubo un error'
        })
    });
}

module.exports = {
	RegistrarUsuario,
	LoginUsuario,
	UpdateUsuario,
	DevolverUsuarios,
	DesactivarUsuario
};
