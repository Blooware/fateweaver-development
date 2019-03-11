'use strict'

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const moment = require('moment');
const fileType = require('file-type');
const sha1 = require('sha1');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'blootest.c2qh4vkdvsoy.eu-west-2.rds.amazonaws.com',
    user: 'blooware',
    password: 'blooware18',
    port: 3306
});

exports.handler = (event, context, callback) => {
    var Done = [];
    var notDone =[] ;
    //callback(null, "List");
    function delay() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    async function delayedLog(item) {
        // notice that we can await a function
        // that returns a promise
        if(item === 2){
            notDone += item;
            var dset = {
                name : item,
                info : "Not Done"
            }
            /*
            connection.query("insert into fateweaver.students set ?", [dset], async function (error, results, fields) {
                console.log("added Not done item");
                console.log(results);
            });
            */

        } else {
            Done += item;
            var dset = {
                name : item,
                info : "Done"
            }
            console.log("added Done Item");
            connection.query("insert into fateweaver.students set ?", [dset], async function (error, results, fields) {
                console.log("added Not done item");
                console.log(results);
            });
            
        }
        
        await delay();
        console.log(item);
    }
    async function processArray(array) {
        for (const item of array) {
          await delayedLog(item);
        }
        console.log("Finished Itterating");
        context.succeed({Done : Done,
             NotDone : notDone});
         callback(null, {
             Done : Done,
             NotDone : notDone,
             
         });
      }

    processArray([1, 2, 3]);
}