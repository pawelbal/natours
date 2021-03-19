
// type is either 'password' or 'data'
const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe'

        const res = await axios({
                method: 'PATCH',
                url: url,
                data: data
        })

        if(res.data.status === 'success') {
                showAlert('success', `${type.toUpperCase()} updated!`)
        }

    } catch (err) {
            showAlert('error', err.response.data.message)
    }
}

if(document.querySelector('.update--btn')) {
    const updateBTN = document.querySelector('.update--btn')

    updateBTN.addEventListener('click', (e) => {
        e.preventDefault()

        const form = new FormData()
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])
        
        // const name = document.getElementById('name').value
        // const email = document.getElementById('email').value
        updateSettings(form, 'data')

    })
}

if(document.querySelector('.updatepass')) {
    const updatePass = document.querySelector('.updatepass')

    updatePass.addEventListener('click', async (e) => {
        e.preventDefault()

        const passwordCurrent = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const passwordConfirm = document.getElementById('password-confirm').value
        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password')

        document.getElementById('password-current').value = ''
        document.getElementById('password').value = ''
        document.getElementById('password-confirm').value = ''
    })
}