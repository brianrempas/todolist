var mysql = require('mysql');
var fs = require('fs'); 

function createDatabaseConnection() {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todolist"
  });

  con.connect(function(err) {
    if (err) throw err;
    //console.log("Connected to the database!");

    exportTableToJson('users', 'users.json', con, function() {
      exportTableToJson('todo', 'todo.json', con, function() {
        // Optionally, you can perform additional operations here after exporting data.
        con.end(function(err) {
          if (err) throw err;
          console.log("Updated JSON.");
        });
      });
    });
  });

  return con;
}

function exportTableToJson(tableName, fileName, connection, callback) {
  var sql = `SELECT * FROM ${tableName}`;
  connection.query(sql, function(err, result, fields) {
    if (err) throw err;

    var jsonData = JSON.stringify(result);

    fs.writeFile(fileName, jsonData, 'utf8', function(err) {
      if (err) throw err;
      //console.log(`Data from ${tableName} has been exported to ${fileName}`);
      callback();
    });
  });
}

module.exports = createDatabaseConnection;
