const express = require('express');
const app = express();

/**
 * Generated CRUD for User
 * Fields: user_name:string, email:string, password:string
 * In-memory store for quick prototype
 */
let userStore = [];
let userNextId = 1;

// CREATE
exports.createUser = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        const payload = req.body || {};
        const newItem = {
            id: userNextId++,
            user_name: payload.user_name || null,
            email: payload.email || null,
            password: payload.password || null
        };
        userStore.push(newItem);
        response.code = 201;
        response.data = newItem;
        response.message = 'User created';
        return res.status(201).json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};

// READ ALL
exports.getAllUser = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        response.code = 200;
        response.data = userStore;
        response.message = 'List of User';
        return res.json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};

// READ ONE
exports.getUserById = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        const id = Number(req.params.id);
        const item = userStore.find(x => x.id === id);
        if (!item) {
            response.code = 404;
            response.message = 'User not found';
            return res.status(404).json(response);
        }
        response.code = 200;
        response.data = item;
        response.message = 'User found';
        return res.json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};

// UPDATE
exports.updateUser = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        const id = Number(req.params.id);
        const payload = req.body || {};
        const item = userStore.find(x => x.id === id);
        if (!item) {
            response.code = 404;
            response.message = 'User not found';
            return res.status(404).json(response);
        }

        if (payload.user_name !== undefined) item.user_name = payload.user_name;
        if (payload.email !== undefined) item.email = payload.email;
        if (payload.password !== undefined) item.password = payload.password;

        response.code = 200;
        response.data = item;
        response.message = 'User updated';
        return res.json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};

// DELETE
exports.deleteUser = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        const id = Number(req.params.id);
        const before = userStore.length;
        userStore = userStore.filter(x => x.id !== id);
        if (userStore.length === before) {
            response.code = 404;
            response.message = 'User not found';
            return res.status(404).json(response);
        }
        response.code = 204;
        response.message = 'User deleted';
        return res.status(204).json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};
