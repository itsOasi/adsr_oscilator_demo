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
});

