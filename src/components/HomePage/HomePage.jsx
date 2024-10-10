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
  const [newChatRoomName,setNewChatRoomName]=useState("");
  const [addChatRoom,setAddChatRoom]=useState(false);


  useEffect(() => {
    if(sessionStorage.getItem('roomid')!=null){
      sessionStorage.removeItem("roomid");

    }
    let userid = JSON.parse(sessionStorage.getItem("userProfile"))?.id;
    console.log(userid);
    setUserId(userid);
    getAllChatRoomsOfUser(userid);

  }, [addChatRoom]);



  const handleChatRoomName=(e)=>{
    setNewChatRoomName(e.target.value)
    //console.log(newChatRoomName)
  }
  const handleSubmit=()=>{
    ChatRoomService.createNewChatRoom(userid,newChatRoomName)
    .then((data) => {
      //setChatRooms(data.data);
      setAddChatRoom(true);
      setIsLoading(true);
    })
    .catch((error) => {

      setIsLoading(false);
    }).finally(
      setIsLoading(false)
    )
    

  }

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
    sessionStorage.setItem("roomid",roomid);
    navigate('/chat');
  }

  return (
    <div className='container mt-5 mb-5'>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-5" >
          <p style={{fontFamily:'Courier New',fontWeight:'bold'}}>Available Chat Rooms</p>

          <div style={{ overflowY: 'scroll', overflow: 'scroll', maxHeight: '80vh'}}>


            {

              chatRooms.map((chatRoom, index) => {

                return <div key={index}  >

                  <div className="card mb-3" style={{ backgroundColor: '#DFCCFB' }}>
                    <div className="card-body">
                      <h6 className="card-subtitle mb-2 text-muted">{chatRoom.chatRoomName}</h6>
                      <button className='btn' style={{ backgroundColor: '#E5D9F2' }} onClick={() => {
                        openRoom(chatRoom.chatRoomId);
                      }}>Open</button>
                    </div>


                  </div>


                </div>




              })}
          </div>

        </div>
        <div className="col-1" >
        </div>
        <div className="addRoom col-lg-4 col-md-4 col-sm-4 col-xs-4">
          <p style={{fontFamily:'Courier New',fontWeight:'bold'}}>Create New Chat Room</p>
          <div style={{width:'100%'}}>

            <div className='card'>

              <button className='btn' style={{ backgroundColor: '#DFCCFB' }}  data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i className='fas fa-plus fa-4x'></i>
              </button>


            </div>
          </div>


        </div>

      </div>

      {isLoading ? <div style={{ textAlign: 'center', marginTop: '15%' }}><ColorRing
        visible={true}
        height="150"
        width="150"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
      </div> : <div></div>}


<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
      </div>
      <div class="modal-body">
      
      <div>
        <input type='text' className="form-control" name="chatRoomName" placeholder='Name of Chat Room' onChange={(e)=>{handleChatRoomName(e)}}></input>
        <button className="form-control btn" style={{backgroundColor:'#DFCCFB'}} type="button" onClick={handleSubmit}>Create Room</button>


      </div>


      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>


    </div>);
}

export default HomePage;