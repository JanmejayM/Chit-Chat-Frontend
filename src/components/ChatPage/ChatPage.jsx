import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs';
import './ChatPage.css';
import { ColorRing } from 'react-loader-spinner'
import axios from 'axios';
import { useParams } from 'react-router-dom';


function ChatPage() {
  const [messages, setMessages] = useState([]);
  const scrollBoxRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [stompClient, setStompClient] = useState(null);
  let { userid } = useParams();
  let { roomid } = useParams();
  const [index, setIndex] = useState(0);
  const [initialMaxPage, setInitialMaxPage] = useState(0);



  useEffect(() => {
    console.log(index + "--" + initialMaxPage)

  }, [index]);


  useEffect(() => {
    setIndex(index => index + 1)
    getInitialMaxPage();
  }, []);


  useEffect(() => {
    getPreviousChat();
  }, [initialMaxPage]);



  const getInitialMaxPage = async () => {
    console.log("userid"+userid)
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
          "message": convertit.message,
          "username": convertit.username,
          "time": convertit.time
        };


        //console.log(messages)



        setMessages(messages => [...messages, msgObj])





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
  }, []);

  // const initMessage=()=>{


  // setMessages(prevMessages=>[...message,...prevMessages])



  // }

  const handleMessageSend = () => {


    if (stompClient && inputValue.trim() !== '') {
      //console.log(inputName)
      let chat = { userid: Number(userid), message: inputValue, chatRoomId: Number(roomid) }
      console.log(chat)
      stompClient.publish({
        destination: `/app/send-message/` + roomid.toString(),
        body: JSON.stringify(chat)
      });

      setInputValue('')


    }
  };



  return (
    <div className='App'>
      <div style={{ position: 'relative' }}>

        <h1 style={{ textAlign: 'center' }}>  Chat Application</h1>


        <div className="scroll-box" ref={scrollBoxRef} >

          {/* <p>{index}</p>
<p>maxpage{initialMaxPage}</p> */}

          <div className="scroll-content">
            {/*       
       {
                  console.log(messages)

       } */}

            <button onClick={loadPrevMessage} disabled={index === initialMaxPage}>Click to load</button>

            {
              messages.map((message, index) => {


                // return <div key={index}>{message.id+"--"+message.username+"--"+message.message}</div>


                return <div className="card" key={index}>
                  <div className="card-body">
                    <h5 className="card-title">{message.id}{message.username}</h5>
                    <p className="card-text">{message.message}</p>
                  </div>
                </div>





              })}

          </div>


        </div>


      </div>

      <div style={{ paddingLeft: '10px' }}>

        {/* <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='message'
      /> */}

        <div className="messageBox">

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


        {/* 
      <button onClick={()=>{handleMessageSend();
      setDisable(true);
      }} disabled={ inputValue ===''}>Send</button> */}



      </div>


    </div>
  );
}

export default ChatPage;
