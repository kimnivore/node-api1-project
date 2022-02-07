// BUILD YOUR SERVER HERE

const express = require('express');
const model = require('./users/model');
const server = express();

server.use(express.json());

// When the client makes a POST request to /api/users:
// httpie test: http post localhost:9000/api/users name="kim" bio="my bio"
server.post('/api/users', (req, res) => {
    let body = req.body;
    if(!body.name)  {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else if(!body.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        model.insert(body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(() => {
                res.status(500).json({ message: "There was an error while saving the user to the database" });
            });
    }
});

// When the client makes a GET request to /api/users:
// httpie test: http get localhost:9000/api/users
server.get('/api/users', (req, res) => {
    model.find()
        .then(users => {
            res.json(users);
        })
        .catch(() => {
            res.status(500).json({ message: "The users information could not be retrieved" });
        })
})

// When the client makes a GET request to /api/users/:id:
server.get('/api/users/:id', (req, res) => {
    let { id } = req.params;
    model.findById(id)
        .then(user => {
            console.log(user);
            if(user == null) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            } else {
                res.json(user);
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The user information could not be retrieved" });
        })
})

// When the client makes a DELETE request to /api/users/:id:

// When the client makes a PUT request to /api/users/:id:

module.exports = server; // EXPORT YOUR SERVER instead of {}
