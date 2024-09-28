import axios from 'axios';

const baseUrl='http://localhost:8080/chatRoom';
class ChatRoomService{
    getAvailableChatRooms(userid)
    {
     return axios.get(baseUrl+`/userChatRooms/${userid}`)
    }
}
export default new ChatRoomService();