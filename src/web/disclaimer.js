const closeModal = (event) => {
    const isDonation = event.target.closest('.donations');
    const isClose = isDonation && event.target.matches('.close');

    if (isClose || !isDonation) {
        document.body.classList.remove('modal');
        window.scrollTo(0, 0);
        sessionStorage.setItem('prompt-donation', 'false');
        document.removeEventListener('click', closeModal);
    }
}

export const load = () => {
    const donationSection = document.querySelector('.container.donations');

    if (sessionStorage.getItem('prompt-donation') !== 'false') {
        document.body.classList.add('modal');
    
        document.addEventListener('click', closeModal)
    
        setTimeout(() => {
            const outFromTop = donationSection.offsetTop - window.pageYOffset < 0;
            const outFromBottom = (donationSection.offsetTop + donationSection.offsetHeight) > window.innerHeight;
            if (outFromTop || outFromBottom) {
                window.scrollTo(0, donationSection.offsetTop);
            }
        }, 100)
    }
}
