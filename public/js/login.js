
const hideAlert = () => {
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}


const showAlert = (type, msg) => {
    hideAlert()
    const markup = `<div class="alert alert--${type}">${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
    window.setTimeout(hideAlert, 3000)
}

const login = async (email, password) => {
    
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email: email,
                password
            }
        })

        if(res.data.status === 'success') {
            showAlert('success', 'Logged in successfully')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
         }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        })
        if(res.data.status = 'success') {
            showAlert('success', 'Logged out successfully.')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.')
    }
}


if (document.querySelector('.loginbtn')) {
    const btn = document.querySelector('.loginbtn')

    btn.addEventListener('click', (e) => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        login(email, password)
    })
}



if(document.querySelector('.nav__el--logout')) {
        const logOutBtn = document.querySelector('.nav__el--logout')

        logOutBtn.addEventListener('click', logout)
        
}

