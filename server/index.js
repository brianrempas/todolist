require('dotenv').config()
const fdb = require('./fdb');

const express = require('express');
const fs = require('fs');
const jsonData = fs.readFileSync('users.json', 'utf8');
const parsedData = JSON.parse(jsonData);
const jsonDatatodo = fs.readFileSync('todo.json', 'utf8');
const parsedDatatodo = JSON.parse(jsonDatatodo);
const app = express();
const port = 3000;
const pool = require('./db');
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser') 
app.use(bodyparser.urlencoded())
app.use(bodyparser.json())

var cors = require('cors')

app.use(cors())

app.post('/user/ToDoPage', authenticateToken, (req, res) => {
  const jsonData = fs.readFileSync('users.json', 'utf8');
  const parsedData = JSON.parse(jsonData);
  const jsonDatatodo = fs.readFileSync('todo.json', 'utf8');
  const parsedDatatodo = JSON.parse(jsonDatatodo);
  const filteredData = parsedDatatodo.filter(post => post.userid === req.payload.id);
  const filteredDataUsers = parsedData.filter(post => post.id === req.payload.id);
  const combinedData = [
    {
      todoData: filteredData
    },
    {
      userData: filteredDataUsers
    }
  ];

  res.status(201).json(combinedData);
})

app.post('/user/create', (req, res) => {
  const param1 = req.body.name;
  const param2 = req.body.username;
  const param3 = req.body.password;
  
  var jsonData = fs.readFileSync('users.json', 'utf8');
  var parsedData = JSON.parse(jsonData);

  const userreq = parsedData.find(userData => 
      userData.username === param2
  );

  if (userreq) {
      console.log('failed: same username')
      res.send('failed: same username')
  } else {
      const insertQuery = 'INSERT INTO users (name, username, password) VALUES (?, ?, ?)';
      pool.query(insertQuery, [param1, param2, param3]);
      fdb();
      console.log('creating account success')
      res.send('success')
  }

  
})

success = false;

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET /*, { expiresIn: '120s' }*/)
}

app.post('/user/login', (req, res) => {
  const param1 = req.body.username;
  const param2 = req.body.password;
  var jsonData = fs.readFileSync('users.json', 'utf8');
  var parsedData = JSON.parse(jsonData);

  const user = parsedData.find(userData => 
      userData.username === param1 && userData.password === param2
  );

  if (user) {
      console.log("Login Successful!");
      const payload = { username: user.username, id: user.id };
      const token = generateAccessToken(payload);
      const rToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      res.status(201).json({ success: true, message: 'Logged in successfully', token: token, rtoken: rToken });
  } else {
      console.log("Login Failed.");
      res.status(201).json({ success: false, message: 'Logged in failed', token: '', rtoken: '' });
  }
  
});

//query param header

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.payload = payload;
                next();
            });
        } else {
            req.payload = payload;
            next();
        }
    });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/api/todos', authenticateToken, (req, res) => {
  const { username, todo, deadline, complete, userid } = req.body;
  const insertQuery = 'INSERT INTO todo (username, todo, deadline, complete, userid) VALUES (?, ?, ?, ?, ?)';

  pool.query(insertQuery, [username, todo, deadline, complete, userid], (err, result) => {
    if (err) {
      console.error('Error inserting to-do item:', err);
      return res.status(500).json({ success: false, message: 'Failed to create to-do item' });
    } else {

      const createdTodoId = result.insertId;
      
      fdb();

      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        todo: { id: createdTodoId, username, todo, deadline, complete, userid }
      });
    }
  });
});



app.put('/api/todos/:id', authenticateToken, (req, res) => {
    const idToUpdate = req.params.id;
    const { todo, deadline, complete } = req.body;
    console.log(req.body)
    
    const updateQuery = 'UPDATE todo SET todo = ?, deadline = ?, complete = ? WHERE id = ?';

    pool.query(updateQuery, [todo, deadline, complete, idToUpdate], (err, result) => {
      if (err) {
        console.error('Error updating to-do item:', err);
        res.status(500).json({ success: false, message: 'Failed to update to-do item' });
      } else {

      const createdTodoId = result.insertId;
      
      fdb();

      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        todo: { id: createdTodoId, todo, deadline, complete }
      });
      }
    });
  });
  

  app.delete('/api/todos/:id', authenticateToken, (req, res) => {
    const idToDelete = req.params.id;

    const deleteQuery = 'DELETE FROM todo WHERE id = ?';
  
    pool.query(deleteQuery, [idToDelete], (err, result) => {
      if (err) {
        console.error('Error deleting to-do item:', err);
        res.status(500).json({ success: false, message: 'Failed to delete to-do item' });
      } else {
        const deletedTodo = result.insertId;
        fdb();
        res.status(201).json({ success: true, message: 'Todo deleted successfully', todo: { id: deletedTodo, idToDelete } });
      }
    });
  });
  
  
  