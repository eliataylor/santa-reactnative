import axios from 'axios';
import API from './API';

class UserAuth {

  async currentAuthenticatedUser : function() {
    return null;
    API.Get('/api/users/5d34e1aebba83628da3b0aa1').then(res => {

    })
  }

}

export default UserAuth;
