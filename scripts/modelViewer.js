//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

class ModelViewer{
    constructor(options={}) {
        this.options = options
        //Create a Three.JS Scene
        this.scene = new THREE.Scene();
        //create a new camera with positions and angles
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
        this.elementID = this.options.elementID ? this.options.elementID : "container3D";
        this.renderer = this.initRenderer()

        //Keep track of the mouse position, so we can make the eye move
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        
        //Keep the 3D object on a global variable so we can access it later
        this.object;
        
        if (this.options.orbitCtrl)
            //OrbitControls allow the camera to move around the scene
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
    }
    
    getRendererSize(scale=50){
        let factor = scale*.01
        return [window.innerWidth*factor, window.innerHeight*factor]
    }
    
    loadModel(modelName){
        //Set which object to render
        let objToRender = modelName;
        let v = this;
        //Instantiate a loader for the .gltf file
        const loader = new GLTFLoader();

        //Load the file
        /* loader.load(
          `./models/${objToRender}/scene.gltf`,
          function (gltf) {
            //If the file is loaded, add it to the scene
            object = gltf.scene;
            scene.add(object);
          },
          function (xhr) {
            //While it is loading, log the progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          function (error) {
            //If there is an error, log it
            console.error(error);
          }
        ); */

        loader.load(
          `./models/${objToRender}/scene.glb`,
          function (gltf) {
            //If the file is loaded, add it to the scene
            v.object = gltf.scene;
            v.scene.add(v.object);
          },
          function (xhr) {
            //While it is loading, log the progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          function (error) {
            //If there is an error, log it
            console.error(error);
          }
        );
    }

    initRenderer(){
        //Instantiate a new renderer and set its size
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true}); //Alpha: true allows for the transparent background
        renderer.setSize(this.getRendererSize()[0], this.getRendererSize()[1]);

        //Add the renderer to the DOM
        document.getElementById(this.elementID).appendChild(renderer.domElement);

        /*//Set how far the camera will be from the 3D model
        this camera.position.z = objToRender === "dino" ? 25 : 1;
        this.camera.position.z = objToRender === "eye" ? 500 : 1;
        this.camera.position.z = objToRender === "desk" ? 5 : 1;
        */
        this.camera.position.z = this.options.camDist ? this.options.camDist : 1;
        //Add lights to the scene, so we can actually see the 3D model
        const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
        topLight.position.set(500, 500, 500) //top-left-ish
        topLight.castShadow = true;
        this.scene.add(topLight);

        const ambientLight = new THREE.AmbientLight(0x333333, 5);
        this.scene.add(ambientLight);

        /*//This adds controls to the camera, so we can rotate / zoom it with the mouse
        if (objToRender) {
          controls = new OrbitControls(camera, renderer.domElement);
        }*/
        
        return renderer;
    }
    
    //Render the scene
    animate(){
        let v = this
        function step(){
            //Here we could add some code to update the scene, adding some automatic movement
  
      // //Make the eye move
      // if (v.object) {
      //   //I've played with the constants here until it looked good 
      //   v.object.rotation.y = -3 + v.mouseX / window.innerWidth * 3;
      //   v.object.rotation.x = -1.2 + v.mouseY * 2.5 / window.innerHeight;
      // }
            if (v.options.orbitCtrl)
                v.controls.update()
            v.renderer.render(v.scene, v.camera);
            requestAnimationFrame(step)
        }
        requestAnimationFrame(step);
    }
}

export {ModelViewer}