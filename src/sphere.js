import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import  booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { Vector3 } from 'three'
//import * as helpers from '@turf/helpers'

const geoJSON = require('../assets/geoJSON1.json')
const { point, geometry } = require('@turf/helpers')



var img = new Image()
img.onload = () => onImageLoaded(img)

var m = require('../assets/map5.png')
img.src = m

const PI_4 = Math.PI/4
const RAD2DEG = 180/Math.PI
const PI_2 = Math.PI/2

// var x = Math.floor((phi/(2 * Math.PI)) * imageData.width)
    
    // var y = Math.floor((theta/Math.PI) * imageData.height)

    // var pxCoords = [x ,y + ' / theta: ' + theta]
    // console.log(pxCoords)

// function checkPixel( theta, phi, imageData, data){
    
//     const mapHeight = imageData.height
//     const mapWidth = imageData.width
//     var x = Math.floor((phi/(2 * Math.PI)) * imageData.width)
    
//     var y = Math.floor((theta/Math.PI) * imageData.height)

//     var pxCoords = [x ,y + ' / theta: ' + theta]
//     console.log(pxCoords)

//     console.log('x', Math.floor(x), 'y', Math.floor(y))
//     var pxPos = Math.floor(x) * (imageData.width * 4) + Math.floor(y) * 4;
    

//     if (data[pxPos+] >= (255/2)){
//         return true
//     } else {
//         return false
//     }

// }




function checkPoly (phi, theta, geoJSON){
    var latitude = (phi - PI_2) * RAD2DEG
    var longitude = -(theta - Math.PI) * RAD2DEG
    let pnt = point([longitude, latitude])
    for (var i = 0; i < geoJSON.features.length; i++) {
        var poly = geoJSON.features[i].geometry
        if (booleanPointInPolygon(pnt, poly)) {
            return true;
        }
    }
    return false;
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

    //Getting the camera
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 50);
    camera.lookAt( 0, 0, 0 );
    const controls = new OrbitControls( camera, renderer.domElement );

    //Renderer properties
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    var line = null

    function insertPoint(vector){
        pointGeometry.translate(vector.x, vector.y, vector.z)
        generalGeometry.merge(pointGeometry)
        pointGeometry.translate(-vector.x, -vector.y, -vector.z)
    
       
    }
    //<!--Up is renderer, down is sphere-->
    

    const generalMaterial = new THREE.MeshBasicMaterial({color: "#00fbff"});
    const specificMaterial = new THREE.MeshBasicMaterial({color: "#ff053f"})

    //points
    const pointGeometry = new THREE.SphereGeometry(0.03, 1, 1)
    //points1
    const pointGeometry1 = new THREE.SphereGeometry(0.03, 1, 1)

    //Geometry containing all general points
    const generalGeometry = new THREE.Geometry()
    //Geometry containing specific points
    const specificGeometry = new THREE.Geometry()

    //Ambient and helpers
    const light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );
    const axesHelper = new THREE.AxesHelper( 25 );
    scene.add( axesHelper );

    //Using spherical coordinates
    var r = 15
    var vector = new THREE.Vector3()
    const DEGREE = 0.0174533/2
    
    //Phi is up-down
    //Theta is side to side
    for (var phi = 0; phi <= Math.PI; phi += DEGREE) {
        for (var theta = 0; theta <= 2 * Math.PI; theta += DEGREE) {
            vector.setFromSphericalCoords(r, phi, theta)
            if (checkPoly(phi, theta, geoJSON)) {
                insertPoint(vector)
            }
        }
    }

    //Center on location
    var locLatitude = -38.7183
    var locLongitude = -62.2663
    theta = -locLongitude/RAD2DEG + Math.PI 
    phi = locLatitude/RAD2DEG + PI_2 
    vector.setFromSphericalCoords(r, phi, theta)
    //Making line from 0 to vector
    const points2 = []
    points2.push( new THREE.Vector3( 0, 0, 0 ) );
    vector = new THREE.Vector3(vector.x, vector.y, vector.z).setLength(30)
    points2.push( new THREE.Vector3( vector.x, vector.y, vector.z ) );
    const line2Geometry = new THREE.BufferGeometry().setFromPoints(points2)
    const line2Material = new THREE.LineBasicMaterial({color: 0x65ff54})
    const line2 = new THREE.Line(line2Geometry, line2Material)
    
    locLatitude = 0
    locLongitude = 0
    theta = -locLongitude/RAD2DEG + Math.PI 
    phi = locLatitude/RAD2DEG + PI_2 
    vector.setFromSphericalCoords(r, phi, theta)

    const points3 = []
    points3.push( new THREE.Vector3( 0, 0, 0 ) );
    vector = new THREE.Vector3(vector.x, vector.y, vector.z).setLength(30)
    points3.push( new THREE.Vector3( vector.x, vector.y, vector.z ) );
    const line3Geometry = new THREE.BufferGeometry().setFromPoints(points3)
    const line3Material = new THREE.LineBasicMaterial({color: 0x65ff54})
    const line3 = new THREE.Line(line3Geometry, line3Material)
    scene.add(line2, line3)

    



    function animate() {
        requestAnimationFrame( animate );
        controls.update()
        renderer.render( scene, camera );
    }

    const specificMesh = new THREE.Mesh(specificGeometry, specificMaterial)
    const generalMesh = new THREE.Mesh(generalGeometry, generalMaterial)
    //Rotation fix
    generalMesh.rotateOnWorldAxis(new THREE.Vector3(0,1,0),90)
    specificMesh.rotateOnWorldAxis(new THREE.Vector3(0,1,0),90)
    generalMesh.rotateOnWorldAxis(new THREE.Vector3(0,0,1),135.1)
    specificMesh.rotateOnWorldAxis(new THREE.Vector3(0,0,1),135.1)
    
    line3.rotateOnWorldAxis(new THREE.Vector3(0,1,0),90)
    line3.rotateOnWorldAxis(new THREE.Vector3(0,0,1),135.1)
    line2.rotateOnWorldAxis(new THREE.Vector3(0,1,0),90)
    line2.rotateOnWorldAxis(new THREE.Vector3(0,0,1),135.1)
    //Cortex
    const cortMat = new THREE.MeshBasicMaterial({color: "#000000"});
    const cort = new THREE.SphereGeometry(r-0.01,12,10)
    const meshCort = new THREE.Mesh(cort,cortMat)
    
    
    scene.add(line)
    scene.add(meshCort)
    scene.add(generalMesh)
    scene.add(specificMesh)
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