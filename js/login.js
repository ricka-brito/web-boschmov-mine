function mostrarSenha(){
    var inputPass = document.getElementById('password')
    var btnShowPass = document.getElementById('btn-senha')

    if(inputPass.type === 'password'){
        inputPass.setAttribute('type','text')
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill')
    } else if(inputPass.type === 'text'){
        inputPass.setAttribute('type','password')
        btnShowPass.classList.replace('bi-eye-slash-fill','bi-eye-fill')
    }
}

function login(){
    let username = document.getElementById('user').value
    let password = document.getElementById('password').value

    const url = 'https://boschmov.azurewebsites.net/token';

    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);

    const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
    };

    fetch(url, requestOptions)
  .then(response => {
    if (response.status === 422 || response.status === 401) {
      throw new Error('Unprocessable Entity');
    }
    return response.json();
  })
  .then(data => {
    const responseJson = JSON.stringify(data);

    document.cookie = `token=${encodeURIComponent(responseJson)}; path=/`;


    if(data["admin"] == true){
        window.location.href = './adm.html' 
    }
    else if(data["admin"] == false){
        window.location.href = './menu.html'
    }

})  
  .catch(error => {
    Swal.fire(
        'Invalid user or password',
        'try again...',
        'error'
      )
  });


}

function getCookie(name) {
    const cookies = document.cookie.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
  
      // Check if the cookie name matches
      if (cookie.startsWith(`${name}=`)) {
        // Return the cookie value
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  
    // Cookie not found
    return null;
  }
  