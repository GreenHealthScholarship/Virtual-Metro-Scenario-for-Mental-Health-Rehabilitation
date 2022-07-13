console.clear();
console.log("Iniciando, aguarde...\n\n");

const WebSocket = require("ws");
const fs = require("fs");
const { Console, time } = require('console');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://GreenHealthScholarship:sHt5JNtsDjwBRGj3@cluster0.ffkxo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const collection = client.db("Heartbeat-Watch").collection("Test");
const wss = new WebSocket.Server({ port: 3476 });

let created = 0, insertedIdMongo;

client.connect(err => {
  console.log("Conexão com banco iniciada. Inicie o relógio.");
  
  wss.on("connection", ws => {
    if(created == 0) console.log("Cliente relógio connectado");
    else console.log("\n\nCliente relógio reconnectado");
    
    ws.on("message", data => {
      let information = `${data}`;
      let pieces = information.split(":"), date_ob = new Date();

      if (pieces[0] === "clientName" && created == 0) {
        created = 1;
        
        console.log("Hora de início:" + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "\n");
        console.log("Nome do usuário: " + pieces[1] + "\n");

        changeCollection("insert", pieces[1]);
      } else if (pieces[0] === "heartRate") {
        console.log("Taxa de batimento cardíaco: " + pieces[1]);
        changeCollection("updateHeartRate", parseInt(pieces[1]));
      } else console.log("\n - Não foi para o banco -> " + pieces[0] + ":" + pieces[1] + "\n");
    });

    ws.on("close", data => {
      changeCollection("updateFinalTime", 1);
    });

    
    async function changeCollection(option, value) {
      let date_ob = new Date();

      switch (option) {
        case "insert":
          await collection.insertOne({
            date: date_ob,
            name: value,
            startTime: date_ob,
            finalTime: null,
            heartRate: []
          }).then(function (result) {
            insertedIdMongo = result.insertedId.id;
          });
          break;

        case "updateHeartRate":
          await collection.updateOne({ _id: ObjectId(insertedIdMongo) }, { $push: { heartRate: value } }, {});
          break;

        case "updateFinalTime":
          if(value == 1) collection.updateOne({ _id: ObjectId(insertedIdMongo) }, { $set: { finalTime: date_ob } }, {});
          else{
              collection.find({_id: ObjectId(insertedIdMongo) }).project({_id:0, finalTime:1}).toArray(function(err, docs) {
                let hourgetter = Object.values(docs[0]);
                
                if(hourgetter[0] == null){
                  collection.updateOne({ _id: ObjectId(insertedIdMongo) }, { $set: { finalTime: date_ob } }, {});
                  hourgetter[0] = date_ob;
                }
                
                let time = new Date(hourgetter[0]);
                console.log("\n\nHora de término: " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
                created = 2;
              });
          }
          break;

        default:
          break;
      }
    }
    
    process.stdin.resume();//so the program will not close instantly
    async function exitHandler(options, exitCode) {
      await changeCollection("updateFinalTime", 2);
      setTimeout(() => {
        if (options.exit) process.exit();
      }, 1000);
      
      /*if (options.cleanup) console.log('clean');
      if (exitCode || exitCode === 0) console.log(exitCode);*/
      
    }

    process.on('exit', exitHandler.bind(null, { cleanup: true })); //do something when app is closing
    process.on('SIGINT', exitHandler.bind(null, { exit: true })); //catches ctrl+c event
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true })); // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true })); // catches "kill pid" (for example: nodemon restart)
    process.on('uncaughtException', exitHandler.bind(null, { exit: true })); //catches uncaught exceptions
  });
});