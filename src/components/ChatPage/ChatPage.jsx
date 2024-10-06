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
  const [user,setUser]=useState({});



  useEffect(() => {
    console.log(index + "--" + initialMaxPage)

  }, [index]);


  useEffect(() => {
    setIndex(index => index + 1)
    getInitialMaxPage();
    let userObj = JSON.parse(sessionStorage.getItem("userProfile"));
    setUser(userObj);
  }, []);


  useEffect(() => {
    getPreviousChat();
    //console.log(scrollBoxRef.current)  
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
          "userid":convertit.userid,
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
  }, []);

  // const initMessage=()=>{


  // setMessages(prevMessages=>[...message,...prevMessages])



  // }

  const handleMessageSend = () => {


    if (stompClient && inputValue.trim() !== '') {
      //console.log(inputName)
      //console.log(userObj)
      let chat = { userid: Number(userid), message: inputValue, chatRoomId: Number(roomid), username: user["name"] }
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
      <div style={{ }}>

        <h1 style={{ fontFamily: 'Courier New', fontWeight: 'bold', textAlign: 'center' }}>  Chat Application</h1>



        <div className="scroll-box rounded-2" >

          {/* <p>{index}</p>
<p>maxpage{initialMaxPage}</p> */}

          <div className="scroll-content" ref={scrollBoxRef}>
            {/*       
       {
                  console.log(messages)

       } */}

            {messages.length !== 0 ?
              <div>
                <button className='btn' onClick={loadPrevMessage} disabled={index === initialMaxPage} style={{ backgroundColor: '#DFCCFB' }}>Click to load</button>

                {
                  messages.map((message, index) => {


                    // return <div key={index}>{message.id+"--"+message.username+"--"+message.message}</div>

                    let isUser=user.id===message.userid;
                    
                    // return <div className={isUser? "card": "card bg-primary"} key={index} >
                    //   <div className='card-title' style={isUser?{textAlign:'end'}:{textAlign:'start'}}>
                    //   <i class="fa fa-user" aria-hidden="true"></i>
                    //   {isUser?"You":message.username}
                    //     </div>
                    //   <div className="card-body">
                    //     <h5 className="card-title">{message.id}</h5>
                    //     <p className="card-text">{message.message}</p>
                    //   </div>
                    // </div>

                    return <div key={index}  style={isUser?{fontSize:'12pt',textAlign:'end'}:{fontSize:'12pt',textAlign:'start'}}>
                    
                    
                    <div>
                    <i className="fa fa-user" aria-hidden="true"></i>
                    {isUser?"You":message.username}
                      
                      {/* <h5 className="title">{message.id}</h5> */}

                      <div className={isUser? "card-body rounded-start-pill": "card-body rounded-end-pill"} style={isUser?{fontSize:'18pt',backgroundColor:'#FFF3DA'}:{fontSize:'18pt',backgroundColor:'#E5D9F2'}}>
                      <p className="mx-2" style={{wordWrap:'break-word'}}>{message.message}</p>

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

        {/* <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='message'
      /> */}

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


        {/* 
      <button onClick={()=>{handleMessageSend();
      setDisable(true);
      }} disabled={ inputValue ===''}>Send</button> */}



      </div>


    </div>
  );
}

export default ChatPage;
