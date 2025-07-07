import { ModelViewer } from "./scripts/modelViewer.js";

document.addEventListener("DOMContentLoaded", () => {
    let url = new URLSearchParams(location.search)
    let mv = null;
    let page = url.get("page") || 'home';
    navigateTo(page);

    document.querySelector("#home").onclick = () => {
        navigateTo('home');
        mv = null;
    }
    
    messageBus.on('createWheel', () => {
        createWheel();
    });

    messageBus.on('submit', (entry) => {
        submitEntry(entry);
    });

    function createWheel(){
        console.log("creating wheel");
        let mvOptions = {
            orbitCtrl: false,
            camDist: .3
        }
        mv = new ModelViewer(mvOptions);
        mv.loadModel("mug")
        mv.animate();

        //Add a listener to the window, so we can resize the window and the camera
        window.addEventListener("resize", function () {
            mv.camera.aspect = window.innerWidth / window.innerHeight;
            mv.camera.updateProjectionMatrix();
            mv.renderer.setSize(getRendererSize()[0], getRendererSize()[1]);
        });

        //add mouse position listener, so we can make the eye move
        document.onmousemove = (e) => {
            mv.mouseX = e.clientX;
            mv.mouseY = e.clientY;
        }
    }

    async function submitEntry(entry) {
          
        // Hide the form and show loading message
        enterRaffleContainer.style.display = 'none';

        // Create a loading message
        const loadingMessage = document.createElement('p');
        loadingMessage.innerText = 'Submitting your entry...';
        document.body.appendChild(loadingMessage);
    
        const formData = new FormData(entry);
        const data = Object.fromEntries(formData.entries());

        // const result = await AppwriteClient.submitForm(data);
        // if (result) {
        //     console.log("Form submitted successfully!", result);
        // } else {
        //     console.log("Submission failed.");
        // }

        try {
            const response = await fetch('https://hook.us2.make.com/cjqbxpw6d5juypq42qcnyqp7bnlol9s4', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: entry
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

