document.addEventListener("DOMContentLoaded", Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
var renderer = new THREE.WebGLRenderer();

var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4/3, 0.1, 100);

renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);

renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);

var geometria = new THREE.BufferGeometry();
var vertices = new Float32Array([
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0, 0.5, 0
]);


var cores = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);

geometria.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometria.setAttribute('color', new THREE.BufferAttribute(cores, 3));

var material = new THREE.MeshBasicMaterial({ vertexColors: true });

var mesh = new THREE.Mesh(geometria, material);

mesh.translateZ(-6.0);

var anguloDeRotacao = 0;

mesh.translateX(0);
mesh.translateY(0);

mesh.scale.set(0.25, 0.25, 0.25);


var geometriaCubo = new THREE.BoxBufferGeometry(1,1,1);
var materialCubo = new THREE.MeshBasicMaterial ( { vertexColors: true});

const vertexColorsCubo = new Float32Array( [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 0.0,

    1.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,

    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 0.0,

    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,

    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 0.0,
])

geometriaCubo.setAttribute( 'color', new THREE.Float32BufferAttribute( vertexColorsCubo, 3));

meshCubo = new THREE.Mesh (geometriaCubo, materialCubo);

meshCubo.translateZ(-6.0);

function Start(){
    cena.add( meshCubo);

    renderer.render(cena, camaraPerspetiva);
    
    requestAnimationFrame(Loop);
}

function Loop(){
    meshCubo.rotateY(Math.PI/180 * 1);

    renderer.render(cena,camaraPerspetiva);

    requestAnimationFrame(Loop);
}