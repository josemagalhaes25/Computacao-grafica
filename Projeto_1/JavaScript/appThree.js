// Importação da biblioteca ThreeJS baseada no importmap
import * as THREE from 'three';

// Importação da biblioteca que nos permite explorar a nossa cena através do importmap
import { PointerLockControls } from 'PointerLockControls';

// Importação da biblioteca que nos permite importar objetos 3D em formato FBX baseada no importmap
import { FBXLoader } from 'FBXLoader';

document.addEventListener("DOMContentLoaded", Start);

var cena = new THREE.Scene();
var cameraPerspetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);
renderer.setClearColor(0xc0e6f0);

document.body.appendChild(renderer.domElement);


// Variável que é responsável por controlar o tempo da aplicação
var relogio = new THREE.Clock();

// Variável com o objeto responsável por importar ficheiros FBX
var importer = new FBXLoader();

var controls;

// Função para criar o tabuleiro

function criarTabuleiro() {
    const tamanhoTabuleiro = 10;
    const tamanhoCasa = 1;

    const tabuleiro = new THREE.Group();

    var numero = 100;

    for (let i = 0; i < tamanhoTabuleiro; i++) {
        for (let j = 0; j < tamanhoTabuleiro; j++) {
            const cor = ((i + j) % 2 === 0) ? 0xE6C9A8 : 0xffff00; // Alternar entre branco e amarelo
            const geometry = new THREE.BoxGeometry(tamanhoCasa, 0.1, tamanhoCasa);
            const material = new THREE.MeshStandardMaterial({ color: cor });
            const casa = new THREE.Mesh(geometry, material);
            casa.position.set(j - tamanhoTabuleiro / 2 + 0.5, 0, i - tamanhoTabuleiro / 2 + 0.5); // Centralizar o tabuleiro
            tabuleiro.add(casa);

            // Adicionar número em cada quadradinho
            const numeroTextura = criarNumeroTextura(numero);
            const numeroMaterial = new THREE.MeshBasicMaterial({ map: numeroTextura, transparent: true });
            const numeroMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), numeroMaterial);
            numeroMesh.position.set(j - tamanhoTabuleiro / 2 + 0.55, 0.2, i - tamanhoTabuleiro / 2 + 0.55); // Posição no canto superior direito do quadrado
            tabuleiro.add(numeroMesh);

            numero--;
        }
    }

    // Adicionar o tabuleiro à cena
    cena.add(tabuleiro);
}

// Função para criar textura com número
function criarNumeroTextura(numero) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.fillText(numero.toString(), 10, 30);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function criarRelva() {
    const tamanhoRelva = 100; // Tamanho do plano da relva
    const texturaRelva = new THREE.TextureLoader().load('Images/relva.png');
    const materialRelva = new THREE.MeshBasicMaterial({ map: texturaRelva });
    const geometriaRelva = new THREE.PlaneGeometry(tamanhoRelva, tamanhoRelva);
    const relva = new THREE.Mesh(geometriaRelva, materialRelva);
    relva.rotation.x = -Math.PI / 2; // Rotaciona para que o plano fique paralelo ao chão
    relva.position.y = -1; // Posiciona abaixo do tabuleiro
    cena.add(relva);
}



var sol;
var luzDoSol;

importer.load( './Objetos/sol.fbx', function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Ajuste a cor do material aqui
            var material = new THREE.MeshStandardMaterial({
                color: 0xffff00, // Amarelo claro
                roughness: 0.75, // Rugosidade
                metalness: 0.25 // Metalização
               
            });
            child.material = material;
        }
    });

    cena.add(object);

    object.scale.set(0.05, 0.05, 0.05); // Ajuste a escala conforme necessário
    object.position.set(15, 15, -6); // Ajuste a posição conforme necessário
    object.rotation.set(0, Math.PI /15, 0); // Ajuste a rotação conforme necessário

    sol = object;

    // Adicionando a luz do sol
    luzDoSol = new THREE.PointLight(0xffffff, 1, 200); // Cor branca, intensidade 1, alcance 100
    luzDoSol.position.copy(object.position); // Posição da luz igual à posição do sol
    cena.add(luzDoSol);
});


var lua;
var luzDaLua;

importer.load( './Objetos/lua.fbx', function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Ajuste a cor do material aqui
            var material = new THREE.MeshStandardMaterial({
                color: 0xffffff, // Amarelo claro
                roughness: 0.75, // Rugosidade
                metalness: 0.25 // Metalização
               
            });
            child.material = material;
        }
    });

    //cena.add(object);

    object.scale.set(0.05, 0.05, 0.05); // Ajuste a escala conforme necessário
    object.position.set(-10, 20, -20); // Ajuste a posição conforme necessário
    object.rotation.set(0, Math.PI /15, 0); // Ajuste a rotação conforme necessário

    lua = object;

    // Adicionando a luz do sol
    luzDaLua = new THREE.PointLight(0xffffff, 1, 200); // Cor branca, intensidade 1, alcance 100
    luzDaLua.position.copy(object.position); // Posição da luz igual à posição do sol
    cena.add(luzDaLua);
});


var cobra1;

importer.load( './Objetos/cobra.fbx', function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Ajuste a cor do material aqui
            var material = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                roughness: 0.75, // Rugosidade
                metalness: 0.25 // Metalização
            });
            child.material = material;
        }
    });

    cena.add(object);

    object.scale.set(0.01, 0.01, 0.01); // Ajuste a escala conforme necessário
    object.position.set(1, 0.4, -3); // Ajuste a posição conforme necessário
    object.rotation.set(0, Math.PI /1.2, 0); // Ajuste a rotação conforme necessário

    cobra1 = object;
});

var cobra2;

importer.load( './Objetos/cobra2.fbx', function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Ajuste a cor do material aqui
            var material = new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                roughness: 0.75, // Rugosidade
                metalness: 0.25 // Metalização
            });
            child.material = material;
        }
    });

    cena.add(object);

    object.scale.set(0.016, 0.016, 0.016); // Ajuste a escala conforme necessário
    object.position.set(0, 0.5, 3); // Ajuste a posição conforme necessário
    //object.rotation.set(0, Math.PI /1.2, 0); // Ajuste a rotação conforme necessário
    object.rotation.set(3*Math.PI/2 , Math.PI /2, -Math.PI ); // Ajuste a rotação conforme necessário

    cobra2 = object;
});

var cobra3;

importer.load( './Objetos/cobra.fbx', function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Ajuste a cor do material aqui
            var material = new THREE.MeshStandardMaterial({
                color: 0xffa500,
                roughness: 0.75, // Rugosidade
                metalness: 0.25 // Metalização
            });
            child.material = material;
        }
    });

    cena.add(object);

    object.scale.set(0.01, 0.01, 0.01); // Ajuste a escala conforme necessário
    object.position.set(-1.5, 0.4, 1.5); // Ajuste a posição conforme necessário
    object.rotation.set(0, Math.PI /2, 0); // Ajuste a rotação conforme necessário

    cobra3 = object;
});

var cobra2;

importer.load( './Objetos/cobra2.fbx', function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Ajuste a cor do material aqui
            var material = new THREE.MeshStandardMaterial({
                color: 0x8A2BE2,
                roughness: 0.75, // Rugosidade
                metalness: 0.25 // Metalização
            });
            child.material = material;
        }
    });

    cena.add(object);

    object.scale.set(0.016, 0.016, 0.016); // Ajuste a escala conforme necessário
    object.position.set(3, 0.5, -1); // Ajuste a posição conforme necessário
    //object.rotation.set(0, Math.PI /1.2, 0); // Ajuste a rotação conforme necessário
    object.rotation.set(3*Math.PI/2 , Math.PI /2, -Math.PI ); // Ajuste a rotação conforme necessário

    cobra2 = object;
});

function criarEscadote1(posicao, altura, largura) {
    var materialDegrau = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Cor marrom para os degraus
    var materialSuporte = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Cor cinza para os suportes

    // Altura do suporte
    var suporteAltura = altura / 2;

    // Criar os suportes laterais
    var suporteEsquerdo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, suporteAltura, 32), materialSuporte);
    suporteEsquerdo.position.set(posicao.x - largura / 2, posicao.y + suporteAltura / 2, posicao.z);
    suporteEsquerdo.rotation.set(Math.PI / 1.6, 0, -0.5); // Rotaciona o suporte para ficar paralelo ao chão
    cena.add(suporteEsquerdo);

    var suporteDireito = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, suporteAltura, 32), materialSuporte);
    suporteDireito.position.set(posicao.x + largura / 2, posicao.y + suporteAltura / 2, posicao.z);
    suporteDireito.rotation.set(Math.PI / 1.6, 0, -0.5); // Rotaciona o suporte para ficar paralelo ao chão
    cena.add(suporteDireito);

    // Definir os degraus
    var degrau1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.65, 32), materialDegrau);
    degrau1.rotation.set(Math.PI / 3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau1.position.set(2.60,0.17,1);
    cena.add(degrau1);

    var degrau2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.65, 32), materialDegrau);
    degrau2.rotation.set(Math.PI / 3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau2.position.set(2.85, 0.17, 1.6);
    cena.add(degrau2);

    var degrau3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.65, 32), materialDegrau);
    degrau3.rotation.set(Math.PI / 3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau3.position.set(3.09,0.17,2.2);
    cena.add(degrau3);

    var degrau4 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.65, 32), materialDegrau);
    degrau4.rotation.set(Math.PI / 3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau4.position.set(3.29,0.17,2.8);
    cena.add(degrau4);

}

// Chamada da função para criar um escadote
criarEscadote1({ x: 2.7, y: 0, z: 3.2 }, 5, 0.5); // Posição, altura e largura do escadote

function criarEscadote2(posicao, altura, largura) {
    var materialDegrau = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Cor marrom para os degraus
    var materialSuporte = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Cor cinza para os suportes

    // Altura do suporte
    var suporteAltura = altura;

    // Criar os suportes laterais
    var suporteEsquerdo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, suporteAltura, 32), materialSuporte);
    suporteEsquerdo.position.set(posicao.x - largura / 2, posicao.y + suporteAltura / 1.5, posicao.z);
    suporteEsquerdo.rotation.set(Math.PI / 2.2, 0, 0.5); // Rotaciona o suporte para ficar paralelo ao chão
    cena.add(suporteEsquerdo);

    var suporteDireito = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, suporteAltura, 32), materialSuporte);
    suporteDireito.position.set(posicao.x + largura / 2, posicao.y + suporteAltura / 2, posicao.z);
    suporteDireito.rotation.set(Math.PI / 2.2, 0, 0.5); // Rotaciona o suporte para ficar paralelo ao chão
    cena.add(suporteDireito);

    // Definir os degraus
    var degrau1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau1.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau1.position.set(-3.12,0.17,3.4);
    cena.add(degrau1);

    var degrau2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau2.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau2.position.set(-2.8, 0.17, 2.9);
    cena.add(degrau2);

   
}

// Chamada da função para criar um escadote
criarEscadote2({ x: -2.8, y: 0, z: 3.8 }, 1.5, 0.4); // Posição, altura e largura do escadote

function criarEscadote3(posicao, altura, largura) {
    var materialDegrau = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Cor marrom para os degraus
    var materialSuporte = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Cor cinza para os suportes

    // Altura do suporte
    var suporteAltura = altura;

    // Criar os suportes laterais
    var suporteEsquerdo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, suporteAltura, 32), materialSuporte);
    suporteEsquerdo.position.set(posicao.x - largura / 2, posicao.y + suporteAltura / 1.9, posicao.z);
    suporteEsquerdo.rotation.set(Math.PI / 2.2, 0, 0.5); // Rotaciona o suporte para ficar paralelo ao chão
    cena.add(suporteEsquerdo);

    var suporteDireito = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, suporteAltura, 32), materialSuporte);
    suporteDireito.position.set(posicao.x + largura / 2, posicao.y + suporteAltura / 2, posicao.z);
    suporteDireito.rotation.set(Math.PI / 2.2, 0, 0.5); // Rotaciona o suporte para ficar paralelo ao chão
    cena.add(suporteDireito);

    // Definir os degraus
    var degrau1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau1.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau1.position.set(-1.9,0.17,-3.15);
    cena.add(degrau1);

    var degrau2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau2.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau2.position.set(-2.25, 0.17, -2.55);
    cena.add(degrau2);

    var degrau3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau3.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau3.position.set(-2.7, 0.17, -1.95);
    cena.add(degrau3);

    var degrau4 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau4.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau4.position.set(-3.25, 0.17, -1.35);
    cena.add(degrau4);

    var degrau5 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau5.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau5.position.set(-3.7, 0.17, -0.75);
    cena.add(degrau5);
   
    var degrau6 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau6.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau6.position.set(-4.2, 0.17, -0.15);
    cena.add(degrau6);
}

// Chamada da função para criar um escadote
criarEscadote3({ x: -2.3, y: 0, z: 1.2 }, 4.5, 0.5); // Posição, altura e largura do escadote


// Função para criar uma árvore com maçãs ao redor das folhas
function criarArvore(posicao, escala) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91E56E });
    var leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xA2FF7A });
    var stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7D5A4F });

    // Criar o tronco da árvore
    var stem = new THREE.Mesh(geometry, stemMaterial);
    stem.position.set(posicao.x, posicao.y, posicao.z);
    stem.scale.set(0.3 * escala, 1.5 * escala, 0.3 * escala);

    // Criar as folhas da árvore
    var squareLeave01 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave01.position.set(posicao.x + 0.5 * escala, posicao.y + 1.6 * escala, posicao.z + 0.5 * escala);
    squareLeave01.scale.set(0.8 * escala, 0.8 * escala, 0.8 * escala);

    var squareLeave02 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave02.position.set(posicao.x - 0.4 * escala, posicao.y + 1.3 * escala, posicao.z - 0.4 * escala);
    squareLeave02.scale.set(0.7 * escala, 0.7 * escala, 0.7 * escala);

    var squareLeave03 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave03.position.set(posicao.x + 0.4 * escala, posicao.y + 1.7 * escala, posicao.z - 0.5 * escala);
    squareLeave03.scale.set(0.7 * escala, 0.7 * escala, 0.7 * escala);

    var leaveDark = new THREE.Mesh(geometry, leaveDarkMaterial);
    leaveDark.position.set(posicao.x, posicao.y + 1.2 * escala, posicao.z);
    leaveDark.scale.set(1 * escala, 2 * escala, 1 * escala);

    var leaveLight = new THREE.Mesh(geometry, leaveLightMaterial);
    leaveLight.position.set(posicao.x, posicao.y + 1.2 * escala, posicao.z);
    leaveLight.scale.set(1.1 * escala, 0.5 * escala, 1.1 * escala);


    // Agrupar todos os elementos da árvore
    var tree = new THREE.Group();
    tree.add(squareLeave01);
    tree.add(squareLeave02);
    tree.add(squareLeave03);
    tree.add(leaveDark);
    tree.add(leaveLight);
    tree.add(stem);

    // Adicionar a árvore à cena
    cena.add(tree);
}

criarArvore({ x: -10, y: 2, z: -7 }, 2);
criarArvore({ x: 7, y: 1, z: -7 }, 2);
criarArvore({ x: -7, y: 0.5, z: -7 }, 2);
criarArvore({ x: 11, y: 2.2, z: -7 }, 2);
criarArvore({ x: 5, y: 3, z: -7 }, 2);
criarArvore({ x: -4.4, y: 3, z: -7 }, 2);
criarArvore({ x: 0, y: 3, z: -7 }, 2);
criarArvore({ x: -10, y: 3, z: 3 }, 2);
criarArvore({ x: -10, y: 3, z: 8 }, 2);
criarArvore({ x: -16, y: 3, z: -10 }, 2);
criarArvore({ x: 10, y: 3, z: 3 }, 2);
criarArvore({ x: -10, y: 2, z: 10 }, 2);
criarArvore({ x: 7, y: 1, z: 10 }, 2);
criarArvore({ x: -7, y: 0.5, z: 10 }, 2);
criarArvore({ x: 11, y: 2.2, z: 10 }, 2);



function carregarNuvens() {
    // Lista de posições onde as rochas serão colocadas
    var posicoes = [
        { x: -5, y: 10, z: 0 },
        { x: -5, y: 10, z: 0.3 },
        { x: -5.3, y: 10, z: 0.2 },
        { x: 5, y: 10.5, z: 0 },
        { x: 5, y: 10.5, z: 0.3 },
        { x: 5.3, y: 10.5, z: 0.2 },
        { x: 2, y: 10, z: -4.5 },
        { x: 2.5, y: 10, z: -5 },
        { x: 15, y: 10, z: -1 },
        { x: -15, y: 10, z: -4 },
        { x: -1, y: 10, z: 0 },
        { x: -10, y: 10, z: 5 },
        { x: -10.2, y: 10, z: 5.1 },
        { x: 10, y: 10, z: 5 },
        { x: 10.2, y: 10, z: 5.1 },
        { x: 10, y: 10, z: 6 },
        { x: 10.5, y: 10, z: 6.1 },
        { x: 10.5, y: 10, z: -6.1 },
        { x: -10, y: 10, z: -5 }, // Posição inferior esquerda do tabuleiro
        { x: 0, y: 10, z: 5 },    // Posição central acima do tabuleiro
        { x: 0, y: 10, z: -5 },   // Posição central abaixo do tabuleiro
        { x: 0, y: 10, z: -10 },  // Posição central abaixo do tabuleiro
        { x: 10, y: 10, z: 0 },   // Posição à direita do tabuleiro
        { x: -10, y: 10, z: 0 },  // Posição à esquerda do tabuleiro
        { x: 10, y: 10, z: 10 },  // Posição superior direita do tabuleiro
        { x: -10, y: 10, z: 10 },
        { x: -8, y: 10, z: 13 },
        { x: -8, y: 10, z: 13.15 },
        { x: -8, y: 10, z: 13.17 },

         // Posição superior esquerda do tabuleiro
        { x: 10, y: 10, z: -10 }, // Posição inferior direita do tabuleiro
        { x: -10, y: 10, z: -10 },
        { x: -10, y: 11, z: -10 },
        { x: 0, y: 10, z: 20 },
        
        
        
    ];


    var nuvem;
    // Para cada posição na lista, carrega uma rocha
    posicoes.forEach(function(posicao) {
        // Carregar o modelo FBX das rochas
        importer.load(
            './Objetos/Nuvem.fbx',
            function (modelo) {
                // Escala as rochas conforme necessário
                modelo.scale.set(0.6, 0.6, 0.6);

                // Posiciona as rochas conforme a posição da lista
                modelo.position.set(posicao.x, posicao.y, posicao.z);

                nuvem=modelo;
                // Adiciona as rochas à cena
                cena.add(modelo);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% carregado');
            },
            function (erro) {
                console.error('Erro ao carregar o modelo FBX das rochas:', erro);
            }
        );
    });
}




const geometry = new THREE.BoxGeometry(1,1,1);

const loader = new THREE.TextureLoader();
const material =[
    new THREE.MeshBasicMaterial({ map: loader.load('Images/Dado/1.jpg')}),
    new THREE.MeshBasicMaterial({ map: loader.load('Images/Dado/2.jpg')}),
    new THREE.MeshBasicMaterial({ map: loader.load('Images/Dado/3.jpg')}),
    new THREE.MeshBasicMaterial({ map: loader.load('Images/Dado/4.jpg')}),
    new THREE.MeshBasicMaterial({ map: loader.load('Images/Dado/5.jpg')}),
    new THREE.MeshBasicMaterial({ map: loader.load('Images/Dado/6.jpg')})
];

const cube = new THREE.Mesh(geometry,material);
cena.add(cube)
cube.position.set(-6.5,1.5,2.5);
cube.scale.set(0.6,0.6,0.6);


const ladosDoDado = 6; // Número de lados do dado
let lancandoDado = false; // Flag para controlar se o dado está sendo lançado
let resultadoDiv; // Referência para o elemento de resultado do dado

document.addEventListener('keydown', function(event) {
    if (event.key === '3') {
        if (!lancandoDado) {
            // Se o dado não estiver sendo lançado, inicia ou para a rotação do dado
            isRotating = !isRotating;
            if (!isRotating) {
                // Se a rotação do dado foi interrompida, mostra o resultado
                mostrarResultado();
            }
        }
    }
});

let isRotating = true; // Variável para controlar se o dado está girando ou não

function animate() {
    requestAnimationFrame(animate);
    
    // Verifica se o dado deve continuar girando
    if (isRotating) {
        cube.rotation.x += 0.4;
        cube.rotation.z += 0.4;
    }
}

animate();


// Função para mostrar o resultado do dado
function mostrarResultado() {
    const numeroAleatorio = Math.floor(Math.random() * ladosDoDado) + 1;
    const resultadoDiv = document.getElementById("resultado");
    if (resultadoDiv) {
        resultadoDiv.textContent = "Resultado: " + numeroAleatorio;
       
    }

 

}



// Declaração das variáveis globais
var cena, luzDoSol, sol, skybox;
var isDia = true; // Variável para controlar se é dia ou noite

// Código para carregar as texturas e criar a skybox
var texture_dir = new THREE.TextureLoader().load('./SkyBox/xpos.png');
var texture_esq = new THREE.TextureLoader().load('./SkyBox/xneg.png');
var texture_up = new THREE.TextureLoader().load('./SkyBox/ypos.png');
var texture_dn = new THREE.TextureLoader().load('./SkyBox/yneg.png');
var texture_bk = new THREE.TextureLoader().load('./SkyBox/zpos.png');
var texture_ft = new THREE.TextureLoader().load('./SkyBox/zneg.png');

var materialArray = [];

materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dir }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_esq }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));

for (var i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;

var skyboxGeo = new THREE.BoxGeometry(100, 100, 100);

skybox = new THREE.Mesh(skyboxGeo, materialArray);

// Adiciona a skybox à cena


// Função para alternar entre dia e noite
var isDia = true; // Initial state is day
var skybox, sol, lua; // Assume these are initialized elsewhere

// Function to toggle between day and night
function alternarDiaNoite() {
    isDia = !isDia; // Toggle the state between day and night

    // Adjust scene settings based on the current state
    if (isDia) {
        cena.background = new THREE.Color(0xc0e6f0); // Set the background to light blue for day
        luzDoSol.intensity = 1; // Set the sunlight intensity for day
        cena.add(sol); // Add the sun to the scene
        cena.remove(lua); // Remove the moon from the scene
    } else {
        cena.background = new THREE.Color(0x000000); // Set the background to black for night
        luzDoSol.intensity = 0; // Turn off the sunlight for night
        cena.remove(sol); // Remove the sun from the scene
        cena.add(lua); // Add the moon to the scene
    }
}

// Add event listener for keydown events
document.addEventListener('keydown', function(event) {
    // Check if the pressed key is '1' or '2'
    if (event.key === '1' || event.key === '2') {
        // Call the function to toggle between day and night
        alternarDiaNoite();
    }
});

const velocidadeMovimento = 1;

// Adicionar um event listener para o evento keydown no documento
document.addEventListener('keydown', onKeyDown, false);

function onKeyDown(event) {
    // Verificar qual tecla foi pressionada
    switch(event.key) {
        case 'ArrowRight':
            if(peao.position.x < 4.5)
            // Mover para a direita ao longo do eixo x
            peao.position.x += velocidadeMovimento;
            break;
        case 'ArrowLeft':
            if(peao.position.x > -4.5){
            // Mover para a esquerda ao longo do eixo x
            peao.position.x -= velocidadeMovimento;
            }
            else if (peao.position.x === -4.5 && peao.position.z === 3.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, 2.5);
            } 
            else if (peao.position.x === -4.5 && peao.position.z === 4.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, 3.5);
            } 
            else if (peao.position.x === -4.5 && peao.position.z === 2.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, 1.5);
            } 
            else if (peao.position.x === -4.5 && peao.position.z === 1.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, 0.5);
            } 
            else if (peao.position.x === -4.5 && peao.position.z === 0.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, -0.5);
            } 
            else if (peao.position.x === -4.5 && peao.position.z === -0.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, -1.5);
            } 
            else if (peao.position.x === -4.5 && peao.position.z === -1.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, -2.5);
            } 
            else if (peao.position.x === -4.5 && peao.position.z === -2.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, -3.5);
            } 
            else if (peao.position.x === -4.5 && peao.position.z === -3.5) {
                // Mover o peão para a nova posição
                peao.position.set(4.5, 0.5, -4.5);
            } 
            break;
        /*case 'ArrowUp':
            // Mover para cima ao longo do eixo y
            if(peao.position.z > -4.5){
                peao.position.z -= velocidadeMovimento;

            }
            else if (peao.position.x === -4.5 && peao.position.z === 3.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, 2.5);
                } 
                else if (peao.position.x === -4.5 && peao.position.z === 4.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, 3.5);
                } 
                else if (peao.position.x === -4.5 && peao.position.z === 2.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, 1.5);
                } 
                else if (peao.position.x === -4.5 && peao.position.z === 1.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, 0.5);
                } 
                else if (peao.position.x === -4.5 && peao.position.z === 0.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, -0.5);
                } 
                else if (peao.position.x === -4.5 && peao.position.z === -0.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, -1.5);
                } 
                else if (peao.position.x === -4.5 && peao.position.z === -1.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, -2.5);
                } 
                else if (peao.position.x === -4.5 && peao.position.z === -2.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, -3.5);
                } 
                else if (peao.position.x === -4.5 && peao.position.z === -3.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(4.5, 0.5, -4.5);
                } 
            break;
        case 'ArrowDown':
            if(peao.position.z < 4.5)
            // Mover para baixo ao longo do eixo y
            peao.position.z += velocidadeMovimento;
            break;
*/
            case 'Enter':
            // Verificar se o peão está na posição especificada
            if (peao.position.x === 3.5 && peao.position.z === 3.5) {
                // Mover o peão para a nova posição
                peao.position.set(2.5, 0.5, 0.5);
            }
            else if (peao.position.x === -3.5 && peao.position.z === 3.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(-2.5, 0.5, 2.5);
                }
            else if (peao.position.x === -4.5 && peao.position.z === 0.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(-1.5, 0.5, -3.5);
            }
            else if (peao.position.x === 0.5 && peao.position.z === -3.5) {
                // Mover o peão para a nova posição
                peao.position.set(0.5, 0.5, -2.5);
            }

            else if (peao.position.x === 3.5 && peao.position.z === -2.5) {
                    // Mover o peão para a nova posição
                    peao.position.set(3.5, 0.5, -0.5);
            }

            else if (peao.position.x === 0.5 && peao.position.z === 1.5) {
                // Mover o peão para a nova posição
                peao.position.set(0.5, 0.5, 3.5);
        }

        else if (peao.position.x === -1.5 && peao.position.z === 0.5) {
            // Mover o peão para a nova posição
            peao.position.set(-2.5, 0.5, 1.5);
    }
        
            
            break;
           
    }
}
var peao;
importer.load( './Objetos/peao.fbx', function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Ajuste a cor do material aqui
            var material = new THREE.MeshStandardMaterial({
                color : 0x0000ff,
                roughness: 0.75, // Rugosidade
                metalness: 0.25 // Metalização
               
            });
            child.material = material;
        }
    });

    peao=object;
    cena.add(object);

    object.scale.set(0.01, 0.01, 0.01); // Ajuste a escala conforme necessário
    object.position.set(5.5, 0.5, 4.5); // Ajuste a posição conforme necessário
    //object.rotation.set(0, Math.PI /15, 0); // Ajuste a rotação conforme necessário
    //object.position.set(-4.5, 0.5,3.5); // Ajuste a posição conforme necessário

});
// Definir as dimensões da cena
const larguraCena = window.innerWidth;
const alturaCena = window.innerHeight;

// Criar uma nova câmera ortográfica de cima
const cameraSuperior = new THREE.OrthographicCamera(
    larguraCena / -2, // left
    larguraCena / 2,  // right
    alturaCena / 2,   // top
    alturaCena / -2,  // bottom
    1,                // near
    1000              // far
);
cameraSuperior.position.set(0, 200, 0); // Posiciona a câmera acima da cena

// Função para alternar entre as câmeras
function alternarCamera() {
    cena.remove(cameraPerspetiva); // Remove a câmera perspectiva
    cena.add(cameraSuperior);       // Adiciona a câmera superior à cena
    renderer.render(cena, cameraSuperior); // Renderiza a cena com a nova câmera
}

// Crie o botão para alternar para a câmera superior
var botaoJogar = document.createElement('button');
botaoJogar.style.position = 'absolute';
botaoJogar.style.bottom = '20px'; // Mude para o fundo da tela
botaoJogar.style.left = '50%';    // Centralize horizontalmente
botaoJogar.style.transform = 'translateX(-50%)'; // Centralize horizontalmente
botaoJogar.style.padding = '10px 20px';
botaoJogar.style.color = 'white';
botaoJogar.style.backgroundColor = 'blue';
botaoJogar.style.border = 'none';
botaoJogar.innerHTML = 'Jogar';
botaoJogar.addEventListener('click', alternarCamera);
document.body.appendChild(botaoJogar);

//Crie o botão para alternar entre dia e noite
/*var botaoJogar = document.createElement('button');
botaoJogar.style.position = 'absolute';
botaoJogar.style.top = '20px';
botaoJogar.style.left = '20px';
botaoJogar.style.padding = '10px 20px';
botaoJogar.style.color = 'white';
botaoJogar.style.backgroundColor = 'blue';
botaoJogar.style.border = 'none';
botaoJogar.innerHTML = 'Jogar';
botaoJogar.addEventListener('click', alterarCamera);
document.body.appendChild(botaoJogar);
*/
// Criando um botão HTML



function Start(){
    // Configurar PointerLockControls
    controls = new PointerLockControls(cameraPerspetiva, renderer.domElement);

    // Adiciona o PointerLockControls à cena
    cena.add(controls.getObject());

    // Cria o menu inicial
    mostrarMenuInicial();

    // Criação de um foco de luz com a cor branca (#ffffff) e intensidade a 1 (intensidade normal).
    var focoLuz = new THREE.SpotLight(0xffffff, 2); // Cor branca, intensidade 1

    // Mudar a posição da luz para ficar 5 unidades acima da câmera e 10 unidades para a frente
    focoLuz.position.set(-80, 0, 80);

    // Dizemos a light para ficar a apontar para a posição do centro do tabuleiro.
    focoLuz.target.position.set(0, 0, 10); // Define o alvo da luz para o centro do tabuleiro
    cena.add(focoLuz.target); // Adiciona o alvo da luz à cena
    focoLuz.target.updateMatrixWorld(); // Atualiza a posição do alvo no mundo

    // Adicionamos a luz à cena
    cena.add(focoLuz);

    // Posicionar a câmara
    cameraPerspetiva.position.set(0, 10, 12); // Ajuste a posição da câmera para que o tabuleiro seja centralizado e tenha uma visão mais ampla

    // Definir a direção para a câmara olhar
    cameraPerspetiva.lookAt(0, 0, 0);

    // Renderizar a cena
    renderer.render(cena, cameraPerspetiva);

    // Criar árvores ao iniciar o jogo
    criarTabuleiro();
    criarRelva();
    


    carregarNuvens();

    // Adicionar eventos de teclado para movimentar a câmera
    document.addEventListener('keydown', onDocumentKeyDown);
    document.addEventListener('keyup', onDocumentKeyUp);

    // Iniciar o loop de animação
    loop();
}

function iniciarJogo() {
    // Remover o menu inicial
    var menuInicial = document.getElementById('menu-inicial');
    menuInicial.remove();

    // Ativar o bloqueio do cursor para permitir a exploração da cena
    controls.lock();
}

function mostrarMenuInicial() {
    // Criar o contêiner do menu inicial
    var menuInicialContainer = document.createElement('div');
    menuInicialContainer.id = 'menu-inicial';
    menuInicialContainer.style.position = 'absolute';
    menuInicialContainer.style.width = '100%';
    menuInicialContainer.style.height = '100%';
    menuInicialContainer.style.display = 'flex';
    menuInicialContainer.style.flexDirection = 'column';
    menuInicialContainer.style.justifyContent = 'center'; // Centraliza verticalmente
    menuInicialContainer.style.alignItems = 'center'; // Centraliza horizontalmente
    menuInicialContainer.style.backgroundColor = 'black';
    menuInicialContainer.style.top = '0'; // Posiciona o menu no topo da janela
    document.body.appendChild(menuInicialContainer);

    // Criar texto de boas-vindas
    var textoBoasVindas = document.createElement('div');
    textoBoasVindas.style.color = 'white'; // Define a cor do texto como branco
    textoBoasVindas.innerHTML = '<h1>Bem-vindo ao Jogo de Cobras e Escadas</h1><p>Pressione iniciar para começar</p>';
    menuInicialContainer.appendChild(textoBoasVindas);

    // Adicionar um botão de iniciar jogo
    var botaoIniciar = document.createElement('button');
    botaoIniciar.style.padding = '10px 20px';
    botaoIniciar.style.color = 'white';
    botaoIniciar.style.backgroundColor = 'blue';
    botaoIniciar.style.border = 'none';
    botaoIniciar.innerHTML = 'Iniciar';
    botaoIniciar.addEventListener('click', iniciarJogo);
    menuInicialContainer.appendChild(botaoIniciar);
}
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

function onDocumentKeyDown(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: // W
            moveForward = true;
            break;
        case 83: // S
            moveBackward = true;
            break;
        case 65: // A
            moveLeft = true;
            break;
        case 68: // D
            moveRight = true;
            break;
    }
}

function onDocumentKeyUp(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 87: // W
            moveForward = false;
            break;
        case 83: // S
            moveBackward = false;
            break;
        case 65: // A
            moveLeft = false;
            break;
        case 68: // D
            moveRight = false;
            break;
    }
}

function loop(){
    if (moveForward) controls.moveForward(0.1);
    if (moveBackward) controls.moveForward(-0.1);
    if (moveLeft) controls.moveRight(-0.1);
    if (moveRight) controls.moveRight(0.1);

    renderer.render(cena, cameraPerspetiva);

    requestAnimationFrame(loop);
}