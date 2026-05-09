const successNotification = document.querySelector('#success');

if (successNotification) {
    
    successNotification.classList.add('show')

    // Wacht 2 sec
    setTimeout(() => {
        // Verwijder dan de class 'show'
        successNotification.classList.remove('show')
    }, 2000)
}