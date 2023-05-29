require('dotenv').config()
const AWS = require('aws-sdk');
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser')

AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

let sendQueueURL = process.env.SEND_QUEUE_URL;

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
let socket
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

io.on('connection', (sco) => { 
    socket = soc
    console.log('socket connected')
    console.log('socket1: ', socket.id)
    socket.on('recive message', async(data)=>{
        try {
            console.log(`message recived ${data.message}`)
            const params = {
                MessageBody: data.message,
                QueueUrl: sendQueueURL
            };
              
            let result = await sqs.sendMessage(params).promise();
            console.log('Result', result)
            socket.emit('print', {message: `send message to sqs1 : ${data.message}`})
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('recived message lambda', async(data)=>{
        console.log('message recive from sqs', data)
        
    }) 
});

server.listen(3000, ()=>console.log('server running at port 3000'));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index1.html");
});

app.post('/get-message', (req, res)=>{
    console.log('body', req.body)
    socket.emit('print', {message: `recived message from sqs2 : ${req.body.message}`})
    res.send({socket: socket.id})
})


