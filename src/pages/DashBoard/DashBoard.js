import { useEffect, useState } from "react";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Notificate from "../../components/UI/Notificate";
import { length, onBlurHandler, onChangeHandler, required, setTouched } from "../../util/validators";
import queryString from "query-string";
import ChatroomsAPI from "../../API/ChatroomsAPI";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashBoard = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.Session.userId);
  const [name, setName] = useState({
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  });
  const [chatrooms, setChatrooms] = useState([]);
  const [noti, setNoti] = useState();

  const getAllChatrooms = async() => {
    const response = await ChatroomsAPI.getAllChatrooms();
    console.log(response);
    setChatrooms(response.chatrooms);
  };

  useEffect(() => {
    getAllChatrooms();
  }, [])

  const createRoomHandler = async(e) => {
    e.preventDefault();

    setTouched(setName);

    if(!name.valid) {
      console.log('no');
      return setNoti({
        title: 'Validation failed!',
        message: 'Invalid name!'
      });
    };

    if(name.valid) {
      console.log('ok');
      const params = {
        name: name.value,
        userId: userId
      };
      const query = '?' + queryString.stringify(params);
      try {
        const response = await ChatroomsAPI.createNewRoom(query);
        console.log(response);
        setNoti({
          title: 'Create success!',
          message: response.message,
        });
        getAllChatrooms();
      } catch(err) {
        console.log(err);
        if(err.response.status && err.response.status !== 200) {
          setNoti({
            title: 'Validation falied!',
            message: err.response.data.message
          });
        };
      };
    }
  };

  const joinRoomHandler = async(e) => {
    e.preventDefault();
    console.log(e.target.id)
    navigate('/chatrooms/' + e.target.id);
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
      <main className="chatroomPage">
        <h1>Chat Rooms</h1>
        <div className="createRoom">
          <Input
            control="input"
            id="find-room"
            type="text" 
            placeholder="Room Name"
            required={true}
            onChange={e => onChangeHandler(e, setName, name.validators)}
            onBlur={e => onBlurHandler(e, setName, name.validators)}
            value={name.value}
            valid={name.valid}
            touched={name.touched}
          />
          <Button
            type='submit'
            onClick={createRoomHandler}
            children='Create New Chat Room'
            className='crBtn'
          />
        </div>
        <div className="chatrooms">
          <ul className="crList">
            {chatrooms && chatrooms.map(cr => 
              (<li key={cr._id}>
                {cr.name}
                <Button 
                  className='crListBtn' 
                  id={cr._id} 
                  onClick={joinRoomHandler}
                  children='Join'
                />
              </li>)
            )}
          </ul>
        </div>
      </main>
    </>
  );
};

export default DashBoard;