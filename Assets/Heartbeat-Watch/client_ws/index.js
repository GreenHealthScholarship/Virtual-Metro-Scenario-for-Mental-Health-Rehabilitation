const WebSocket = require ("ws");
const fs = require("fs");



let writeStream = fs.createWriteStream('data.json');
//var myWrite;

const wss = new WebSocket.Server({ port: 3476 });

wss.on("connection", ws => {

    let date_ob = new Date();
// current hours
let hours = date_ob.getHours();
// current minutes
let minutes = date_ob.getMinutes();
// current seconds
let seconds = date_ob.getSeconds();

    console.log("Cliente connectado");
    console.log("Horas:" +hours + ":" + minutes + ":" + seconds );
    writeStream.write("Horas:" +hours + ":" + minutes + ":" + seconds + "\n" );
    
    ws.on("message", data => {

    console.log(`{"${data}"}`);

       //console.log(JSON.parse(`{"${data}"}`));
       
       
       writeStream.write(data + '\n');
       ///writeStream.write(JSON.parse(data);

      

       
       /*fs.WriteStream("data.json", data, err =>{

        if (err) throw err;
        console.log("Gravado");
       });
       */

       /*
        try {
            const data1 = JSON.stringify(data);

            console.log(data1);


            } catch(e) {console.log(`Erro: ${e.data}`)}
        
        */
           
    });

    ws.on("close", () => {

        writeStream.on('finish', () => {
            console.log('wrote all data to file');
        });
        //writeStream.end();

        console.log("Cliente Desligado");
     
    });

    

 
});