//Indica ao decumento HTML que quando acabar de carregar todo o seu conteúdo deve chamar a função "Start"
document.addEventListener('DOMContentLoaded', Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(- 1, 1, 1, - 1, -10, 10);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth -15, window.innerHeight -80); //Indica ao render qual o tamanho da janela de visualização

renderer.setClearColor(0xaaaaaa); //Indica ao render qual a cor de fundo da janela de visualização

document.body.appendChild(renderer.domElement); //Adiciona o render ao body do decumento html para que este possa ser visto

//Para criar um triangulo é necessário criar a geometria
//Utilizamos o código a baixo indicando quais as posições de cada um dos vértices do triângulo
var geometria = new THREE.BufferGeometry();
var vertices = new Float32Array( [
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
] );

//Para definir a cor de cada um dos vértices, criamos uma matriz com os valores RGB para cada um deles
const cores = new Float32Array( [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
] );

//itemSize = 3 pois são 3 valores (componentes x,y,z para a posição e RGB para a cor) por vértice
geometria.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3));
geometria.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(cores), 3));

//É necessário criar o material usando um material básico representando a cor, ativamos o parametro vertexColors para assumir a matriz que criamos com os pontos RGB como as cores a aplicar
var material = new THREE.MeshBasicMaterial({vertexColors: true});

//No final criamos uma mesh com os dados da geometria e do material
//A mesh é o componente necessário para fazer tranformações ao objeto
var mesh = new THREE.Mesh(geometria, material);

// Definir a operação de translação no nosso triangulo
mesh.translateX(0);
mesh.translateY(0);

// Definir a operação de escala no nosso triangulo
mesh.scale.set(1, 1, 1);

function loop() {

    // Definir a rotação no eixo do Y.
    // Como o ThreeJS usa Radianos por defeito, temos que converter em graus usando a fórmula Math.PI/180 * GRAUS
    mesh.rotateY(Math.PI/180 * 1);

    // Função chamada para gerarmos um novo frame
    renderer.render(cena, camara);
    
    // Função chamada para executar de novo a função loop de forma a gerar o frame seguinte
    requestAnimationFrame(loop);
}

//Função chamada responsável por configurar a cena para a primeira renderização
function Start(){

    cena.add(mesh); //Adiciona o triangulo que criamos anteriormente á cena

    renderer.render(cena, camara);

    // Função para chamar a nossa função de loop
    requestAnimationFrame(loop);
}