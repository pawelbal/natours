
const stripe = Stripe('pk_test_51IWhOwJLzb1Wj6RAmkNclSjPKR6H4IyEPpM8TLSSsR0mIPQj7uGuX6m12RhTVCs5lpcoLJERw5owOccgDD14seoQ0095YBvKRb');

const bookTour = async (tourId) => {
    try {
        // 1. Get checkout session from API
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`)
    
        // 2. Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
        
    } catch(err) {
        console.log(err)
        showAlert('error', err)
    }
}
    

if(document.getElementById('book-tour')) {

    const bookBtn = document.getElementById('book-tour')
    bookBtn.addEventListener('click', e=> {
        const tourId = e.target.dataset.tourId
        bookTour(tourId)
        
    })

}