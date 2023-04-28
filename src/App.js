import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import { useSelector } from 'react-redux';
import DashBoard from './pages/DashBoard/DashBoard';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chatroom from './pages/Chatroom/Chatroom';

function App() {
  const userId = localStorage.getItem('userId');
  const token = useSelector((state) => state.Session.token);
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    if(token && !socket) {
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        query: {
          token: token
        }
      });
      newSocket.on('disconnect', () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        console.log('socket disconnected!');
      });

      newSocket.on('connect', () => {
        console.log('socket connected!');
      });

      setSocket(newSocket);
    };
  };

  console.log(socket);

  useEffect(() => {
    setupSocket();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/' 
          element={userId ? 
            <DashBoard socket={socket}/> : 
            <Navigate to='/login' setupSocket={setupSocket}/>
          } 
        />
        <Route path='/signup' element={<SignUp/>} exact />
        <Route path='/login' element={<Login setupSocket={setupSocket}/>} exact />
        <Route path='/chatrooms/:chatroomId' element={<Chatroom socket={socket}/>} exact />
        <Route path='*' element={<h1>Page Not Found!</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
