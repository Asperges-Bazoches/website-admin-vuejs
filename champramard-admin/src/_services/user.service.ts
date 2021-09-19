import axios from 'axios';

export const userService = {
    login,
    logout
};

function login(username, password) {

  const user = btoa(username + ":" + password);

  const requestOptions = {
      headers: { 'Content-Type': 'application/json',
                 "Access-Control-Allow-Origin": "*",
                 'Authorization': 'Basic ' + user,
               },
  };

  return axios
    .get('/v2/private/login.php', requestOptions)
    .then(() => {
      localStorage.setItem('user', user);
      return true;
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
      return false;
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
