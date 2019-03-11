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
        if(item === 1){
            notDone += item;
            
            
        } else {
            Done += item;
        }
        
        //await delay();
        console.log(item);
    }
    async function processArray(array) {
        for (const item of array) {
          await delayedLog(item);
        }
        console.log("Finished Itterating");
         callback(null, {
             Done : Done,
             NotDone : notDone,
             
         });
      }

    processArray([1, 2, 3]);
}