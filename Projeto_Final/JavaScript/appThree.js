// Importação da biblioteca ThreeJS baseada no importmap
import * as THREE from 'three';

// Importação da biblioteca que nos permite explorar a nossa cena através do importmap
import { PointerLockControls } from 'PointerLockControls';

// Importação da biblioteca que nos permite importar objetos 3D em formato FBX baseada no importmap
import { FBXLoader } from 'FBXLoader';


document.addEventListener("DOMContentLoaded", Start);

const fileUrl= new URL('./objetos/Wolf.gltf', import.meta.url);
var cena = new THREE.Scene();
var camaraPerspetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
var renderer = new THREE.WebGLRenderer();

//let fogosArtificio = [];

var aspect = window.innerWidth / window.innerHeight;

var camaraOrtog = new THREE.OrthographicCamera(
    -aspect * 10, aspect * 10, // left, right
    10, -10, // top, bottom
    0.1 , 100// near, far
);


// Posição inicial da câmera ortográfica
camaraOrtog.position.set(0, 5, 5);
camaraOrtog.lookAt(0, 0, 0);
camaraOrtog.zoom=2;
camaraOrtog.updateProjectionMatrix(); // Necessário para aplicar o zoom

var cameraAtiva = camaraPerspetiva;

 // Criação de um foco de luz com a cor branca (#ffffff) e intensidade a 1 (intensidade normal).
 var focoLuz = new THREE.SpotLight(0xffffff, 2); // Cor branca, intensidade 1

 // Mudar a posição da luz para ficar 5 unidades acima da câmera e 10 unidades para a frente
 focoLuz.position.set(-50, 10, 50);
 cena.add(focoLuz);
 // Dizemos a light para ficar a apontar para a posição do centro do tabuleiro.
 focoLuz.target.position.set(0, 0, 0); // Define o alvo da luz para o centro do tabuleiro
 cena.add(focoLuz.target); // Adiciona o alvo da luz à cena
 focoLuz.target.updateMatrixWorld(); // Atualiza a posição do alvo no mundo



renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);
renderer.setClearColor(0xc0e6f0);
renderer.shadowMap.enabled =true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

document.body.appendChild(renderer.domElement);

// Variável que guardará o objeto importado
var objetoImportado;

// Variável que irá guardar o controlador de animações do objeto importado
var mixerAnimacao;

// Variável que é responsável por controlar o tempo da aplicação
var relogio = new THREE.Clock();

// Variável com o objeto responsável por importar ficheiros FBX
var importer = new FBXLoader();

var controls;

// Função para criar o tabuleiro

document.addEventListener('keydown', function(event) {
    if (event.key === 'C' || event.key === 'c') {
        // Alternar entre câmera perspectiva e ortográfica
        if (cameraAtiva === camaraPerspetiva) {
            cameraAtiva = camaraOrtog;
        } else {
            cameraAtiva = camaraPerspetiva;
        }
    }
});



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
    tabuleiro.receiveShadow=true;
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


/*function criarRelva() {
    const tamanhoRelva = 100; // Tamanho do plano da relva
    const texturaRelva = new THREE.TextureLoader().load('Images/relva.png');
    const materialRelva = new THREE.MeshStandardMaterial({ map: texturaRelva });
    const geometriaRelva = new THREE.PlaneGeometry(tamanhoRelva, tamanhoRelva);
    const relva = new THREE.Mesh(geometriaRelva, materialRelva);
    relva.rotation.x = -Math.PI / 2; // Rotaciona para que o plano fique paralelo ao chão
    relva.position.y = -1; // Posiciona abaixo do tabuleiro
    relva.receiveShadow= true;
    cena.add(relva);
}*/

function criarRelva() {
    const tamanhoRelva = 100; // Tamanho do plano da relva
    const subdivisoes = 50; // Novo: número de subdivisões no plano

    // Carregar a textura da relva
    const texturaRelva = new THREE.TextureLoader().load('Images/relva.png', function(texture) {
        texture.wrapS = THREE.RepeatWrapping; // Permitir repetição horizontal
        texture.wrapT = THREE.RepeatWrapping; // Permitir repetição vertical
        const repeatFactor = 10; // Defina quantas vezes a textura deve se repetir
        texture.repeat.set(repeatFactor, repeatFactor);
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
    });

    // Criar material com a textura da relva
    const materialRelva = new THREE.MeshStandardMaterial({ map: texturaRelva });

    // Criar geometria do plano com subdivisões extras
    const geometriaRelva = new THREE.PlaneGeometry(tamanhoRelva, tamanhoRelva, subdivisoes, subdivisoes);

    // Criar o mesh da relva
    const relva = new THREE.Mesh(geometriaRelva, materialRelva);

    // Rotacionar e posicionar o plano da relva
    relva.rotation.x = -Math.PI / 2; // Rotaciona para que o plano fique paralelo ao chão
    relva.position.y = -1; // Posiciona abaixo do tabuleiro
    relva.receiveShadow= true;

    // Adicionar a relva à cena
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
    luzDoSol = new THREE.DirectionalLight(0xffffff, 1, 200); // Cor branca, intensidade 1, alcance 100
    luzDoSol.position.copy(object.position); // Posição da luz igual à posição do sol
    luzDoSol.castShadow=true;
    luzDoSol.shadow.camera.near = 0.5;
    luzDoSol.shadow.camera.far = 500;
    luzDoSol.shadow.camera.left = -50;
    luzDoSol.shadow.camera.right = 50;
    luzDoSol.shadow.camera.top = 50;
    luzDoSol.shadow.camera.bottom = -50;
    luzDoSol.shadow.mapSize.width = 1024; // Tamanho do mapa de sombra
    luzDoSol.shadow.mapSize.height = 1024;
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
    luzDaLua = new THREE.PointLight(0xffffff, 0, 100); // Cor branca, intensidade 1, alcance 100
    luzDaLua.position.copy(object.position); // Posição da luz igual à posição do lua
    luzDaLua.castShadow=true;

    luzDaLua.shadow.camera.near = 0.5;
    luzDaLua.shadow.camera.far = 500;
    luzDaLua.shadow.camera.left = -50;
    luzDaLua.shadow.camera.right = 50;
    luzDaLua.shadow.camera.top = 50;
    luzDaLua.shadow.camera.bottom = -50;
    luzDaLua.shadow.mapSize.width = 1024; // Tamanho do mapa de sombra
    luzDaLua.shadow.mapSize.height = 1024;
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
    object.position.set(1, 0.5, -3); // Ajuste a posição conforme necessário
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

var cobra4;

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

    cobra4 = object;
});

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
            child.castShadow = true; // Configurar para lançar sombras
            child.receiveShadow = true; 
        }
    });

    peao=object;
    cena.add(object);

    object.scale.set(0.01, 0.01, 0.01); // Ajuste a escala conforme necessário
    object.position.set(5.5, 0.5, 4.5); // Ajuste a posição conforme necessário
    //object.rotation.set(0, Math.PI /15, 0); // Ajuste a rotação conforme necessário
    //object.position.set(-4.5, 0.5,3.5); // Ajuste a posição conforme necessário
    
});

// Crie um carregador para FBX
var cavalo;

importer.load('./Objetos/Horse.fbx', function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Ajuste a cor do material para cada segmento
            if (child.name === 'Cylinder') {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0x654321, // Marrom para segmento 1
                    roughness: 0.75, 
                    metalness: 0.25 
                });
            }
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    burro = object;
    cena.add(object);
    console.log(cavalo);
    object.scale.set(0.01, 0.01, 0.01); // Ajuste a escala conforme necessário
    object.position.set(0, 0.5, 4.5); // Ajuste a posição conforme necessário
});

// Configurar a cena, câmera e renderizador aqui


function criarEscadote1() {
    var materialDegrau = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Cor marrom para os degraus
    var materialSuporte = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Cor cinza para os suportes

    // Criar os suportes laterais
    var suporteEsquerdo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3, 32), materialSuporte);
    suporteEsquerdo.position.set(2.7,0.20,2);
    suporteEsquerdo.rotation.set(Math.PI /2, 0, -0.4); // Rotaciona o suporte para ficar paralelo ao chão

    var suporteDireito = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3, 32), materialSuporte);
    suporteDireito.position.set(3.25,0.17,2);
    suporteDireito.rotation.set(Math.PI / 2, 0, -0.4); // Rotaciona o suporte para ficar paralelo ao chão

    // Definir os degraus
    var degrau1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau1.rotation.set(Math.PI / 3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau1.position.set(2.58,0.17,1);

    var degrau2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau2.rotation.set(Math.PI / 3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau2.position.set(2.85, 0.17, 1.6);

    var degrau3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau3.rotation.set(Math.PI / 3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau3.position.set(3.09,0.17,2.2);

    var degrau4 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau4.rotation.set(Math.PI / 3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau4.position.set(3.32,0.17,2.8);

    var ladder = new THREE.Group();
    ladder.add(suporteEsquerdo);
    ladder.add(suporteDireito);
    ladder.add(degrau1);
    ladder.add(degrau2);
    ladder.add(degrau3);
    ladder.add(degrau4);

    cena.add(ladder);

}

function criarCerca() {
    var materialPoste = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Cor marrom para os postes
    var coresRipa = [0x8B4513, 0x8B4513, 0x8B4513]; // Cores para as ripas: marrom

    var larguraTabuleiro = 10; // Ajuste de acordo com o tamanho do seu tabuleiro
    var alturaTabuleiro = 10;

    var alturaCerca = 0.75; // Altura da cerca ajustada
    var espessuraPoste = 0.1; // Espessura dos postes
    var espessuraRipa = 0.1; // Espessura das ripas

    var deslocamento = 0.5; // Ajuste de deslocamento para que a cerca fique fora do tabuleiro

    var cerca = new THREE.Group();

    // Função para criar um poste
    function criarPoste(x, z) {
        var poste = new THREE.Mesh(new THREE.CylinderGeometry(espessuraPoste, espessuraPoste, alturaCerca, 32), materialPoste);
        poste.position.set(x, alturaCerca / 2, z);
        cerca.add(poste);
    }

    // Função para criar uma ripa vertical colorida
    function criarRipaVertical(x, z, cor) {
        var materialRipa = new THREE.MeshLambertMaterial({ color: cor });
        var ripa = new THREE.Mesh(new THREE.BoxGeometry(espessuraRipa, alturaCerca, espessuraRipa), materialRipa);
        ripa.position.set(x, alturaCerca / 2, z);
        cerca.add(ripa);
    }

    // Função para criar uma ripa horizontal
    function criarRipaHorizontal(x1, z1, x2, z2) {
        var comprimento = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
        var ripa = new THREE.Mesh(new THREE.BoxGeometry(comprimento, espessuraRipa, espessuraRipa), materialPoste);
        ripa.position.set((x1 + x2) / 2, alturaCerca - espessuraRipa / 2, (z1 + z2) / 2);
        ripa.rotation.y = Math.atan2(z2 - z1, x2 - x1);
        cerca.add(ripa);
    }

    // Criar postes nos cantos do tabuleiro com deslocamento para fora
    criarPoste(-larguraTabuleiro / 2 - deslocamento, -alturaTabuleiro / 2 - deslocamento);
    criarPoste(larguraTabuleiro / 2 + deslocamento, -alturaTabuleiro / 2 - deslocamento);
    criarPoste(-larguraTabuleiro / 2 - deslocamento, alturaTabuleiro / 2 + deslocamento);
    criarPoste(larguraTabuleiro / 2 + deslocamento, alturaTabuleiro / 2 + deslocamento);

    // Criar postes adicionais ao longo dos lados com deslocamento para fora
    for (var i = -larguraTabuleiro / 2 + 1 - deslocamento; i < larguraTabuleiro / 2 + deslocamento; i++) {
        criarPoste(i, -alturaTabuleiro / 2 - deslocamento);
        criarPoste(i, alturaTabuleiro / 2 + deslocamento);
    }
    for (var j = -alturaTabuleiro / 2 + 1 - deslocamento; j < alturaTabuleiro / 2 + deslocamento; j++) {
        criarPoste(-larguraTabuleiro / 2 - deslocamento, j);
        criarPoste(larguraTabuleiro / 2 + deslocamento, j);
    }

    // Criar ripas horizontais superiores e inferiores com deslocamento para fora
    criarRipaHorizontal(-larguraTabuleiro / 2 - deslocamento, -alturaTabuleiro / 2 - deslocamento, larguraTabuleiro / 2 + deslocamento, -alturaTabuleiro / 2 - deslocamento);
    criarRipaHorizontal(-larguraTabuleiro / 2 - deslocamento, alturaTabuleiro / 2 + deslocamento, larguraTabuleiro / 2 + deslocamento, alturaTabuleiro / 2 + deslocamento);
    criarRipaHorizontal(-larguraTabuleiro / 2 - deslocamento, -alturaTabuleiro / 2 - deslocamento, -larguraTabuleiro / 2 - deslocamento, alturaTabuleiro / 2 + deslocamento);
    criarRipaHorizontal(larguraTabuleiro / 2 + deslocamento, -alturaTabuleiro / 2 - deslocamento, larguraTabuleiro / 2 + deslocamento, alturaTabuleiro / 2 + deslocamento);

    // Criar ripas verticais coloridas ao longo dos lados, exceto na entrada
    var posicaoPeao = 0; // Ajuste esta variável para a posição do peão
    for (var k = -larguraTabuleiro / 2 + 0.5 - deslocamento; k < larguraTabuleiro / 2 + deslocamento; k += 0.5) {
        if (k < posicaoPeao - 0.5 || k > posicaoPeao + 0.5) { // Deixar espaço para a entrada na posição do peão
            var corRipa = coresRipa[Math.floor(Math.random() * coresRipa.length)];
            criarRipaVertical(k, alturaTabuleiro / 2 + deslocamento, corRipa);
        }
    }

    cena.add(cerca);
}

criarCerca();


// Chamada da função para criar um escadote
criarEscadote1(); 

function criarEscadote2() {
    var materialDegrau = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Cor marrom para os degraus
    var materialSuporte = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Cor cinza para os suportes

    // Criar os suportes laterais
    var suporteEsquerdo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 32), materialSuporte);
    suporteEsquerdo.position.set(-3.2,0.17,3);
    suporteEsquerdo.rotation.set(Math.PI / 2, 0, 0.5); // Rotaciona o suporte para ficar paralelo ao chão

    var suporteDireito = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 32), materialSuporte);
    suporteDireito.position.set(-2.7,0.17,3.2);
    suporteDireito.rotation.set(Math.PI / 2, 0, 0.5); // Rotaciona o suporte para ficar paralelo ao chão

    // Definir os degraus
    var degrau1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau1.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau1.position.set(-3.12,0.17,3.4);

    var degrau2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau2.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau2.position.set(-2.8, 0.17, 2.9);

    var ladder = new THREE.Group();
    ladder.add(suporteEsquerdo);
    ladder.add(suporteDireito);
    ladder.add(degrau1);
    ladder.add(degrau2);

    cena.add(ladder);
}

// Chamada da função para criar um escadote
criarEscadote2(); // Posição, altura e largura do escadote

function criarEscadote3() {
    var materialDegrau = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Cor marrom para os degraus
    var materialSuporte = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Cor cinza para os suportes

    // Criar os suportes laterais
    var suporteDireito = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.5, 32), materialSuporte);
    suporteDireito.position.set(-2.785,0.17,-1.4);
    suporteDireito.rotation.set(Math.PI/2, 0, 0.6); // Rotaciona o suporte para ficar paralelo ao chão

    var suporteEsquerdo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.5, 32), materialSuporte);
    suporteEsquerdo.position.set(-3.25,0.17,-1.7);
    suporteEsquerdo.rotation.set(Math.PI / 2, 0, 0.6); // Rotaciona o suporte para ficar paralelo ao chão

    // Definir os degraus
    var degrau1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau1.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau1.position.set(-1.9,0.17,-3.15);

    var degrau2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau2.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau2.position.set(-2.3, 0.17, -2.55);

    var degrau3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau3.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau3.position.set(-2.7, 0.17, -1.95);

    var degrau4 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau4.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau4.position.set(-3.15, 0.17, -1.35);

    var degrau5 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau5.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau5.position.set(-3.55, 0.17, -0.75);
   
    var degrau6 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32), materialDegrau);
    degrau6.rotation.set(Math.PI / -3, 0, 1); // Rotaciona o degrau para que fique paralelo ao chão
    degrau6.position.set(-3.95, 0.17, -0.15);

   var ladder = new THREE.Group();
    ladder.add(suporteEsquerdo);
    ladder.add(suporteDireito);
    ladder.add(degrau1);
    ladder.add(degrau2);
    ladder.add(degrau3);
    ladder.add(degrau4);
    ladder.add(degrau5);
    ladder.add(degrau6);

    cena.add(ladder);
}

// Chamada da função para criar um escadote
criarEscadote3();


// Função para criar uma árvore com maçãs ao redor das folhas
/*function criarArvore(posicao, escala) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var leaveDarkMaterial = new THREE.MeshStandardMaterial({ color: 0x91E56E });
    var leaveLightMaterial = new THREE.MeshStandardMaterial({ color: 0xA2FF7A });
    var stemMaterial = new THREE.MeshStandardMaterial({ color: 0x7D5A4F });

    // Criar o tronco da árvore
    var stemGeometry = new THREE.CylinderGeometry(0.15* escala, 0.15 * escala, 2.7 * escala, 32);
    var stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(posicao.x, posicao.y + 0.75 * escala, posicao.z);
    stem.castShadow=true;
    stem.receiveShadow=true;
    // Criar as folhas da árvore
    var squareLeave01 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave01.position.set(posicao.x + 0.5 * escala, posicao.y + 1.6 * escala, posicao.z + 0.5 * escala);
    squareLeave01.scale.set(0.8 * escala, 0.8 * escala, 0.8 * escala);
    squareLeave01.castShadow=true;
    squareLeave01.receiveShadow=true;

    var squareLeave02 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave02.position.set(posicao.x - 0.4 * escala, posicao.y + 1.3 * escala, posicao.z - 0.4 * escala);
    squareLeave02.scale.set(0.7 * escala, 0.7 * escala, 0.7 * escala);
    squareLeave02.castShadow=true;
    squareLeave02.receiveShadow=true

    var squareLeave03 = new THREE.Mesh(geometry, leaveDarkMaterial);
    squareLeave03.position.set(posicao.x + 0.4 * escala, posicao.y + 1.7 * escala, posicao.z - 0.5 * escala);
    squareLeave03.scale.set(0.7 * escala, 0.7 * escala, 0.7 * escala);
    squareLeave03.castShadow=true;
    squareLeave03.receiveShadow=true

    var leaveDark = new THREE.Mesh(geometry, leaveDarkMaterial);
    leaveDark.position.set(posicao.x, posicao.y + 1.2 * escala, posicao.z);
    leaveDark.scale.set(1 * escala, 2 * escala, 1 * escala);
    leaveDark.castShadow = true; // Configurar para projetar sombras
    leaveDark.receiveShadow = true;

    var leaveLight = new THREE.Mesh(geometry, leaveLightMaterial);
    leaveLight.position.set(posicao.x, posicao.y + 1.2 * escala, posicao.z);
    leaveLight.scale.set(1.1 * escala, 0.5 * escala, 1.1 * escala);
    leaveLight.castShadow = true; // Configurar para projetar sombras
    leaveLight.receiveShadow = true;

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

    tree.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}*/

function criarArvore(posicao, escala) {
    var loader = new THREE.TextureLoader();

    // Carregar texturas
    var barkTexture = loader.load('./Images/tronco.jpg'); // Substitua com o caminho para a sua textura de tronco
    var leavesTexture = loader.load('./Images/folhas.jpg'); // Substitua com o caminho para a sua textura de folhas

    // Criar materiais com texturas
    var stemMaterial = new THREE.MeshStandardMaterial({ map: barkTexture });
    var leaveMaterial = new THREE.MeshStandardMaterial({ map: leavesTexture });

    // Criar o tronco da árvore
    var stemGeometry = new THREE.CylinderGeometry(0.15 * escala, 0.15 * escala, 2.7 * escala, 32);
    var stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(posicao.x, posicao.y + 0.75 * escala, posicao.z);
    stem.castShadow = true;
    stem.receiveShadow = true;

    // Criar as folhas da árvore
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    var squareLeave01 = new THREE.Mesh(geometry, leaveMaterial);
    squareLeave01.position.set(posicao.x + 0.5 * escala, posicao.y + 1.6 * escala, posicao.z + 0.5 * escala);
    squareLeave01.scale.set(0.8 * escala, 0.8 * escala, 0.8 * escala);
    squareLeave01.castShadow = true;
    squareLeave01.receiveShadow = true;

    var squareLeave02 = new THREE.Mesh(geometry, leaveMaterial);
    squareLeave02.position.set(posicao.x - 0.4 * escala, posicao.y + 1.3 * escala, posicao.z - 0.4 * escala);
    squareLeave02.scale.set(0.7 * escala, 0.7 * escala, 0.7 * escala);
    squareLeave02.castShadow = true;
    squareLeave02.receiveShadow = true;

    var squareLeave03 = new THREE.Mesh(geometry, leaveMaterial);
    squareLeave03.position.set(posicao.x + 0.4 * escala, posicao.y + 1.7 * escala, posicao.z - 0.5 * escala);
    squareLeave03.scale.set(0.7 * escala, 0.7 * escala, 0.7 * escala);
    squareLeave03.castShadow = true;
    squareLeave03.receiveShadow = true;

    var leaveDark = new THREE.Mesh(geometry, leaveMaterial);
    leaveDark.position.set(posicao.x, posicao.y + 1.2 * escala, posicao.z);
    leaveDark.scale.set(1 * escala, 2 * escala, 1 * escala);
    leaveDark.castShadow = true;
    leaveDark.receiveShadow = true;

    var leaveLight = new THREE.Mesh(geometry, leaveMaterial);
    leaveLight.position.set(posicao.x, posicao.y + 1.2 * escala, posicao.z);
    leaveLight.scale.set(1.1 * escala, 0.5 * escala, 1.1 * escala);
    leaveLight.castShadow = true;
    leaveLight.receiveShadow = true;

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

    tree.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}


/*criarArvore({ x: -10, y: 0.5, z: -7 }, 2);
criarArvore({ x: 7, y: 0.5, z: -7 }, 2);
criarArvore({ x: -7, y: 0.5, z: -7 }, 2);
criarArvore({ x: 11, y: 0.5, z: -7 }, 2);
criarArvore({ x: 5, y: 0.5, z: -7 }, 2);
criarArvore({ x: -4.4, y: 0.5, z: -7 }, 2);
criarArvore({ x: 0, y: 0.5, z: -7 }, 2);
criarArvore({ x: -10, y: 0.5, z: 3 }, 2);
criarArvore({ x: -10, y: 0.5, z: 8 }, 2);
criarArvore({ x: -16, y: 0.5, z: -10 }, 2);
criarArvore({ x: 10, y: 0.5, z: 3 }, 2);
criarArvore({ x: -10, y: 0.5, z: 10 }, 2);
criarArvore({ x: 7, y: 0.5, z: 10 }, 2);
criarArvore({ x: -7, y: 0.5, z: 10 }, 2);
criarArvore({ x: 11, y: 0.5, z: 10 }, 2);*/

/*criarArvore({ x: -18, y: 0.5, z: -14 }, 2);
criarArvore({ x: 14, y: 0.5, z: -14 }, 2);
criarArvore({ x: -14, y: 0.5, z: -14 }, 2);
criarArvore({ x: 20, y: 0.5, z: -14 }, 2);
criarArvore({ x: 10, y: 0.5, z: -14 }, 2);
criarArvore({ x: -8.8, y: 0.5, z: -14 }, 2);
criarArvore({ x: 0, y: 0.5, z: -14 }, 2);
criarArvore({ x: -18, y: 0.5, z: 6 }, 2);
criarArvore({ x: -18, y: 0.5, z: 16 }, 2);
criarArvore({ x: -30, y: 0.5, z: -20 }, 2);
criarArvore({ x: 18, y: 0.5, z: 6 }, 2);
criarArvore({ x: -18, y: 0.5, z: 20 }, 2);
criarArvore({ x: 14, y: 0.5, z: 20 }, 2);
criarArvore({ x: -14, y: 0.5, z: 20 }, 2);
criarArvore({ x: 22, y: 0.5, z: 20 }, 2);*/

criarArvore({ x: -20, y: 0.5, z: -20 }, 2);
criarArvore({ x: 20, y: 0.5, z: -20 }, 2);
criarArvore({ x: -20, y: 0.5, z: 20 }, 2);
criarArvore({ x: 20, y: 0.5, z: 20 }, 2);
criarArvore({ x: 0, y: 0.5, z: -25 }, 2);
criarArvore({ x: 25, y: 0.5, z: 0 }, 2);
criarArvore({ x: -25, y: 0.5, z: 0 }, 2);
criarArvore({ x: 0, y: 0.5, z: 25 }, 2);
criarArvore({ x: -30, y: 0.5, z: -30 }, 2);
criarArvore({ x: 30, y: 0.5, z: -30 }, 2);
criarArvore({ x: -30, y: 0.5, z: 30 }, 2);
criarArvore({ x: 30, y: 0.5, z: 30 }, 2);
criarArvore({ x: -35, y: 0.5, z: -10 }, 2);
criarArvore({ x: 35, y: 0.5, z: 10 }, 2);
criarArvore({ x: -10, y: 0.5, z: 35 }, 2);
criarArvore({ x: 10, y: 0.5, z: -35 }, 2);
criarArvore({ x: -15, y: 0.5, z: 25 }, 2);
criarArvore({ x: 15, y: 0.5, z: -25 }, 2);
criarArvore({ x: -25, y: 0.5, z: 15 }, 2);
criarArvore({ x: 25, y: 0.5, z: -15 }, 2);
criarArvore({ x: 35, y: 0.5, z: 5 }, 2);
criarArvore({ x: -35, y: 0.5, z: -5 }, 2);
criarArvore({ x: 5, y: 0.5, z: 35 }, 2);
criarArvore({ x: -5, y: 0.5, z: -35 }, 2);


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
        
        );
    });
}

/*const geometry = new THREE.BoxGeometry(1,1,1);

const loader = new THREE.TextureLoader();
const material =[
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/1.jpg')}),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/2.jpg')}),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/3.jpg')}),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/4.jpg')}),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/5.jpg')}),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/6.jpg')})
];

const cube = new THREE.Mesh(geometry,material);
cena.add(cube)
cube.receiveShadow=true;
cube.castShadow=true;
cube.position.set(-6.5,1.5,2.5);
cube.rotation.set(0,0,0);
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

}*/
const geometry = new THREE.BoxGeometry(1, 1, 1);

const loader = new THREE.TextureLoader();
const material = [
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/1.jpg') }),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/2.jpg') }),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/3.jpg') }),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/4.jpg') }),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/5.jpg') }),
    new THREE.MeshStandardMaterial({ map: loader.load('Images/Dado/6.jpg') })
];

const cube = new THREE.Mesh(geometry, material);
cena.add(cube);
cube.receiveShadow = true;
cube.castShadow = true;
cube.position.set(-6.5, 1.5, 2.5);
cube.scale.set(0.6, 0.6, 0.6);

const ladosDoDado = 6; // Número de lados do dado
let lancandoDado = false; // Flag para controlar se o dado está sendo lançado
let isRotating = true; // Variável para controlar se o dado está girando ou não

document.addEventListener('keydown', function (event) {
    if (event.key === '3') {
        if (!lancandoDado) {
            // Se o dado não estiver sendo lançado, inicia ou para a rotação do dado
            isRotating = !isRotating;
            if (!isRotating) {
                // Se a rotação do dado foi interrompida, mostra o resultado e ajusta a rotação
                mostrarResultado();
            }
        }
    }
});

function animate() {
    requestAnimationFrame(animate);

    // Verifica se o dado deve continuar girando
    if (isRotating) {
        cube.rotation.x += 0.04;
        cube.rotation.z += 0.04;
    }
}

animate();

// Função para mostrar o resultado do dado e ajustar a rotação
function mostrarResultado() {
    const numeroAleatorio = Math.floor(Math.random() * ladosDoDado) + 1;
    const resultadoDiv = document.getElementById("resultado");
    if (resultadoDiv) {
        resultadoDiv.textContent = "Resultado: " + numeroAleatorio;
    }

    // Define a rotação final do dado com base no número sorteado
    ajustarRotacao(numeroAleatorio);
}

function ajustarRotacao(numeroAleatorio) {
    if (numeroAleatorio === 1) {
        cube.rotation.set(0, 0, Math.PI / 2);
    } else if (numeroAleatorio === 2) {
        cube.rotation.set(0, 0, -Math.PI / 2);
    } else if (numeroAleatorio === 3) {
        cube.rotation.set(0, 0, 0);
    } else if (numeroAleatorio === 4) {
        cube.rotation.set(Math.PI, 0, 0);
    } else if (numeroAleatorio === 5) {
        cube.rotation.set(-Math.PI / 2, 0, 0);
    } else if (numeroAleatorio === 6) {
        cube.rotation.set(Math.PI / 2, 0, 0);
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
function alternarDiaNoite() {
    isDia = !isDia; // Inverte o estado entre dia e noite

    // Remove a skybox atual da cena
    cena.remove(skybox);

    // Altera as configurações da cena com base no estado atual
    if (isDia) {
        cena.background = new THREE.Color(0xc0e6f0); // Define o fundo como azul claro para representar o dia
        luzDoSol.intensity = 1;
        luzDaLua.intensity=0; // Ajusta a intensidade da luz do sol para representar o dia
        cena.add(sol);
        cena.remove(lua);
        cena.add(focoLuz);
        cena.add(focoLuz.target);

    } else {
        cena.background = null; // Remove o fundo para que a skybox seja visível
        luzDoSol.intensity = 0;
        luzDaLua.intensity=1; 
        cena.remove(sol);
        cena.add(skybox);
        cena.add(lua);
       cena.remove(focoLuz);
       
    }

}

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

function Start(){
    // Configurar PointerLockControls
    controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);

    // Adicionar evento para bloquear o cursor quando clicar no ecrã
    renderer.domElement.addEventListener('click', function() {
        controls.lock();
    });

    // Adiciona o PointerLockControls à cena
    cena.add(controls.getObject());

    // Cria o menu inicial
    mostrarMenuInicial();

    var luzAmbiente = new THREE.AmbientLight(0x404040, 0.5); // Luz ambiente com cor cinza e intensidade 0.5
    cena.add(luzAmbiente);

    // Criação de um foco de luz com a cor branca (#ffffff) e intensidade a 1 (intensidade normal).
    var focoLuz = new THREE.SpotLight(0xffffff, 2); // Cor branca, intensidade 1

    // Mudar a posição da luz para ficar 5 unidades acima da câmera e 10 unidades para a frente
    focoLuz.position.set(-50, 0, 50);

    // Dizemos a light para ficar a apontar para a posição do centro do tabuleiro.
    focoLuz.target.position.set(0, 0, 0); // Define o alvo da luz para o centro do tabuleiro
    //cena.add(focoLuz.target); // Adiciona o alvo da luz à cena
    focoLuz.target.updateMatrixWorld(); // Atualiza a posição do alvo no mundo



    // Posicionar a câmara
    camaraPerspetiva.position.set(0, 10, 12); // Ajuste a posição da câmera para que o tabuleiro seja centralizado e tenha uma visão mais ampla

    // Definir a direção para a câmara olhar
    camaraPerspetiva.lookAt(0, 0, 0);

    // Renderizar a cena
    //renderer.render(cena, camaraPerspetiva);

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

    // Criar o tabuleiro de xadrez
   
   
    //criarRelva();

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
    menuInicialContainer.style.opacity = '0.7'; // Define opacidade do menu
    menuInicialContainer.style.fontWeight = 'bold'; // Define o texto em negrito
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
    botaoIniciar.style.backgroundColor = 'red';
    menuInicialContainer.style.opacity = '0.7'; // Define opacidade do menu
    menuInicialContainer.style.fontWeight = 'bold'; // Define o texto em negrito
    botaoIniciar.style.border = 'none';
    botaoIniciar.innerHTML = 'Iniciar';
    botaoIniciar.addEventListener('click', iniciarJogo);
    menuInicialContainer.appendChild(botaoIniciar);
}

// Função para criar o botão "Voltar ao Menu"
/*function criarBotaoVoltarMenu() {
    // Criar o botão
    var botaoVoltar = document.createElement('button');
    botaoVoltar.style.position = 'absolute';
    botaoVoltar.style.top = '20px'; // Ajuste a posição conforme necessário
    botaoVoltar.style.right = '20px'; // Ajuste a posição conforme necessário
    botaoVoltar.style.padding = '10px 20px';
    botaoVoltar.style.color = 'white';
    botaoVoltar.style.backgroundColor = 'blue';
    botaoVoltar.style.border = 'none';
    botaoVoltar.innerHTML = 'Voltar ao Menu';
    
    // Adicionar evento de clique para voltar ao menu
    botaoVoltar.addEventListener('click', voltarMenuInicial);
    
    // Adicionar o botão ao corpo do documento
    document.body.appendChild(botaoVoltar);
}

// Função para voltar ao menu inicial
function voltarMenuInicial() {
    // Limpar a cena
    cena.clear();
    
    // Remover os controles do jogador
    cena.remove(controls.getObject());
    
    // Remover o tabuleiro
    cena.remove(tabuleiro);
    
    // Mostrar o menu inicial novamente
    mostrarMenuInicial();
} */

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

function loop() {
    if (cameraAtiva === camaraPerspetiva) {
        if (moveForward) controls.moveForward(0.1);
        if (moveBackward) controls.moveForward(-0.1);
        if (moveLeft) controls.moveRight(-0.1);
        if (moveRight) controls.moveRight(0.1);
    }

    // Verificar a posição do peao
    if (peao && peao.position.distanceTo(posicaoFinal) < 0.1) {
        exibirMensagemVitoria();
    }

    renderer.render(cena, cameraAtiva);

    requestAnimationFrame(loop);
}


// Carregar e tocar música de fundo
var listener = new THREE.AudioListener();
camaraPerspetiva.add(listener);

var sound = new THREE.Audio(listener);

var audioLoader = new THREE.AudioLoader();
audioLoader.load('./Musica/background-music.mp3.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
});

function posicaoAleatoria() {
    // Defina os limites do mapa
    var xMin = -30, xMax = 30;
    var zMin = -20, zMax = 20;

    // Defina os limites onde as árvores estão localizadas
    var xMinArvores = -5, xMaxArvores = 5;
    var zMinArvores = -5, zMaxArvores = 5;

    var x, z;

    do {
        // Gere uma posição aleatória dentro dos limites
        x = Math.random() * (xMax - xMin) + xMin;
        z = Math.random() * (zMax - zMin) + zMin;
    } while ((x > xMinArvores && x < xMaxArvores) || (z > zMinArvores && z < zMaxArvores)); // Continue gerando enquanto a posição estiver dentro do intervalo das árvores

    // Certifique-se de que os gatos estão atrás das árvores
    if (z < zMaxArvores) {
        z = zMaxArvores + Math.random() * (zMax - zMaxArvores);
    }

    return { x: x, y: 0, z: z };
}


function carregarGato() {
    //var posicaoInicial = { x: 2, y: 0, z: 2 };
    var posicaoInicial = posicaoAleatoria(); // Use a função para gerar uma posição aleatória

    importer.load(
        './Objetos/cat.fbx',
        function (modelo) {
            // Reduzindo ainda mais o tamanho do gato
            modelo.scale.set(0.005, 0.005, 0.005);
            modelo.position.set(posicaoInicial.x, posicaoInicial.y, posicaoInicial.z);
            modelo.castShadow = true;
            modelo.receiveShadow = true;
            cena.add(modelo);

            // Adicionando animação de caminhada
            adicionarAnimacaoCaminhada(modelo);
        },
        undefined,
        function (erro) {
            console.error('Ocorreu um erro ao carregar o modelo do gato:', erro);
        }
    );
}

function adicionarAnimacaoCaminhada(modelo) {
    var mixer;

    // Carrega as animações do modelo
    var loader = new THREE.FBXLoader();
    loader.load('./Animacoes/caminhada.fbx', function (animacao) {
        mixer = new THREE.AnimationMixer(modelo);
        mixer.clipAction(animacao.animations[0]).play();
    });

    // Velocidade do movimento
    var velocidade = 0.05;

    function animar() {
        requestAnimationFrame(animar);
    
        // Movimento do modelo
        modelo.translateX(velocidade);
    
        // Verifique se o gato está dentro da área das árvores
        if ((modelo.position.x > xMinArvores && modelo.position.x < xMaxArvores) && (modelo.position.z > zMinArvores && modelo.position.z < zMaxArvores)) {
            // Se o gato estiver dentro da área das árvores, inverta a direção
            velocidade = -velocidade;
        }
    
        // Atualiza a animação
        if (mixer) mixer.update(0.01);
    
        renderer.render(cena, camera);
    }
    
    animar();    
}

// Chame a função para carregar e adicionar o gato à cena
carregarGato();

function carregarGato2() {
    //var posicaoInicial = { x: -2, y: 0, z: -2 };
    var posicaoInicial = posicaoAleatoria(); // Use a função para gerar uma posição aleatória

    importer.load(
        './Objetos/cat.fbx',
        function (modelo) {
            // Reduzindo ainda mais o tamanho do gato
            modelo.scale.set(0.005, 0.005, 0.005);
            modelo.position.set(posicaoInicial.x, posicaoInicial.y, posicaoInicial.z);
            modelo.castShadow = true;
            modelo.receiveShadow = true;
            cena.add(modelo);

            // Adicionando animação de caminhada
            adicionarAnimacaoCaminhada(modelo);
        },
        undefined,
        function (erro) {
            console.error('Ocorreu um erro ao carregar o modelo do gato:', erro);
        }
    );
}

// Chame a função para carregar e adicionar o gato à cena
carregarGato2();

function carregarGato3() {
    //var posicaoInicial = { x: 2, y: 0, z: -2 };
    var posicaoInicial = posicaoAleatoria(); // Use a função para gerar uma posição aleatória

    importer.load(
        './Objetos/cat.fbx',
        function (modelo) {
            // Reduzindo ainda mais o tamanho do gato
            modelo.scale.set(0.005, 0.005, 0.005);
            modelo.position.set(posicaoInicial.x, posicaoInicial.y, posicaoInicial.z);
            modelo.castShadow = true;
            modelo.receiveShadow = true;
            cena.add(modelo);

            // Adicionando animação de caminhada
            adicionarAnimacaoCaminhada(modelo);
        },
        undefined,
        function (erro) {
            console.error('Ocorreu um erro ao carregar o modelo do gato:', erro);
        }
    );
}

// Chame a função para carregar e adicionar o gato à cena
carregarGato3();

function carregarGato4() {
    //var posicaoInicial = { x: -2, y: 0, z: 2 };
    var posicaoInicial = posicaoAleatoria(); // Use a função para gerar uma posição aleatória

    importer.load(
        './Objetos/cat.fbx',
        function (modelo) {
            // Reduzindo ainda mais o tamanho do gato
            modelo.scale.set(0.005, 0.005, 0.005);
            modelo.position.set(posicaoInicial.x, posicaoInicial.y, posicaoInicial.z);
            modelo.castShadow = true;
            modelo.receiveShadow = true;
            cena.add(modelo);

            // Adicionando animação de caminhada
            adicionarAnimacaoCaminhada(modelo);
        },
        undefined,
        function (erro) {
            console.error('Ocorreu um erro ao carregar o modelo do gato:', erro);
        }
    );
}

// Chame a função para carregar e adicionar o gato à cena
carregarGato4();

const posicaoFinal = { x:-4.5 , y:0.5 , z: -4.5 };


function exibirMensagemVitoria() {
    const mensagem = document.createElement('div');
    mensagem.style.position = 'absolute';
    mensagem.style.top = '50%';
    mensagem.style.left = '50%';
    mensagem.style.transform = 'translate(-50%, -50%)';
    mensagem.style.padding = '20px';
    mensagem.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    mensagem.style.color = 'white';
    mensagem.style.fontSize = '24px';
    mensagem.style.borderRadius = '10px';
    mensagem.innerHTML = 'Parabéns! Você chegou ao final do tabuleiro!';
    document.body.appendChild(mensagem);

    //iniciarFogosArtificio();
}

/*function iniciarFogosArtificio() {
    for (let i = 0; i < 5; i++) {
        criarFogoArtificio();
    }
}

/*function criarFogoArtificio() {
    const geometria = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const particula = new THREE.Mesh(geometria, material);

    particula.position.set(
        Math.random() * 10 - 5,
        Math.random() * 5 + 5,
        Math.random() * 10 - 5
    );

    const velocidade = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
    );

    fogosArtificio.push({ particula, velocidade });
    cena.add(particula);
}


/*function atualizarFogosArtificio() {
    for (let i = fogosArtificio.length - 1; i >= 0; i--) {
        const f = fogosArtificio[i];
        f.particula.position.add(f.velocidade);
        f.velocidade.y -= 0.02;

        if (f.particula.position.y < 0) {
            cena.remove(f.particula);
            fogosArtificio.splice(i, 1);
        }
    }
}*/

// Criação do rio
var raioInterno = 11.5; // Raio interno do rio (deve ser ligeiramente menor que o raio do tabuleiro)
var raioExterno = raioInterno + 5; // Raio externo do rio é agora três vezes maior que o raio interno
var segmentos = 100; // Número de segmentos (quanto maior, mais suave será o rio)

// Para tornar o rio mais natural, podemos adicionar alguma variação ao raio
var onda = new THREE.Vector3(1, 0, 1);
var amplitude = 0.5;

var geometria = new THREE.RingGeometry(raioInterno, raioExterno, segmentos, 8, 0, Math.PI * 2, false, function(u, v, target) {
    var angulo = u * Math.PI * 2;
    var raio = raioInterno + (raioExterno - raioInterno) * v;
    raio += amplitude * (1 + Math.sin(angulo + onda.dot(target)));
    target.set(raio * Math.cos(angulo), raio * Math.sin(angulo), 0);
});

// Carregar a textura da água
var textureLoader = new THREE.TextureLoader();
textureLoader.load(
    './Images/agua.png', // Substitua pelo caminho para a sua imagem
    function(texture) {
        // Quando a imagem é carregada, criamos o material com a textura
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10); // Aumente a repetição da textura para torná-la mais nítida

        var materialRio = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});

        var rio = new THREE.Mesh(geometria, materialRio);

        // Posicionando o rio ao nível do chão
        rio.rotation.x = -Math.PI / 2;
        rio.position.y = 0; // Posição y ajustada para que o rio esteja ao nível do chão

        // Adicionando o rio à cena
        cena.add(rio);
    },
    function(xhr) {
        // Função chamada enquanto a imagem está sendo carregada
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
        // Função chamada se ocorrer um erro ao carregar a imagem
        console.log('An error happened');
    }
);
