import { useEffect, useState } from 'react';
import '../HomePage/HomePage.css';
import ChatRoomService from '../../services/ChatRoomService';
import { useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
const HomePage = () => {
  const [userid, setUserId] = useState(0);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let userid = JSON.parse(sessionStorage.getItem("userProfile"))?.id;
    console.log(userid);
    setUserId(userid);
    getAllChatRoomsOfUser(userid);

  }, []);

 




  const getAllChatRoomsOfUser = (userid) => {
    ChatRoomService.getAvailableChatRooms(userid)
      .then((data) => {
        setChatRooms(data.data);
        setIsLoading(false);
      })
      .catch((error) => {

        setIsLoading(false);
      });
  }

  const openRoom = (roomid) => {
    navigate(`/chat/${userid}/${roomid}`);
  }

  return (
    <div>

      
        <div>

          <p>Available ChatRooms</p>

          <div className="container-fulid row">
            {

              chatRooms.map((chatRoom, index) => {

                return <div key={index} className="col-lg-3 col-md-4 col-sm-12 mb-4" >
                  <div className='container'>
                  <div className="col card" style={{display:'flex',flexDirection:'row'}}>
                    <div className="card-body">
                      {/* <h5 className="card-title">{chatRoom.chatRoomId}</h5> */}
                      <h6 className="card-subtitle mb-2 text-muted">{chatRoom.chatRoomName}</h6>
                      {/* <button className='btn btn-primary' onClick={() => {
                        openRoom(chatRoom.chatRoomId);
                      }}>Open</button> */}
                    </div>
                    <div className='col my-auto'>
                    <button className='btn btn-primary' onClick={() => {
                        openRoom(chatRoom.chatRoomId);
                      }}>Open</button>
                    </div>
                  </div>


                  </div>
                
                </div>


              })}
          </div>

          {isLoading ? <div style={{textAlign:'center',marginTop:'15%'}}><ColorRing
  visible={true}
  height="150"
  width="150"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
  /> 
  </div>:<div></div>}


        </div>
      


    </div>);
}

export default HomePage;