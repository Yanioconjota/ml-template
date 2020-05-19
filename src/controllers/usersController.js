const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

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
    //Crear objeto con todas las propiedades del form
    const newId = users.length + 1;
    const newUser = {
      id: newId,
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      image: req.files[0].filename
    };
    // Lo agregamos al objeto original
    const finalUser = [...users, newUser]; //Esto crea un nuevo array con todos los onjetos del array y agrega una nueva posicion con el objeto que creamos
    // res.send(finalUser)
    // Sobrescrivimos el JSON
    //res.send(finalUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(finalUser, null, ' '));
    // redirigimos a la home
    res.redirect('/users/profile/' + newId);
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
  validate: (req, res) => {
    // Validar la contraseña utilizando bcrypt.compareSync()
    // mostrar la view de login con un error.
    // Redireccionar a la home
    const email = req.body.email;
    const password = req.body.password;

    const user = users.find((user) => {
      return user.email == email;
    });

    if (!user) {
      res.render('login', {
        error: 'Usuario no encontrado!'
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      res.render('login', {
        error: 'Password incorrecto!'
      });
    }

     res.render('login');
  }
};

module.exports = controller;
