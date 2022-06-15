const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

let shiftDown = false;
let leftArrow = false;
let rightArrow = false;
let upArrow = false;
let downArrow = false;

let plane_rotate_up = 0;
let plane_rotate_side = 0;
let plane_animate_side = 0;


let plane;
const minSpeed = 1;
const maxSpeed = 3;
let speed = minSpeed;
let speedMultiplicator = 1;

if(window.innerHeight > window.innerWidth) {
    speedMultiplicator = 0.1;
}

function createScene() {
    
    // Scene and Camera
    let scene = new BABYLON.Scene(engine);


    // This creates and initially positions a follow camera 	
    let camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 5, 30), scene);
	
	//The goal distance of camera from target
	camera.radius = 0.1;
	
	// The goal height of camera above local origin (centre) of target
	camera.heightOffset = 2;
	
	// The goal rotation of camera around local origin (centre) of target in x y plane
	camera.rotationOffset = 180;
	
	//Acceleration of camera in moving from current to goal position
	camera.cameraAcceleration = 0.005
	
	//The speed at which acceleration is halted 
	camera.maxCameraSpeed = 10
	
    //camera.attachControl(canvas, true);


    // Lights
    let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;
    light.specular = BABYLON.Color3.Black();

    let light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
    light2.position = new BABYLON.Vector3(0, 5, 5);


    // Load plane character and play infinity animation
    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/", "aerobatic_plane.glb", scene, function (meshes) {          
        
        plane = meshes[0];

        //Scale the model    
        plane.scaling.scaleInPlace(5);
        plane.position.z = -15;
        plane.position.y = 10;

        const planeAnim_idle = scene.getAnimationGroupByName("idle");
        planeAnim_idle.stop();
        //planeAnim_idle.start(true, 0.25, planeAnim_idle.from, planeAnim_idle.to, false); // slow
        planeAnim_idle.start(true, 1, planeAnim_idle.from, planeAnim_idle.to, false); // full speed


        /*****************SET TARGET FOR CAMERA************************/ 
        camera.lockedTarget = plane;
        /**************************************************************/
        
    });

    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/grass.png")

    let ground = BABYLON.Mesh.CreateGround("ground1", 2000, 2000, 0, scene);
    ground.material = groundMat;

    for (let index = -50; index < 50; index++) {
        let sphere;
        sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
        sphere.position.y = 0;
        sphere.position.z = 20*index;
        let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
        sphere.material = groundMaterial;
        sphere.material.diffuseColor = BABYLON.Color3.Yellow();   
    }
    for (let index = -50; index < 50; index++) {
        let sphere;
        sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
        sphere.position.y = 0;
        sphere.position.x = 20*index;
        let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
        sphere.material = groundMaterial;
        sphere.material.diffuseColor = BABYLON.Color3.Red();   
    }

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;			

    return scene;

};


const scene = createScene(); //Call the createScene function

var leftJoystick = new BABYLON.VirtualJoystick(true);
var leftJoystickDown = false;
var rightJoystick = new BABYLON.VirtualJoystick(false);
var rightJoystickDown = false;

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    if(leftJoystick.pressed) {
        leftJoystickDown = true;
    } else {
        leftJoystickDown = false;
        leftJoystick.deltaPosition.x = 0;
        leftJoystick.deltaPosition.y = 0;
    }

    if(rightJoystick.pressed) {
        rightJoystickDown = true;
    } else {
        rightJoystickDown = false;
        rightJoystick.deltaPosition.x = 0;
        rightJoystick.deltaPosition.y = 0;
    }

    /* keyboard game loop */
    if(leftArrow || ((leftJoystick.deltaPosition.x < -0.5 || rightJoystick.deltaPosition.x < -0.5) && (leftJoystickDown || rightJoystickDown))) {
        plane_rotate_side -= 0.02;
        if(plane_animate_side > -1.5) {
            plane_animate_side -= 0.02;
        }
    }
    if(rightArrow || ((leftJoystick.deltaPosition.x > 0.5 || rightJoystick.deltaPosition.x > 0.5) && (leftJoystickDown || rightJoystickDown))) {
        plane_rotate_side += 0.02;
        if(plane_animate_side < 1.5) {
            plane_animate_side += 0.02;
        }
    }
    if(upArrow || ((leftJoystick.deltaPosition.y < -0.5 || rightJoystick.deltaPosition.y < -0.5) && (leftJoystickDown || rightJoystickDown))) {
        plane_rotate_up -= 0.02;
    }
    if(downArrow || ((leftJoystick.deltaPosition.y > 0.5 || rightJoystick.deltaPosition.y > 0.5) && (leftJoystickDown || rightJoystickDown))) {
        plane_rotate_up += 0.02;
    }

    if(!rightArrow && !leftArrow && !leftJoystickDown && !rightJoystickDown) {
        if(plane_animate_side > 0) {
            plane_animate_side -= 0.02;
        }
        if(plane_animate_side < 0) {
            plane_animate_side += 0.02;
        }
    }

    if(shiftDown && speed <= maxSpeed) {
        speed += 0.02;
    } else if(!shiftDown && speed > minSpeed) {
        speed -= 0.02;
    }


    /* fly forward */
    if (plane) {
        plane.rotation = new BABYLON.Vector3(plane_rotate_up*speedMultiplicator, plane_rotate_side*speedMultiplicator, plane_animate_side*speedMultiplicator);
        plane.movePOV(0,0,speed*0.1);
    }
    
    scene.render();
});



// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});


/*****************************************
 * KEYBOARD EVENTS
 *****************************************/
/* x ... left/right */
/* y ... up/down    */
/* z ... forward    */

document.onkeydown = keyListenerDown;
document.onkeyup = keyListenerUp;


/* CHECK PRESSED KEY */
function keyListenerDown(e){
    if (e.keyCode == 16) { // shift
        shiftDown = true;
    }
    if (e.keyCode == 37){ // leftArrow
        leftArrow = true;
    }
    if (e.keyCode == 65){ // a
        leftArrow = true;
    }
    if (e.keyCode == 38){ // upArrow
        upArrow = true;
    }
    if (e.keyCode == 87){ // w
        upArrow = true;
    }
    if (e.keyCode == 39){ // rightArrow
        rightArrow = true;
    }
    if (e.keyCode == 68){ // d
        rightArrow = true;
    }
    if (e.keyCode == 40){ // downArrow
        downArrow = true;
    }
    if (e.keyCode == 83){ // s
        downArrow = true;
    }
    if (e.keyCode == 32){ // space
        space = true;
    }
    if (e.keyCode == 17){ // left strg
        lftstrg = true;
    }
    if (e.keyCode == 16){ // shift
        lftstrg = true;
    }
}
/* CHECK RELEASED KEY */
function keyListenerUp(e){
    if (e.keyCode == 16) { // shift
        shiftDown = false;
    }
    if (e.keyCode == 37){ // leftArrow
        leftArrow = false;
        if(plane_animate_side < 0) {
            plane_animate_side += 0.02;
        }
    }
    if (e.keyCode == 65){ // a
        leftArrow = false;
        if(plane_animate_side < 0) {
            plane_animate_side += 0.02;
        }
    }
    if (e.keyCode == 38){ // upArrow
        upArrow = false;
    }
    if (e.keyCode == 87){ // w
        upArrow = false;
    }
    if (e.keyCode == 39){ // rightArrow
        rightArrow = false;
    }
    if (e.keyCode == 68){ // d
        rightArrow = false;
        if(plane_animate_side > 0) {
            plane_animate_side -= 0.02;
        }
    }
    if (e.keyCode == 40){ // downArrow
        downArrow = false;
    }
    if (e.keyCode == 83){ // s
        downArrow = false;
    }
    if (e.keyCode == 32){ // space
        space = false;
    }
    if (e.keyCode == 17){ // left strg
        lftstrg = false;
    }
    if (e.keyCode == 16){ // shift
        lftstrg = false;
    }
}