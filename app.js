require('dotenv').config()
const AWS = require('aws-sdk');
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

let sendQueueURL = process.env.SEND_QUEUE_URL;

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

io.on('connection', (socket) => { 
    console.log('socket connected')
    socket.on('recive message', async(data)=>{
        try {
            console.log(`message recived ${data.message}`)
            const params = {
                MessageBody: data.message,
                QueueUrl: sendQueueURL
            };
              
            let result = await sqs.sendMessage(params).promise();
            console.log(result.MessageId)
        } catch (error) {
            console.log(error)
        }
        
    }) 
});

server.listen(3000, ()=>console.log('server running at port 3000'));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
