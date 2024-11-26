var canvas = document.createElement('canvas');

canvas.width = window.innerWidth - 15; // -15 px do tamanho interno 
canvas.height = window.innerHeight - 100;

var GL = canvas.getContext('webgl'); //Biblioteca Gráfica

var vertexShader = GL.createShader(GL.VERTEX_SHADER); //Cria um vertex shader 

var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER); //Cria um fragment shader

var program = GL.createProgram(); //Cria um programa

var gpuArrayBuffer = GL.createBuffer(); //Cria um buffer

// Variável que guarda a localização da variável 'transformationMatrix' do vertexShader.
var finalMatrixLocation;

// Variável que guarda a rotação que deve ser aplicada ao objeto.
var anguloDeRotacao = 0;

//Função responsável por preparar o canvas
function PrepareCanvas()
{
    GL.clearColor(0.65, 0.65, 0.65, 1.0); //Cor de fundo

    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT); //Limpa o buffer de cor e o buffer de profundidade

    document.body.appendChild(canvas); //Adiciona o canvas ao corpo do HTML

    canvas.insertAdjacentText('afterend', 'O canva encontra se acima deste texto'); //Adiciona texto acima do canvas
}

function PrepareShaders()
{
    GL.shaderSource(vertexShader, codigoVertexShader); //Atribui o código do vertex shader
    GL.shaderSource(fragmentShader, codigoFragmentShader); //Atribui o código do fragment shader
    
    GL.compileShader(vertexShader); //Compila o vertex shader
    GL.compileShader(fragmentShader); //Compila o fragment shader
    
    if(!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)){
        console.error("ERRO :: A compilação do vertex shader lançou uma exceção", 
            GL.getShaderInfoLog(vertexShader));
    }

    if(!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)){
        console.error("ERRO :: A compilação do fragment shader lançou uma exceção", 
            GL.getShaderInfoLog(fragmentShader));
    }
}

function PrepareProgram()
{
    GL.attachShader(program, vertexShader); //Anexa o vertex shader ao programa
    GL.attachShader(program, fragmentShader); //Anexa o fragment shader ao programa

    GL.linkProgram(program); //Linka o programa

    if(!GL.getProgramParameter(program, GL.LINK_STATUS))
    {
        console.error("ERRO :: A ligação do programa lançou uma exceção", 
            GL.getProgramInfoLog(program));
    }

    if(!GL.getProgramParameter(program, GL.VALIDATE_STATUS))
    {
        console.error("ERRO :: A validação do programa lançou uma exceção", 
            GL.getProgramInfoLog(program));
    }

    GL.useProgram(program);
}

function PrepareTriangleData()
{
    var triangleArray =
    [
        -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, //Vertice 1
         0.5, -0.5, 0.0, 0.0, 1.0, 0.0, //Vertice 2
         0.0, 0.5, 0.0, 0.0, 0.0, 1.0 //Vertice 3
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer); //Liga o buffer ao ARRAY_BUFFER
         
    GL.bufferData(
        
        GL.ARRAY_BUFFER,

        new Float32Array(triangleArray),//Dados a serem enviados para GPU

        GL.STATIC_DRAW //Dados não serão modificados
    );
}

function SendDataToShaders()
{
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition"); //Pega a posição do atributo vertexPosition
    var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor"); //Pega a posição do atributo vertexColor

    GL.vertexAttribPointer( //Atribui o buffer ao atributo
        vertexPositionAttributeLocation, //Atributo de posição
        3, //Numero de elementos por atributo
        GL.FLOAT, //Tipo de dado
        false, 
        6 * Float32Array.BYTES_PER_ELEMENT, //Tamanho do vertice
        0 * Float32Array.BYTES_PER_ELEMENT //Posição do vertice
    );

    GL.vertexAttribPointer( //Atribui o buffer ao atributo
        vertexColorAttributeLocation, //Atributo de cor
        3, //Numero de elementos por atributo
        GL.FLOAT, //Tipo de dado
        false,
        6 * Float32Array.BYTES_PER_ELEMENT, //Tamanho do vertice
        3 * Float32Array.BYTES_PER_ELEMENT //Posição do vertice
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation); //Habilita o atributo de posição
    GL.enableVertexAttribArray(vertexColorAttributeLocation); //Habilita o atributo de cor

    // Guarda a localização da variável 'transformationMatrix' do vertexShader
    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');

    // Foi removido o código GL.useProgram(program); e GL.drawArrays(GL.TRIANGLES, 0, 3);
}

function loop ()
{
    // O código abaixo faz resize ao canvas de modo a ajustar-se ao tamanho da página web.
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 100;
    GL.viewport(0,0,canvas.width,canvas.height);

    // É necessário dizer que program vamos utilizar.
    GL.useProgram(program);

    // A cada frame é necessário limpar os buffers de profundidade e de cor
    GL.clearColor(0.65, 0.65, 0.65, 1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    // Inicialização da variável que guarda a combinação de matrizes que vão ser passadas para o vertexShader.
    var finalMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    // A matriz final vai ser igual à multiplicação da matrix de escala com a matriz final.
    // Esta matriz faz uma modificação na escala de 0.25 unidades no eixo do X, 0.25 unidades
    // no eixo de Y e 0.25 unidades no eixo do Z. Quer isto dizer que o objeto irá ficar
    // 4 vezes mais pequeno, sendo que para um objeto ter uma escala normal
    // deverá ter 1 unidade em todos os eixos.
    finalMatrix = math.multiply(CriarMatrizEscala(0.8, 0.8, 0.8),finalMatrix);

    // A matriz final vai ser igual à multiplicação da matriz de rotação no eixo do Z
    // com a matriz final. Esta matriz faz uma rotação anguloDeRotação unidades no eixo do Y.
    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloDeRotacao), finalMatrix);

    // A matriz final vai ser igual à multiplicação da matriz de translação com a matriz final.
    // Esta matriz faz uma translação de 0.5 unidades no eixo do X, 0.5 unidades 
    // no eixo do Y e 0.0 unidades no eixo do Z.
    finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 0), finalMatrix);

    // A matriz final vai ser igual à multiplicação da matriz de translação circular
    // com a matriz final. Esta matriz faz uma translação circular em torno do eixo.
    finalMatrix = math.multiply(CriarMatrizTranslacaoCircular(anguloDeRotacao, 0.5), finalMatrix);

    // Agora que já temos a matriz final de transformação, temos que converter de 2D array
    // para um array de uma dimensão. Para isso utilizamos o código a baixo.
    var newarray = [];
    for(i = 0; i< finalMatrix.length; i++)
    {
        newarray = newarray.concat(finalMatrix[i]);
    }

    // Depois de termos os array de uma dimensão temos que enviar essa matriz para
    // o vertexShader. Para isso utilizamos o código abaixo.
    GL.uniformMatrix4fv(finalMatrixLocation,false ,newarray);

    // Agora temos que mandar desenhar os triângulos
    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3
    );

    // A cada frame é preciso atualizar o angulo de rotação.
    anguloDeRotacao +=1;

    // O código abaixo indica que no próximo frame tem que chamar
    // a função passada por parametro. No nosso caso é a mesma função
    // criando um loop de animação.
    requestAnimationFrame(loop);
}

function Start()
{ //Quando a pagina carregar chamará a função 
    PrepareCanvas(); //Chama a função para preparar o Canvas
    PrepareShaders(); //Chama a função para preparar os shaders
    PrepareProgram(); //Chama a função para preparar o programa
    PrepareTriangleData(); //Chama a função para preparar os dados do triangulo
    SendDataToShaders(); //Chama a função para enviar os dados para os shaders

    // Quando acabar de preparar tudo chama a função de loop.
    // Ao chamar o loop vai criar um loop de animação.
    loop();
}
