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
      let date_ob = new Date();
      let day = date_ob.getDate(), month = date_ob.getMonth() + 1, year = date_ob.getFullYear();
      let hour = date_ob.getHours(), minute = date_ob.getMinutes(), second = date_ob.getSeconds();

      console.log("Cliente connectado");
      console.log("Horas:" + hour + ":" + minute + ":" + second + "\n");
      
      collection.insertOne({
        date: day + "/" + month + "/" + year,
        startTime: hour + ":" + minute + ":" + second,
        finalTime: null,
        name: null,
        heartRate:[]
      }).then(function (result) {
        created = 1;
        insertedIdMongo = result.insertedId.id;
      });
    }
    

    ws.on("message", data => {
      var information = `${data}`;
      var pieces = information.split(":");

      if(pieces[0] === "clientName"){
        collection.updateOne({ _id: ObjectId(insertedIdMongo) }, { $set: { name: pieces[1]}}, {});
        console.log("Nome do usuário: " + pieces[1]);
      }else if(pieces[0] === "heartRate"){
        collection.updateOne({ _id: ObjectId(insertedIdMongo) }, { $push: {heartRate: pieces[1]}}, {});
        console.log("Taxa de batimento cardíaco: " + pieces[1]);
      }else console.log("Novidade -> " + pieces[0] + ":" + pieces[1]);
    });

    /*ws.on("close", (data) => {
      console.log("3");
      writeStream.on('finish', () => {
          console.log('wrote all data to file');
      });

      jsonString += ",\n\t\t\"heartRate\":";
      jsonString += "[" + heartRateArray + "]";
      jsonString += "\n\t}";
      heartRateArray.splice(0, heartRateArray.length)

      console.log("Final -> " + jsonString);
      
      writeStream.write(jsonString);
      console.log("Cliente Desligado" + "\n\n");
    });*/

    /*collection.insertOne({
      item: "canvas",
      qty: 100,
      tags: ["cotton"],
      size: { h: 32.5, w: 38, uom: "cm" }
    }).then(function(result){
      console.log(result);
    });
    
    collection.deleteMany({"item":"canvas"})
    .then(function(result) {
      // process result
      console.log(result);
      client.close();
    })*/

  });










  /*process.stdin.resume();//so the program will not close instantly

  function exitHandler(options, exitCode) {
      if (options.cleanup) console.log('clean');
      if (exitCode || exitCode === 0) console.log(exitCode);
      if (options.exit) process.exit();
      writeStream.write("\n]");
      writeStream.end();
  }

  //do something when app is closing
  process.on('exit', exitHandler.bind(null,{cleanup:true}));

  //catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
  process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

  //catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));*/
});