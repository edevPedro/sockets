import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('dist'));
app.use('/dist', express.static('assets'));

const __dirname = dirname(fileURLToPath(import.meta.url));

function defineStatus(n) {
  const status = {
    1: 'Esperando acesso',
    2: 'Timer rodando',
    3: 'Pronto para iniciar'
  }
  console.log(status[n])
  io.emit('status', status[n])
}

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/dist/index.html'));
})


io.on('connection', (socket) => {
  console.log('usuário conectado');
  socket.on('login', (username) => {
    socket.on('status', (status) => {
      if (status == 'Esperando acesso' && username == 'admin') {
        defineStatus(3);
      } else if (status == 'Pronto para iniciar' && username == 'admin') {

      }
      else {
        console.log('status inválido\n' + status)
      }
    });
    socket.on('start', _ => {
      socket.on('statusReturn', (statusReturn) => {
        if (username == 'admin' && statusReturn === 'Pronto para iniciar') {
          console.log('timer iniciado');
          let ocounter = 14;
          const counter = setInterval(() => {
            defineStatus(2);
            io.emit('timer', ocounter.toString());
            ocounter--;
            if (ocounter < 1) {
              clearInterval(counter);
              io.emit('timer', ocounter = 15);
              defineStatus(1);
            }
          }, 1000);
        } else {
          console.log("farei nada não")
        }
      })
    })
  });
  socket.on('disconnect', () => {
    console.log('usuário desconectado');
  });
});


server.listen(3000, () => {
  console.log('server rodando na famosa porta 3000');
})
