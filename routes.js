const express = require('express');
const app = express.Router();

const userRouter = require('./api/user.js');

app.post('/users', userRouter.createUser);
app.get('/users/:id', userRouter.getUserById);
app.get('/users', userRouter.getAllUser);
app.put('/users/:id', userRouter.updateUser);
app.delete('/users/:id', userRouter.deleteUser);


module.exports = app;
