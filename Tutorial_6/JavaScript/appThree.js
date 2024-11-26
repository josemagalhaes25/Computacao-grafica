// Importação da biblioteca ThreeJS baseada no importmap
import * as THREE from 'three';

// Importação da biblioteca que nos permite explorar a nossa cena através do importmap
import { PointerLockControls } from 'PointerLockControls';

// Importação da biblioteca que nos permite importar objetos 3D em formato FBX baseada no importmap
import { FBXLoader } from 'FBXLoader';

document.addEventListener("DOMContentLoaded", Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
var renderer = new THREE.WebGLRenderer();

var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4/3, 0.1, 100);

renderer.setSize(window.innerWidth -15, window.innerHeight -80);
renderer.setClearColor(0xaaaaaa);   

document.body.appendChild(renderer.domElement); 

// Variável que guardará o objeto importado
var objetoImportado;

// Variável que irá guardar o controlador de animações do objeto importado
var mixerAnimacao;

// Variável que é responsável por controlar o tempo da aplicação
var relogio = new THREE.Clock();

// Variável com o objeto responsável por importar ficheiros FBX
var importer = new FBXLoader();

importer.load('./Objetos/Samba Dancing.fbx', function (object) {

    // O mixerAnimação é inicializado tendo em conta o objeto importado
    mixerAnimacao = new THREE.AnimationMixer(object);

    // object.animations é um array com todas as animações que o objeto trás quando é importado.
    // O que nós fazemos, é criar uma ação de animação tendo em conta a animação que é pretendida.
    // De seguida é inicializada a reprodução da animação.
    var action = mixerAnimacao.clipAction(object.animations[0]);
    action.play();

    // object.traverse é uma função que percorre todos os filhos desse mesmo objeto.
    // O primeiro e único parâmetro da função é uma nova função que deve ser chamada para cada
    // filho. Neste caso, o que nós fazemos é ver se o filho tem uma mesh e, no caso de ter,
    // é indicado a esse objeto que deve permitir projetar e receber sombras. respetivamente.
    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Adiciona o objeto importado à cena
    cena.add(object);

    // Quando o objeto é importado, este tem uma escala de 1 nos três eixos(XYZ). Uma vez que
    // este é demasiado grande, mudamos a escala deste objeto para ter 0.01 em todos os eixos.
    object.scale.x = 0.01;
    object.scale.z = 0.01;
    object.scale.y = 0.01;

    // Mudamos a posição do objeto importado para que este não fique na mesma posição que o cubo.
    object.position.x = 1.5;
    object.position.z = -0.5;
    object.position.y = -6.0;

    // Ajuste da posição do objeto importado para colocá-lo ao lado direito do cubo
    object.position.copy(meshCubo.position);
    object.position.x += 2; // Adicionando 2 unidades à coordenada x
    object.position.y -= 1; // Subtraindo 2 unidades à coordenada y

    // Guardamos o objeto importado na variável objetoImportado.
    objetoImportado = object;
});

var geometriaCubo = new THREE.BoxGeometry();

var textura = new THREE.TextureLoader().load('./Images/boxImage.jpg');
var materialTextura = new THREE.MeshStandardMaterial({map:textura});

var meshCubo = new THREE.Mesh (geometriaCubo, materialTextura);
meshCubo.translateZ(-6.0);

// Carregar a imagem do WhatsApp
var textureWhatsApp = new THREE.TextureLoader().load('./Images/Imagem WhatsApp 2024-04-09 às 23.19.26_5c30a21b.jpg');

// Criar material para a imagem do WhatsApp
var materialWhatsApp = new THREE.MeshBasicMaterial({ map: textureWhatsApp });

// Criar uma nova geometria para o lado esquerdo do cubo
var ladoEsquerdoGeometria = new THREE.PlaneGeometry(1, 1); // Ajuste os valores de largura e altura conforme necessário

// Criar uma mesh para representar a imagem do WhatsApp
var meshWhatsApp = new THREE.Mesh(ladoEsquerdoGeometria, materialWhatsApp);

// Ajustar a posição da mesh do WhatsApp para o lado esquerdo do cubo
meshWhatsApp.position.copy(meshCubo.position);
meshWhatsApp.position.x -= 2; // Subtraindo 2 unidades à coordenada x (um pouco mais para a esquerda)
meshWhatsApp.position.z -= 1; // Subtraindo 1 unidade à coordenada z (um pouco para trás)

// Adicionar a mesh do WhatsApp à cena
cena.add(meshWhatsApp);

// Definição da câmara e do renderer a serem associados ao PointerLockControls
const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement)

controls.addEventListener('lock', function () {
// Possibilidade de programar comportamentos (ThreeJS ou mesmo HTML) quando
// o PointerLockControls é ativado
});

controls.addEventListener('lock', function () {
// Possibilidade de programar comportamentos (ThreeJS oiu mesmo HTML) quando
// o PointerLockControls é ativado
});

// Ativação do PointerLockControls através do clique na cena
// Para desativar o PointerLockControls, basta pressionar a tecla Enter
document.addEventListener(
    'click',
    function () {
        controls.lock()
    },
    false
);

// carregamento de texturas para variáveis
var texture_dir = new THREE.TextureLoader().load('./Skybox/posx.jpg'); // Imagem da direita
var texture_esq = new THREE.TextureLoader().load('./Skybox/negx.jpg'); // Imagem da esquerda
var texture_up = new THREE.TextureLoader().load('./Skybox/posy.jpg'); // Imagem da cima
var texture_dn = new THREE.TextureLoader().load('./Skybox/negy.jpg'); // Imagem da baixo
var texture_bk = new THREE.TextureLoader().load('./Skybox/posz.jpg'); // Imagem da trás
var texture_ft = new THREE.TextureLoader().load('./Skybox/negz.jpg'); // Imagem da frente

// Array que vai armazenar as texturas~
var materialArray = [];

// Associar as texturas carregadas ao array
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dir }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_esq }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));

// Ciclo para fazer com que todas as texturas do array sejam aplicadas na parte interior do cubo
for (var i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;

// Criação da geometria da skybox
var skyboxGeo = new THREE.BoxGeometry( 100, 100, 100);

// Criação da mesh que vai conter a geometria e as texturas
var skybox = new THREE.Mesh( skyboxGeo, materialArray );

// Adicionar a Skybox á cena
cena.add( skybox )

function Start(){
    cena.add(meshCubo);

    // Criação de um foco de luz com a cor branca (#ffffff) e intensidade a 1 (intensidade normal).
    var focoLuz = new THREE.SpotLight('#ffffff', 1);

    // Mudar a posição da luz para ficar 5 unidades a cima de onde a câmara se encontra.
    focoLuz.position.y = 5;
    focoLuz.position.z = 10;

    // Dizemos a light para ficar a apontar para a posição do cubo.
    focoLuz.lookAt(meshCubo.position);

    // Adicionamos a light à cena.
    cena.add(focoLuz);

    renderer.render(cena, camaraPerspetiva);
    
    requestAnimationFrame(loop);
}

function loop(){
    meshCubo.rotateY(Math.PI/180 * 1);

    // Animação da mesh do WhatsApp em forma de lua semi crescente
    var raio = 2; // Ajuste o raio conforme necessário
    var velocidade = 0.0001; // Velocidade de movimento da imagem do WhatsApp
    
    // Calcular a posição da imagem do WhatsApp em relação ao cubo
    var angulo = meshCubo.rotation.y - Math.PI; // Ângulo de rotação do cubo, com deslocamento para o lado esquerdo
    var x = meshCubo.position.x + raio * Math.cos(angulo); // Posição X com base no raio e no ângulo
    var z = meshCubo.position.z + raio * Math.sin(angulo); // Posição Z com base no raio e no ângulo

    meshWhatsApp.position.set(x, meshCubo.position.y, z);

    // Aumentando o tamanho da imagem do WhatsApp
    meshWhatsApp.scale.set(1.5, 1.5, 1.5); // Ajuste o valor conforme necessário

    // Necessário atualizar o mixerAnimação tendo em conta o tempo desde o último update.
    // relogio.getDelta() indica quanto tempo passou desde o último frame renderizado.
    if(mixerAnimacao) {
        mixerAnimacao.update(relogio.getDelta());
    }

    renderer.render(cena,camaraPerspetiva);

    requestAnimationFrame(loop);
}

// Adiciona o listener que permite detetar quando uma tecla é premida
document.addEventListener("keydown", onDocumentKeyDown, false);

// Função que permite processar o evento de premir teclas e definir
// o seu respetivo comportamento
function onDocumentKeyDown(event) {
    var KeyCode = event.which;
    // Comportamento para a tecla W
    if (KeyCode == 87) {
        controls.moveForward(0.25)
    }
    // Comportamento para a tecla S
    else if (KeyCode == 83) {
        controls.moveForward(-0.25)
    }
    // Comportamento para a tecla A
    else if (KeyCode == 65) {
        controls.moveRight(-0.25)
    }
    // Comportamento para a tecla D
    if (KeyCode == 68) {
        controls.moveRight(0.25);
    }
    // Comportamento para a tecla Barra de Espaço
    else if (KeyCode == 32){
        // Verificar se o cubo está presente na cena.
        // Caso esteja, removemos. caso contrário, adicionamos.
        if(meshCubo.parent == cena) {
            cena.remove(meshCubo);
        } else {
            cena.add(meshCubo);
        }
    }
};