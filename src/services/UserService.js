import axios from 'axios';

const baseUrl='http://localhost:8081/auth';
class UserService{
     getToken(user)
    {
     return axios.post(baseUrl+'/generateToken',user);
    }

    getUserProfile(jwt)
    {

        return axios.get(baseUrl+'/user/Profile',{headers: {
            'Authorization': `Bearer ${jwt}`
            // Other headers if needed
          }});
    }
}
export default new UserService();