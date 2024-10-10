import axios from 'axios';

const baseUrl='http://localhost:8080/chatRoom';
class ChatRoomService{
    getAvailableChatRooms(userid)
    {
     return axios.get(baseUrl+`/userChatRooms/${userid}`)
    }
    createNewChatRoom(userid,chatRoomName){
        return axios.post(baseUrl+`/?userId=${userid}&roomName=${chatRoomName}`)

    }
    getChatRoomDetails(roomid){
        return axios.get(baseUrl+"/chatRoomName/"+roomid)
    }
}
export default new ChatRoomService();