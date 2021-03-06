const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
const { check, validationResult, body } = require('express-validator');

const controller = {
  // Detail - Profile from user
  profile: (req, res) => {
    id = req.params.userId;
    const user = users.find(p => p.id == id);
    res.render('profile', {
      user: user
    });
  },
  // Create - Form to create
  create: (req, res, next) => {
    res.render('user-create-form');
  },
  // Create -  Method to store
  store: (req, res, next) => {
    //Guardar errores del validationResult de express-validator
    //Pasarselos a la vista de registro
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Si hay errores manda al usuario a registro mostrando los errores
      return res.render('user-create-form', {
        errors: errors.errors
      });
    }
    //Crear objeto con todas las propiedades del form
    const newUser = {
      id: users[users.length - 1].id + 1,
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      image: 'morgado.jpg'
    };
    // Lo agregamos al objeto original
    const finalUser = [...users, newUser]; //Esto crea un nuevo array con todos los onjetos del array y agrega una nueva posicion con el objeto que creamos
    // res.send(finalUser)
    // Sobrescrivimos el JSON
    //res.send(finalUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(finalUser, null, ' '));
    // redirigimos a la home
    res.redirect('/users/login');
  },
  // Update - Form to edit
  edit: (req, res) => {
    //obtener id del usuario
    id = req.params.userId;
    const userToEdit = users.find(p => p.id == id);
    //renderizar el formulario de edición con los datos obtenidos
    res.render('user-edit-form', {
      userToEdit: userToEdit
    });

  },
  // Update - Method to update
  update: (req, res, next) => {
    // editar usuario con id obtenido
    id = req.params.userId;
    const currentUser = users.find(p => p.id == id);
    currentUser.name = req.body.name;
    currentUser.lastname = req.body.lastname;
    currentUser.email = req.body.email;
    currentUser.password = bcrypt.hashSync(req.body.password, 10);
    currentUser.image = req.files[0].filename;
    // reescribir json
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, ' '));

    // volver al detalle
    res.redirect('/users/profile/' + id);
  },
  // Delete - Delete one user from DB
  destroy: (req, res) => {
    id = req.params.userId;
    let newUser = users.filter(p => p.id != id);
    fs.writeFileSync(usersFilePath, JSON.stringify(newUser, null, ' '));
    res.redirect('/');
  },
  login: (req, res) => {
    res.render('login');
  },
  // Loguea usuario
  logUser: (req, res) => {
    //Validar que exista el mail
    const theUser = users.find((user) => {
      return user.email === req.body.email;
    });
    if (theUser != undefined) {
      //Si existe el mail validamos que el password coincida usando bcrypt
      if (bcrypt.compareSync(req.body.password, theUser.password)) {
        //Si coincide generamos la sesión del usuario
        req.session.user = theUser;
        //Si recordar usuario está checheado guardamos la sesión en una cookie
        if (req.body.remember) {
          //1er parametro: nombre, 2: valor, 3: Duración em ms
          //Para guardar la cookie debe hacerse en singular (res.cookie.nombreCookie)
          res.cookie('user', theUser.id, {maxAge: 999999999999999});
          //Para requerir la cookie debe hacerse en plural (req.cookies.nombreCookie)
          console.log(req.cookies.user);
        }
        //Si la contraseña coincide redirigimos al perfil pasandole el ID de la sesión
        res.redirect('/users/profile/' + req.session.user.id);
        //si la pass no coincide lo mandamos a login con error
      } else {
        res.render('login', {
          error: 'Usuario incorrecto'
        });
      }
    } else {
      res.render('login', {
        error: 'Usuario incorrecto'
      });
    }
    //res.redirect('/');
  },
  // Show user profile
  profile: (req, res) => {
    if (req.session.user === undefined) {
      return res.redirect('/users/login');
    }
    res.render('profile', {
      user: req.session.user
    });
  }
};

module.exports = controller;
