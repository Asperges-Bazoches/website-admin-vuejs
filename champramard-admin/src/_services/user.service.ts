export const userService = {
    login,
    logout
};

function login(username, password) {

    const user = encodeURIComponent(username)+':'+encodeURIComponent(password);
    localStorage.setItem('user', user);

    /*const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a user in the response
            if (user) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });*/

    return true;
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

/*
function handleResponse(response) {

    let response_text = response.text();

    return response_text.then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
*/
