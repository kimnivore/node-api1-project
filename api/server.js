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
// httpie test: http get localhost:9000/api/users/:id
server.get('/api/users/:id', (req, res) => {
    let { id } = req.params;
    model.findById(id)
        .then(user => {
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
// httpie test: http delete localhost:9000/api/users/:id
server.delete('/api/users/:id', (req, res) => {
    let { id } = req.params;
    model.remove(id)
        .then(user => {
            if(user == null) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
                return;
            } 
                res.status(200).json(user);
        })
        .catch(() => {
            res.status(500).json({ message: "The user could not be removed" });
        })
})

// When the client makes a PUT request to /api/users/:id:
// httpie test: http put localhost:9000/api/users/k6Ci3 bio="super mom" name="kim nguyen"
server.put('/api/users/:id', async (req, res) => {
    let {id} = req.params;
    try {
        let user = await model.findById(id);
        if(user == null) {
            res.status(404).json({ message: "The user with the specified ID does not exist" });
            return;
        }
        let body = req.body;
        if(!body.name)  {
            res.status(400).json({ message: "Please provide name and bio for the user" });
        } else if(!body.bio) {
            res.status(400).json({ message: "Please provide name and bio for the user" });
        } else {
            let newUser = await model.update(id, body);
            res.status(200).json(newUser);
    }
    } catch(e) {
        res.status(500).json({ message: "The user information could not be modified" });
    }
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
