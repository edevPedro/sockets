import express from 'express';
import { createServer} from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app =  express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('dist'));
app.use('/dist', express.static('assets'));

const __dirname = dirname(fileURLToPath(import.meta.url));


app.get('/', (req, res) =>{
  res.sendFile(join(__dirname, './dist/index.html'));
})

io.on('connection', (socket) => {
  console.log('usuário conectado');

  socket.on('disconnect', () => {
    console.log('usuário desconectado');
  });
});

io.on('connection', (socket) => {
  socket.on('login', (username) => {
    if (username === 'admin'){
      socket.on('status', (status) => {
        if(status === 'Pronto para iniciar'){
          socket.on('start', () =>{
              console.log('timer iniciado');
              let ocounter = 14;
              const counter = setInterval(() => {
                io.emit('timer', ocounter.toString());
                ocounter--;
                if (ocounter < 0){
                  clearInterval(counter);
                  io.emit('timer', ocounter = 15);
                }
              }, 1000);
            });
            io.emit('status', 'Esperando acesso.');
          }else{
            io.emit('status', 'Pronto para iniciar');
          }
          console.log('mudança de status');
        })
    }
  });
})


// io.on('connection', (socket) => {
//   socket.on('login', (username) => {
//     if (username === 'admin'){
//       socket.join('admin');
//       socket.on('start', () =>{
//         console.log('timer iniciado');
//         let ocounter = 14;
//         const counter = setInterval(() => {
//         io.emit('timer', ocounter.toString());
//         ocounter--;
//         if (ocounter < 0){
//           clearInterval(counter);
//         }
//           }, 1000);
//       });
//     }
//   });
// })

server.listen(3000, () => {
  console.log('server rodando na famosa porta 3000');
})
