var canvas = document.createElement('canvas');

canvas.width = window.innerWidth - 15; 

canvas.height = window.innerHeight - 100;

var GL = canvas.getContext('webgl'); 

var vertexShader = GL.createShader(GL.VERTEX_SHADER); 

var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER); 

var program = GL.createProgram(); 

var gpuArrayBuffer = GL.createBuffer(); 

var finalMatrixLocation;

var anguloDeRotacao = 0;

var visualizationMatrixLocation;

var projectionMatrixLocation;

var viewportMatrixLocation;

function PrepareCanvas()
{
    GL.clearColor(0.65, 0.65, 0.65, 1.0);

    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT); 

    document.body.appendChild(canvas); 

    canvas.insertAdjacentText('afterend', 'O canva encontra se acima deste texto'); 
}

function PrepareShaders()
{
    GL.shaderSource(vertexShader, codigoVertexShader); 
    GL.shaderSource(fragmentShader, codigoFragmentShader); 
    
    GL.compileShader(vertexShader); 
    GL.compileShader(fragmentShader); 
    
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
    GL.attachShader(program, vertexShader); 
    GL.attachShader(program, fragmentShader); 

    GL.linkProgram(program); 

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
        -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 
         0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 
         0.0, 0.5, 0.0, 0.0, 0.0, 1.0 
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer); 
         
    GL.bufferData(
        
        GL.ARRAY_BUFFER,

        new Float32Array(triangleArray),

        GL.STATIC_DRAW 
    );
}

function SendDataToShaders()
{
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition"); 
    var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor"); 

    GL.vertexAttribPointer( 
        vertexPositionAttributeLocation, 
        3, 
        GL.FLOAT, 
        false, 
        6 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT 
    );

    GL.vertexAttribPointer( 
        vertexColorAttributeLocation, 
        3, 
        GL.FLOAT, 
        false,
        6 * Float32Array.BYTES_PER_ELEMENT, 
        3 * Float32Array.BYTES_PER_ELEMENT 
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation); 
    GL.enableVertexAttribArray(vertexColorAttributeLocation); 

    finalMatrixLocation = GL.getUniformLocation(program, "transformationMatrix");

    //vai buscar qual a localização da variável 'visualizationMatrix' ao vertexShader
    visualizationMatrixLocation = GL.getUniformLocation(program, 'visualizationMatrix');

    //vai buscar qual a localização da variável 'projectionMatrix' ao vertexShader
    projectionMatrixLocation = GL.getUniformLocation (program,'projectionMatrix')

    //vai buscar qual a localização da variável 'viewportMatrix' ao vertexShader
    viewportMatrixLocation = GL.getUniformLocation (program,'viewportMatrix')
}

function loop()
{
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 100;
    GL.viewport(0, 0, canvas.width, canvas.height);

    GL.useProgram(program);

    GL.clearColor(0.65, 0.65, 0.65, 1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    var finalMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    //Desafio 1
    finalMatrix = math.multiply(CriarMatrizEscala(0.7, 0.7, 0.7), finalMatrix);

    //Desafio 3
    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloDeRotacao), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizRotacaoX(anguloDeRotacao), finalMatrix); 

    //Desafio 2
    finalMatrix = math.multiply(CriarMatrizTranslacao(-0.5, 0.5, -0.5), finalMatrix);

    //Criamos uma translação no eixo do Z para que o trinâgulo fique do volume de visualização
    finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 1), finalMatrix);

    var newarray = [];
    for(i=0; i<finalMatrix.length; i++)
    {
        newarray = newarray.concat(finalMatrix[i]);
    }

    var visualizationMatrix = MatrizDeVisualizacao([1,0,0], [0,1,0], [0,0,1], [0,0,0]);
    var newVisualizationMatrix = [];

    for(i=0; i<visualizationMatrix.length; i++)
    {
        newVisualizationMatrix = newVisualizationMatrix.concat(visualizationMatrix[i]);
    }

    // Linha responsavel pela criação da camara em pespetiva com os parametros de distancia=1
    // comprimento da camara de 4 unidades, altura de 3 unidades, plano anterior de 0.1 unidades e 
    // plano posterior de 100 unidades
    var projectionMatrix = MatrizPerspetiva(2, 2, 0.1, 100);

    //Linha responsável pela criação da camara ortografica com os parametros de comprimento da camara de 4 unidades,
    //altura=3, plano anterior=0.1 e plano posterior=100
    //var projectionMatrix = MatrizOrtografica(4, 3, 0.1, 100);

    //NOTA: uma das linhas da criação tem de estar comentada para que a outra funcione
    //caso queira mudar de camara, basta comentar a linha que está a ser usada e descomentar a outra

    var newprojectionMatrix = [];
    for (i=0 ; i < projectionMatrix.length; i++)
    {
        newProjectionMatrix = newprojectionMatrix.concat(projectionMatrix[i]);
    }

    var viewportMatrix = MatrizViewport(-1,1,-1,1);
    var newViewportMatrix = [];

    for (i= 0; i < viewportMatrix.length; i++)
    {
        newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);

    GL.uniformMatrix4fv(visualizationMatrixLocation, false, newVisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation, false, newProjectionMatrix);
    GL.uniformMatrix4fv(viewportMatrixLocation, false, newViewportMatrix);

    GL.drawArrays(GL.TRIANGLES, 0, 3);

    anguloDeRotacao += 1;

    requestAnimationFrame(loop);

}

function Start()
{ 
    PrepareCanvas(); 
    PrepareShaders(); 
    PrepareProgram(); 
    PrepareTriangleData(); 
    SendDataToShaders(); 
    loop(); 
}