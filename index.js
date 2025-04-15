document.addEventListener('DOMContentLoaded', () => {
    const raffleForm = document.getElementById('enter-raffle-form');
    const thankYouContainer = document.getElementById('thank-you-container');
    const enterRaffleContainer = document.getElementById('enter-raffle-container');
    
    raffleForm.onsubmit = async function(event) {
        event.preventDefault();
        
        // Hide the form and show loading message
        enterRaffleContainer.style.display = 'none';

        // Create a loading message
        const loadingMessage = document.createElement('p');
        loadingMessage.innerText = 'Submitting your entry...';
        document.body.appendChild(loadingMessage);

        try {
            const response = await fetch('https://hook.us2.make.com/cjqbxpw6d5juypq42qcnyqp7bnlol9s4', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value
                })
            });

            const result = await response.text();

            if (result == "Accepted") {
                // Hide loading message and show thank you container
                loadingMessage.style.display = 'none';
                thankYouContainer.style.display = 'block';
            }
        } catch (error) {
			alert('An error occurred while submitting your entry.');
            console.error('Error submitting form:', error);
        }
    };
});

