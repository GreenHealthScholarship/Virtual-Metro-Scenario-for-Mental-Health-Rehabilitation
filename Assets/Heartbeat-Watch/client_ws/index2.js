const WebSocket = require ("ws");
const fs = require("fs");

let flagStarted = 0;

let writeStream = fs.createWriteStream('data.json');

const wss = new WebSocket.Server({ port: 3476 });

wss.on("connection", ws => {

    let date_ob = new Date();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();

    var heartRateArray = [];

    console.log("Cliente connectado");
    console.log("Horas:" + hours + ":" + minutes + ":" + seconds );
    let jsonString;
    
    if(flagStarted == 0){ 
        jsonString = '[\n\t{\n\t\t"Horas":"' + hours + ":" + minutes + ":" + seconds + '"';
        flagStarted = 1;
    }else{
        jsonString = ',\n\t{\n\t\t"Horas":"' + hours + ":" + minutes + ":" + seconds + '"';
    }

    ws.on("message", data => {

      /*console.log(`{"${data}"}`);

       //console.log(JSON.parse(`{"${data}"}`));
       
       
       //writeStream.write(data + '\n');
       //writeStream.write(JSON.parse(data));

       fs.WriteStream("data.json", data, err =>{

        if (err) throw err;
        console.log("Gravado");
       });*/
       
       var information = `${data}`;
       var pieces = information.split(":");
       
        try {
            
            const data1 = '"' + pieces[0] + '":"' + pieces[1] + '"';
            if(pieces[0] === "heartRate") heartRateArray.push(pieces[1]);
            else jsonString += ",\n\t\t" + data1;
            
            console.log(heartRateArray);
            } catch(e) {console.log(`Erro: ${e.data}`)}
    });

    ws.on("close", () => {

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
     
    });


    process.stdin.resume();//so the program will not close instantly

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
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
});