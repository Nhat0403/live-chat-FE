import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ChatroomsAPI from "../../API/ChatroomsAPI";
import queryString from "query-string";
import Notificate from "../../components/UI/Notificate";
import './Chatroom.css';
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { onBlurHandler, onChangeHandler, required } from "../../util/validators";

const Chatroom = ({ socket }) => {
  const chatroomId = useParams().chatroomId;
  const userId = useSelector((state) => state.Session.userId);
  const token = useSelector((state) => state.Session.token);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  });
  const [chatroom, setChatroom] = useState([]);
  const [noti, setNoti] = useState(null);

  const getChatroomById = async() => {
    const params = {
      chatroomId: chatroomId
    };
    const query = '?' + queryString.stringify(params);
    try {
      const response = await ChatroomsAPI.getChatroomById(query);
      console.log(response);
      if(response) {
        setChatroom(response.chatroom);
      };
    } catch(err) {
      console.log(err);
      console.log('no');
      if(err.response.status && err.response.status !== 200) {
        setNoti({
          title: 'Validation falied!',
          message: err.response.data.message
        });
      };
    };
  };
  
  useEffect(() => {
    getChatroomById();
    console.log(socket);
    if(socket) {
      socket.emit('joinRoom', { chatroomId, userId });
    };
    return () => {
      if(socket) {
        socket.emit('leaveRoom', { chatroomId, userId });
      };
    };
  }, []);

  useEffect(() => {
    if(socket) {
      console.log(socket);
      socket.on('newMessage', (message) => {
        console.log(message);
        setMessages(prev => ({
          ...prev,
          message
        }));
      });
      getChatroomById();
    };
  }, [messages]);

  const sendMessageHandler = async(e) => {
    e.preventDefault();
    if(!message.valid) {
      setNoti({
        title: 'Validation failed!',
        message: 'Invalid message'
      })
    }
    if(message.valid) {
      if(socket) {
        console.log('socket');
        console.log(socket);
        socket.emit('chatroomMessage', {
          chatroomId,
          message: message.value
        });
      };
      setMessage(prev => ({
        ...prev,
        value: ''
      }));
    };
  };

  return(
    <>
      {noti && (
        <Notificate
          title={noti.title}
          message={noti.message}
          onConfirm={() => setNoti(null)}
        />
      )}
      <main className="chatroom">
        <h1>Chat room {chatroom.name}</h1>
        <div className="chatroomContent">
          <ul className="crcMessageList">
            {chatroom.length !== 0 && chatroom.content.map((cr, i) =>
              (i !== 0 && 
                <li key={cr._id} className="crcMessage">
                  <div className={userId === cr.userId ? 'ownMessage' : 'otherMessage'}>
                    <p>{cr.username}: {cr.message}</p>
                  </div>
                </li>
              )
            )}
          </ul>
          <div className="chatroomActions">
            <Input
              control='input'
              id='message'
              type='text'
              placeholder='Say something'
              required={true}
              onChange={e => onChangeHandler(e, setMessage, message.validators)}
              onBlur={e => onBlurHandler(e, setMessage, message.validators)}
              value={message.value}
              valid={message.valid}
              touched={message.touched}
            />
            <Button
              type='submit'
              onClick={sendMessageHandler}
              children='Send'
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Chatroom;