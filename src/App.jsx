import  { useEffect, useState } from 'react';
import telekLogo from './assets/logo-telek.png';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Timer(){
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('Esperando acesso.');
  const [time, setTime] = useState(15);

  useEffect(() => {
    socket.on('status', (status) => {
      setStatus(status);
    })
    socket.on('timer', (time) => {
      setTime(time);
    })
  
  }, [])
  
  const buttonYClick = () => {
    socket.emit('login', inputValue);
    socket.emit('start');
  }

  const changeStatus = () => {
    socket.emit('login', inputValue);
    socket.emit('status', status);
  }


  return(
      <div>
     <label htmlFor='username'>Username: </label>
     <input type='text' id='username' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <br />
      <p><span id='status-color' >Status</span>: <span id="status">{status}</span></p>
      <p>Tempo restante: <span id="timer">{time}</span> segundos</p>
      <div className="pBtn">
        <button id="start" onClick={buttonYClick} >Iniciar Timer</button>
        <button id="changeStatus" value={status} onChange={(e) => setStatus(e.target.status)} onClick={changeStatus} >Mudar status</button>
      </div>
    </div>
  );
}


function App() {
  
  return (

    <>
      <img src={telekLogo} alt="Logo telek" />
      <h1>Controle via <span className='blue'>Socket</span></h1>
      <Timer/>
    </>
    );
}
export default App;
