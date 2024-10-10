import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs';
import './ChatPage.css';
import axios from 'axios';
import ChatRoomService from '../../services/ChatRoomService';



function ChatPage() {
  const [messages, setMessages] = useState([]);
  const scrollBoxRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [userid, setUserid] = useState(0);
  const [roomid, setRoomid] = useState(0);
  const [index, setIndex] = useState(0);
  const [initialMaxPage, setInitialMaxPage] = useState(0);
  const [user, setUser] = useState({});
  const [roomName,setRoomName]=useState("")



  useEffect(() => {
  
    getInitialMaxPage();
    //console.log(roomName)
  }, [index]);


  useEffect(() => {

    let userObj = JSON.parse(sessionStorage.getItem("userProfile"));
    setUser(userObj);
    setUserid(userObj?.id);
    let rooomid = sessionStorage.getItem("roomid");
    console.log(rooomid)
    setRoomid(rooomid);
    setIndex(index => index + 1)
   getChatRoomDetails(rooomid);


  }, []);


  useEffect(() => {
    getPreviousChat();
    scrollBoxRef?.current?.scrollIntoView({ behavior: 'smooth', block: "end" })

  }, [initialMaxPage]);



  const getInitialMaxPage = async () => {
    console.log("userid" + userid)
    const maxPageResp = await axios.get(`http://localhost:8080/chat/getMaxPage?chatRoomId=${roomid}`);
    console.log(maxPageResp.data)
    setInitialMaxPage(maxPageResp.data);
  }

  const getPreviousChat = async () => {

    const resp = await axios.get(`http://localhost:8080/chat/loadMessage?pageSize=10&pageNo=${index}&chatRoomId=${roomid}&maxPage=${initialMaxPage}`)

    setMessages(resp.data);
  }

  const loadPrevMessage = async () => {


    const resp = await axios.get(`http://localhost:8080/chat/loadMessage?pageSize=10&pageNo=${index + 1}&chatRoomId=${roomid}&maxPage=${initialMaxPage}`);


    setMessages([...resp.data, ...messages])

    setIndex(index => index + 1);


  }

  const getChatRoomDetails=async(id)=>{
    const resp=await ChatRoomService.getChatRoomDetails(id);
    setRoomName(resp.data.chatRoomName)
  }


  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/server'),

    });

    client.onConnect = () => {


      console.log('Connected to WebSocket server');
      client.subscribe('/topic/messages/' + roomid.toString(), (message) => {


        let convertit = JSON.parse(message.body)


        let msgObj = {
          "id": convertit.id,
          "userid": convertit.userid,
          "message": convertit.message,
          "username": convertit.username,
          "time": convertit.time
        };



        console.log(msgObj)



        setMessages(messages => [...messages, msgObj])

        scrollBoxRef?.current?.scrollIntoView({ behavior: 'smooth', block: "end" })




      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };


    client.activate();

    setStompClient(client);



    return () => {
      if (client && client.connected) {
        client.deactivate();
      }
    };
  }, [initialMaxPage]);



  const handleMessageSend = () => {

    if(initialMaxPage===0){
      window.location.reload();
    }

    if (stompClient && inputValue.trim() !== '') {
      //console.log(inputName)
      //console.log(userObj)
      let chat = { userid: Number(userid), message: inputValue, chatRoomId: Number(roomid), username: user["name"] }
      console.log(chat)
      stompClient.publish({
        destination: `/app/send-message/` + roomid.toString(),
        body: JSON.stringify(chat)
      });

      scrollBoxRef?.current?.scrollIntoView({ behavior: 'smooth', block: "end" })

      setInputValue('')


    }
  };



  return (
    <div className='App'>
      <div style={{}}>

        <h1 style={{ fontFamily: 'Courier New', fontWeight: 'bold', textAlign: 'center' }}>{roomName}</h1>



        <div className="scroll-box px-2 py-0" ref={scrollBoxRef}>

  

          <div className="scroll-content" >
           

            {messages.length !== 0 ?
              <div>
                <button className='btn' onClick={loadPrevMessage} disabled={index === initialMaxPage} style={{ backgroundColor: '#DFCCFB' }}>Click to load</button>

                {
                  messages.map((message, index) => {



                    let isUser = user.id === message.userid;

                

                    return <div key={index} style={isUser ? { fontSize: '10pt', textAlign: 'end' } : { fontSize: '10pt', textAlign: 'start' }}>


                      <div>
                        <i className="fa fa-user" aria-hidden="true"></i>
                        {isUser ? "You" : message.username}

                        {/* <h5 className="title">{message.id}</h5> */}

                        <div className={isUser ? "card-body rounded-start-pill" : "card-body rounded-end-pill"} style={isUser ? { fontSize: '18pt', backgroundColor: '#FFF3DA' } : { fontSize: '18pt', backgroundColor: '#E5D9F2' }}>
                          <p className="m-2" style={{ wordWrap: 'break-word' }}>{message.message}</p>

                        </div>

                      </div>
                    </div>




                  })}
              </div>

              : <div>
                <p>No Chats found</p>
              </div>}

          </div>


        </div>


      </div>

      <div >

      

        <div className="messageBox rounded-1">

          <input type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='message' id="messageInput" />
          <button id="sendButton" onClick={() => {
            handleMessageSend();

          }} disabled={inputValue === ''}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
              <path
                fill="none"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              ></path>
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="33.67"
                stroke="#6c6c6c"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              ></path>
            </svg>
          </button>


        </div>





      </div>


    </div>
  );
}

export default ChatPage;
