const {Router} = require('express')
const usuario = require('../controllers/users');
//const {watchmen} = require('../utils/Validador');
const usuario_router = Router();

usuario_router.post('/register',usuario.RegistrarUsuario);
usuario_router.post('/login',usuario.LoginUsuario);
usuario_router.put('/update',usuario.UpdateUsuario);
usuario_router.get('/',usuario.DevolverUsuarios);
usuario_router.delete('/:id',usuario.DesactivarUsuario);
usuario_router.get('*',usuario.LoginUsuario);

module.exports=usuario_router
