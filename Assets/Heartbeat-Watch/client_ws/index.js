const WebSocket = require("ws");
const fs = require("fs");
const { Console } = require('console');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://GreenHealthScholarship:sHt5JNtsDjwBRGj3@cluster0.ffkxo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let created = 0, insertedIdMongo;

client.connect(err => {
  const collection = client.db("Heartbeat-Watch").collection("Test");

  const wss = new WebSocket.Server({ port: 3476 });

  wss.on("connection", ws => {
    if(created == 0){
      console.clear();
      console.log("Cliente connectado");
    }else console.log("\n\nCliente reconnectado");
    
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
            date: date_ob.toLocaleDateString('pt-PT'),
            name: value,
            startTime: date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds(),
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
          if(value == 2) console.log("\n\nHora de término:" + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "\n");
          await collection.updateOne({ _id: ObjectId(insertedIdMongo) }, { $set: { finalTime: date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() } }, {});
          break;

        default:
          break;
      }
    }
    
    process.stdin.resume();//so the program will not close instantly
    async function exitHandler(options, exitCode) {
        await changeCollection("updateFinalTime", 2);
      
      /*if (options.cleanup) console.log('clean');
      if (exitCode || exitCode === 0) console.log(exitCode);*/
      if (options.exit) process.exit();
    }

    process.on('exit', exitHandler.bind(null, { cleanup: true })); //do something when app is closing
    process.on('SIGINT', exitHandler.bind(null, { exit: true })); //catches ctrl+c event
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true })); // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true })); // catches "kill pid" (for example: nodemon restart)
    process.on('uncaughtException', exitHandler.bind(null, { exit: true })); //catches uncaught exceptions
  });
});