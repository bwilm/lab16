var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var clientPath = path.join(__dirname, '../client');
var dataPath = path.join(__dirname, 'data.json');

var app = express();
app.use(express.static(clientPath));
app.use(bodyParser.json());

var mysql = require('mysql');

var pool = mysql.createPool({
 connectionLimit: 10,
 host: 'localhost',
 user: 'Brandon',
 password: '12345',
 database: 'ChirperDatabase'
});

app.route('/api/chirps')
    .get((req, res) => {
        getChirps().then((chirps) => {
            res.send(chirps);
        });
    }).post((req, res) => {
        let chirp = req.body;
        console.log(chirp);
        postChirp(chirp).then((newchirp)=>{
            res.send();
        })
    });
   
app.route('/api/chirps/:id')
    .delete((req, res) => {
        res.send(201);
        deletechirp(req.params.id);
    });
   

function getChirps() {
    return new Promise((resolve, reject) => {    
        pool.getConnection((err, connection) => {
            if (err) { 
                reject(err);
            } else {        
                connection.query("CALL getChirps();", function(err, chirpsSuccess) {
                    if(err) {               
                        connection.release();              
                        reject(err);           
                    } else {              
                        connection.release();              
                        resolve(chirpsSuccess[0]);           
                    }        
                });      
            }     
        })
    })     
}


    function postChirp(chirp){
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    reject(err);
                }
                else{
                    connection.query('CALL addChirp(?,?)', [chirp.user, chirp.message], (err,chirpadded) => {
                        if(err) {               
                            connection.release();              
                            reject(err);           
                        } else {              
                            connection.release();              
                            resolve(chirpadded[0]);           
                        }
                    })
                }
            })
        })
    }


    function deletechirp(chirpID){
        console.log('delete function');
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    reject(err);
                }
                else{
                    connection.query('CALL deleteSqlchirp(?)', [chirpID], (err,chirpdeleted) => {
                        if(err) {               
                            connection.release();              
                            reject(err);
                            console.log('error');          
                        } else {              
                            connection.release();              
                            resolve(chirpdeleted[0]); 
                            console.log('successful');
                                      
                        }
                    })
                }
            })
        })
    }
//  }) .post(function(req, res) {
//         var newChirp = req.body;
//         readFile(dataPath, 'utf8')
//         .then(function(fileContents) {
//             var chirps = JSON.parse(fileContents);
//             chirps.push(newChirp);
//             return writeFile(dataPath, JSON.stringify(chirps));
//         }).then(function() {
//             res.sendStatus(201);
//         }).catch(function(err) {
//             console.log(err);
//             res.sendStatus(500);
//         });
//     });

app.listen(3000);




// function readFile(filePath, encoding) {
//     return new Promise(function(resolve, reject) {
//         fs.readFile(filePath, encoding, function(err, data) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         });
//     });
// }

// function writeFile(filePath, data) {
//     return new Promise(function(resolve, reject) {
//         fs.writeFile(filePath, data, function(err) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve();
//             }
//         });
//     });
