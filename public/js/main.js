document.addEventListener('DOMContentLoaded', function() {
    
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');
    
    fetch('/api/auth-status')
        .then(r => r.json())
        .then(({ authenticated }) => {
            if (authenticated) {
                if (logoutButton) {
                    logoutButton.style.display = 'inline-block'
                }
                if (loginButton) 
                    loginButton.style.display = 'none'
            } else {
                if (loginButton) {
                    loginButton.style.display = 'inline-block'
                }
                if (logoutButton) 
                    logoutButton.style.display = 'none'
            }
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            // Default to showing login button if there's an error
            if (loginButton) 
                loginButton.style.display = 'inline-block'
            if (logoutButton) 
                logoutButton.style.display = 'none'
        })

    if (loginButton) {
        loginButton.onclick = () => {
        window.location.href = '/login'
        }
    }
    if (logoutButton) {
        logoutButton.onclick = () => {
        window.location.href = '/logout'
        }
    }
});