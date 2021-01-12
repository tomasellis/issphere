import * as THREE from 'three'
import { Vector3 } from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"


var img = new Image()
img.onload = () => onImageLoaded(img)

var m = require('../assets/map7.png')
img.src = m

const PI_4 = Math.PI/4
const RAD2DEG = 180/Math.PI

function checkPixel( theta, phi, imageData, data){
    
    var x = Math.floor((phi/(2 * Math.PI)) * imageData.width)
    
    var y = Math.floor((theta/Math.PI) * imageData.height)

    var pxCoords = [x ,y + ' / theta: ' + theta]
    console.log(pxCoords)
 
    var pxPos = x * (imageData.width * 4) + y * 4;
    

    if (data[pxPos+3] >= (255/2)){
        return true
    } else {
        return false
    }

}

function onImageLoaded(img){
        const canvas = document.getElementById("nombreAdecuado")
        const ctx = canvas.getContext("2d")
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img,0,0)
        const imageData = ctx.getImageData(0,0,img.width,img.height)
        const data = imageData.data
        init(imageData, data)
    
}

function init(imageData, data){
    //Define my scene, camera and renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x000000 );

    //Link HTML canvas and pass it to renderer
    var canvas3D = document.getElementById("canvas3D");
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas3D});

    //Getting the image ready
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 50);
    camera.lookAt( 0, 0, 0 );

    const controls = new OrbitControls( camera, renderer.domElement );

    //Renderer properties
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );


    //<!--Up is renderer, down is sphere-->
    //Original dot
    const pointGeometry = new THREE.SphereGeometry(0.03, 1, 1);


    var pointMaterial = new THREE.MeshBasicMaterial({color: "#00fbff"});
    var pointMaterial2 = new THREE.MeshBasicMaterial({color: "#fc03c2"});



    //Geometry containing all points
    const kindaGeometry = new THREE.Geometry();
    const kindaGeometry2 = new THREE.Geometry();


    //Ambient and helpers
    const light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );
    const axesHelper = new THREE.AxesHelper( 25 );
    scene.add( axesHelper );

    //Using spherical coordinates
    var x = 0
    var y = 0
    var z = 0
    var r = 15
    var vector = new THREE.Vector3()
    const RADIAN = 0.0174533
    
    //Theta is up-down
    //Phi is side to side
    for (var theta = 0; theta <= 2 * Math.PI; theta += RADIAN) {
        for (var phi = 0; phi <= 4 * Math.PI; phi += RADIAN) {
            vector.setFromSphericalCoords(r, phi, theta)
            if (checkPixel(theta, phi, imageData, data)){
                pointGeometry.translate(vector.x, vector.y, vector.z)
                kindaGeometry.merge(pointGeometry)
                pointGeometry.translate(-vector.x, -vector.y, -vector.z)
            }
        }
    }




    function animate() {
        requestAnimationFrame( animate );
        controls.update()
        renderer.render( scene, camera );
    }

    const fullGeometry = new THREE.Mesh(kindaGeometry, pointMaterial)
    //Rotation fix
    fullGeometry.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-90)
    //Cortex
    const cortMat = new THREE.MeshBasicMaterial({color: "#000000"});
    const cort = new THREE.SphereGeometry(r-0.1,12,10)
    const meshCort = new THREE.Mesh(cort,cortMat)
    scene.add(meshCort)
    scene.add(fullGeometry)
    animate();
}














// //Circle generator

// /*function circleGen(r,z,a,b,phase,spacing){
//     const circlePoints = []
//     for (var theta = 0; theta <= 2 * Math.PI; theta += spacing){
//         circlePoints.push( new THREE.Vector3(Math.cos(a*theta + phase)*r, Math.sin(b*theta)*r, z) )
//     }
//     console.log(circlePoints)
//     const circleGeometry = new THREE.BufferGeometry().setFromPoints( circlePoints )
//     const circleMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
//     const circle = new THREE.Line( circleGeometry, circleMaterial );
//     return circle
// }



// var img = new Image();
// img.crossOrigin = 'anonymous';
// img.src = require('../assets/map.jpg')
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');
// img.onload = function() {
//   ctx.drawImage(img, 0, 0);
// };
// var hoveredColor = document.getElementById('hovered-color');
// var selectedColor = document.getElementById('selected-color');

// function pick(event, destination) {
//   var x = event.layerX;
//   var y = event.layerY;
//   var pixel = ctx.getImageData(x, y, 1, 1);
//   var data = pixel.data;

//     const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
//     destination.style.background = rgba;
//     destination.textContent = rgba;

//     return rgba;
// }

// canvas.addEventListener('mousemove', function(event) {
//     pick(event, hoveredColor);
// });
// canvas.addEventListener('click', function(event) {
//     pick(event, selectedColor);
// });