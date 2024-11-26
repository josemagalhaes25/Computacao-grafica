var canvas = document.createElement('canvas');

canvas.width = window.innerWidth - 15; // -15 px do tamanho interno 
canvas.height = window.innerHeight - 100;

var GL = canvas.getContext('webgl'); //Biblioteca Gráfica

var vertexShader = GL.createShader(GL.VERTEX_SHADER); //Cria um vertex shader 

var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER); //Cria um fragment shader

var program = GL.createProgram(); //Cria um programa

var gpuArrayBuffer = GL.createBuffer(); //Cria um buffer

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

    GL.useProgram(program); //Usa o programa

    GL.drawArrays(
        GL.TRIANGLES, //Tipo de objetos que pretende desenhar
        0, //Posição inicial
        3 //Numero de vertices
    );
}

function Start()
{ //Quando a pagina carregar chamará a função 
    PrepareCanvas(); //Chama a função para preparar o Canvas
    PrepareShaders(); //Chama a função para preparar os shaders
    PrepareProgram(); //Chama a função para preparar o programa
    PrepareTriangleData(); //Chama a função para preparar os dados do triangulo
    SendDataToShaders(); //Chama a função para enviar os dados para os shaders
}
