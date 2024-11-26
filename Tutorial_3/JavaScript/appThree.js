document.addEventListener('DOMContentLoaded', Start); 

var cena = new THREE.Scene(); 
var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10); 
var renderer = new THREE.WebGLRenderer(); 

//Linha responsável por criar a câmera perspectiva com os parâmetros de field of view 45,
//aspect ratio de 4/3, plano anterior de 0.1 unidaes e plano posterior de 100 unidades.
var camaraPerspetiva = new  THREE.PerspectiveCamera(45, 4/3, 0.1, 100);

renderer.setSize(window.innerWidth -15, window.innerHeight -10); 

renderer.setClearColor(0xaaaaaa); 

document.body.appendChild(renderer.domElement); 

var geometria = new THREE.BufferGeometry(); 
var vertices = new Float32Array( [ 
    -0.5, -0.5, 0.0, 
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0, 
] );

const cores = new Float32Array( [ 
    1.0, 0.0, 0.0, 
    0.0, 1.0, 0.0, 
    0.0, 0.0, 1.0, 
] );

geometria.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometria.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cores), 3)); 

var material = new THREE.MeshBasicMaterial({vertexColors: true}); 

var mesh = new THREE.Mesh(geometria, material); 

//Desafio 2
mesh.translateX(-2.5);
mesh.translateY(1);

//Desafio 1
mesh.scale.set(0.7,0.7,0.7); 

//Desafio 3
mesh.translateZ(-6.0);
mesh.translateY(1);


//variavel relativa ao angulo de rotação
var anguloDeRotacao = 0;

function Start(){
    cena.add(mesh); 

    //camaraPerspetiva.position.z = 3; //3 mais perto que 4 
    renderer.render(cena, camaraPerspetiva); 

    //função para chamar a nossa função de loop
    requestAnimationFrame(loop);
}
    
function loop()
{
    mesh.rotateY(Math.PI/180 * 1);
    renderer.render(cena, camera); 

    //função chamada para gerarmos um novo frame
    renderer.render(cena, camaraPerspetiva);

    //executa dnv o loop para gerar o frame seguinte
    requestAnimationFrame(loop); 
}
