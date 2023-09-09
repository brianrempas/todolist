var mysql1 = require('mysql');
var fs = require('fs'); 

var con = mysql1.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todolist"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");

  var sql = "SELECT * FROM users";
  con.query(sql, function(err, result, fields) {
    if (err) throw err;

    var jsonData = JSON.stringify(result);

    fs.writeFile('users.json', jsonData, 'utf8', function(err) {
      if (err) throw err;
      console.log("Data has been exported to users.json");
    });

  });

  var sql = "SELECT * FROM todo";
  con.query(sql, function(err, result, fields) {
    if (err) throw err;

    var jsonData = JSON.stringify(result);

    fs.writeFile('todo.json', jsonData, 'utf8', function(err) {
      if (err) throw err;
      console.log("Data has been exported to todo.json");
    });

  });

  
});

module.exports = con;



/*const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: '172.19.14.118',
  database: 'todolist2',
  password: 'admin123',
  port: 5432, // Replace with your PostgreSQL port if different
});

pool.connect(function (err, client, done) {
  if (err) throw err;
  console.log("Connected to database!");

  // Export data from the "users" table
  var usersSql = "SELECT * FROM users";
  pool.query(usersSql, function (err, usersResult) {
    if (err) throw err;

    var usersData = JSON.stringify(usersResult.rows);

    fs.writeFile('user.json', usersData, 'utf-8', function (err) {
      if (err) throw err;
      console.log("User data has been exported.");
    });

    // Export data from the "todo" table
    var todoSql = "SELECT * FROM todo";
    pool.query(todoSql, function (err, todoResult) {
      done(); // Release the client back to the pool
      if (err) throw err;

      var todoData = JSON.stringify(todoResult.rows);

      fs.writeFile('todo.json', todoData, 'utf-8', function (err) {
        if (err) throw err;
        console.log("Todo data has been exported.");
      });
    });
  });
});

module.exports = pool;*/

