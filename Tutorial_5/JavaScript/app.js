var canvas = document.createElement("canvas");

  canvas.width = window.innerWidth - 15;
  canvas.height = window.innerHeight - 100;

  var GL = canvas.getContext("webgl");

  var vertexShader = GL.createShader(GL.VERTEX_SHADER);
  var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);

  var program = GL.createProgram();
  var vertexPosition;
  var vertexIndex;
  var gpuIndexBuffer = GL.createBuffer();
 
  var gpuArrayBuffer = GL.createBuffer();
  var visualizationMatrixLocation;
  var projectionMatrixLocation;
  var viewportMatrixLocation;
  var finalMatrixLocation;
  var anguloDeRotacao = 0;  
  
  var boxTexture = GL.createTexture(); //guarda na memoria da GPU a textura que será utilizada

  function prepareCanvas() {
    
    GL.clearColor(0.65, 0.65, 0.65, 1);
    GL.clear(GL.COLOR_BUFFER_BIT || GL.DEPTH_BUFFER_BIT);
    GL.enable(GL.DEPTH_TEST);
    GL.enable(GL.CULL_FACE);
    document.body.appendChild(canvas);

    canvas.insertAdjacentText("afterend", "O canvas esta em cima deste texto");
  }

  function start() {
    prepareCanvas();
    prepareShaders();
    prepareProgram();
    prepareTriangleData();
    SendDataToShaders();

    loop();
  }

  function loop() {
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 100;
    GL.viewport(0, 0, canvas.width, canvas.height);

    GL.useProgram(program);

    GL.clearColor(0.65, 0.65, 0.65, 1);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    var finalMatrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    finalMatrix = math.multiply(
      criarMatrizRotacaoY(anguloDeRotacao),
      finalMatrix
    );
    finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 2), finalMatrix);

    var newarray = [];

    for (i = 0; i < finalMatrix.length; i++) {
      newarray = newarray.concat(finalMatrix[i]);
    }

    var visualizationMatrix = matrizDeVisualizacao(
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0]
    );
    var newVisualizationMatrix = [];

    for (i = 0; i < visualizationMatrix.length; i++) {
      newVisualizationMatrix = newVisualizationMatrix.concat(
        visualizationMatrix[i]
      );
    }

    var projectionMatrix = matrizPerspetiva(1, 4, 3, 0.1, 100);

    var newProjectionMatrix = [];
    for (i = 0; i < projectionMatrix.length; i++) {
      newProjectionMatrix = newProjectionMatrix.concat(projectionMatrix[i]);
    }

    var viewportMatrix = matrizViewport(-1,1,-1,1);
    var newViewportMatrix = [];
    for (i = 0; i < viewportMatrix.length; i++) {
      newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);
    
      GL.uniformMatrix4fv(visualizationMatrixLocation, false, newVisualizationMatrix);
      GL.uniformMatrix4fv(projectionMatrixLocation, false, newProjectionMatrix);
      GL.uniformMatrix4fv(viewportMatrixLocation, false, newViewportMatrix);

    
    GL.drawElements(GL.TRIANGLES, vertexIndex.length, GL.UNSIGNED_SHORT, 0)

    anguloDeRotacao += 1;

    requestAnimationFrame(loop);
  }

  function prepareTriangleData() {
    
    vertexPosition = [
      // em vez de termos 3 valores para as cores RGB vamos ter apenas
      // 2 valores, que são coordenadas UV
      //x,y,z,u,v
      //frente
      0,    0,    0,    0,    0.33,     
      0,    1,    0,    0,    0,     
      1,    1,    0,    0.33,    0,    
      1,    0,    0,    0.33,    0.33, 
      
      //Direita
      1,    0,    0,    0.33,    0.33,    
      1,    1,    0,    0.33,    0,      
      1,    1,    1,    0.66,    0,    
      1,    0,    1,    0.66,    0.33,
      
      //Trás
      1,    0,    1,    0.66,    0.33,     
      1,    1,    1,    0.66,    0,     
      0,    1,    1,    1,    0,    
      0,    0,    1,    0.66,    0.33,
      
      //Esquerda
      0,    0,    1,    0,    0.66,    
      0,    1,    1,    0,    0.33,     
      0,    1,    0,    0.33,    0.33,    
      0,    0,    0,    0.33,    0.66,   

      //Cima
      0,    1,    0,    0.33,    0.66,    
      0,    1,    1,    0.33,    0.33,     
      1,    1,    1,    0.66,    0.33,    
      1,    1,    0,    0.66,    0.66,  
      
      //Baixo
      1,    0,    0,    0.66,    0.66,    
      1,    0,    1,    0.66,    0.33,     
      1,    1,    1,    1,    0.33,    
      0,    0,    0,    1,    0.66 
    ];

    vertexIndex = [
      
      0, 2, 1,
      0, 3, 2,
      
      4, 6, 5,
      4, 7, 6,
      
      8, 10, 9,
      8, 11, 10,
      
      12, 14, 13,
      12, 15, 14,

      16, 18, 17,
      16, 19, 18,
      
      20, 22, 21,
      20, 23, 22,
    ]

    var triangleArray = [
      -0.5,
      0.5,
      0.0, 
      0.0,
      0.0,
      1.0, 
      0.5,
      0.5,
      0.0, 
      0.0,
      1.0,
      0.0, 
      0.0,
      -0.5,
      0.0, 
      1.0,
      0.0,
      0.0, 
    ];

    
    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);

    
    GL.bufferData(
      GL.ARRAY_BUFFER, 
      new Float32Array(vertexPosition), 
      GL.STATIC_DRAW 
    );
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);
    GL.bufferData(
      GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(vertexIndex),
      GL.STATIC_DRAW
    )

    //Agora é necessário configurar os parametros da GPU
    //primeiro temos que fazer bind à textura
    GL.bindTexture(GL.TEXTURE_2D, boxTexture);

    //Parametros necessarios para a GPU saber como interpretar a rasterização
    //faz Clamp à borda no eixo do U
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);

    //faz Clamp à borda no eixo do V
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

    //As duas linhas a baixo indicam como deve ser escalada a textura tanto
    //para diminui la como para aumenta la
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

    //Passamos a imagem que está no documento "escondida" atraves do id da imagem
    GL.texImage2D(
      GL.TEXTURE_2D, 
      0, 
      GL.RGBA, 
      GL.RGBA, 
      GL.UNSIGNED_BYTE, 
      document.getElementById('boxImage')
    );
  }

  function prepareShaders() {

    GL.shaderSource(vertexShader, codigoVertexShader);
    GL.shaderSource(fragmentShader, codigoFragmentShader);

    GL.compileShader(vertexShader);
    GL.compileShader(fragmentShader);

    
    if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
      console.error(
        "ERROR: Vertex shader compilation failed!",
        GL.getShaderInfoLog(vertexShader)
      );
      return;
    }

    
    if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
      console.error(
        "ERROR: Fragment shader compilation failed!",
        GL.getShaderInfoLog(fragmentShader)
      );
      return;
    }
  }

  function SendDataToShaders() {
    
    var vertexPositionAttributeLocation = GL.getAttribLocation(
      program,
      'vertexPosition'
    );

    //agora em vez de irmos buscar a localização da varivael "vertexColor" vamos buscar
    //a localização da variavel "texCoords"

    var texCoordAttributeLocation = GL.getAttribLocation(
      program,
      'texCoords'
    );

    GL.vertexAttribPointer(
      vertexPositionAttributeLocation,
      3,
      GL.FLOAT,
      false,
      //Agora o conjunto tem apenas 5 valores
      5 * Float32Array.BYTES_PER_ELEMENT,
      0 * Float32Array.BYTES_PER_ELEMENT
    );

    GL.vertexAttribPointer(
      //Mudamos a variavel vertexColorAttributeLocation
      texCoordAttributeLocation,
      //Agora só enviamos um conjunto de 2 valores para a variavel
      //texCoords
      2,
      GL.FLOAT,
      false,
      //Agora o conjunto tem apenas 5 valores
      5 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    //trocamos "vertexColorAttributeLocation" por "texCoordsAttributeLocation"
    GL.enableVertexAttribArray(texCoordAttributeLocation);

    finalMatrixLocation = GL.getUniformLocation(program, "transformationMatrix");
    visualizationMatrixLocation = GL.getUniformLocation(program,"visualizationMatrix");
    projectionMatrixLocation = GL.getUniformLocation(program, "projectionMatrix");
    viewportMatrixLocation = GL.getUniformLocation(program, "viewportMatrix");
    
  }

  function prepareProgram() {
  
    GL.attachShader(program, vertexShader);


    GL.attachShader(program, fragmentShader);


    GL.linkProgram(program);

    if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
      console.error(
        "ERROR: Program linking failed!",
        GL.getProgramInfoLog(program)
      );
      return;
    }


    if (!GL.getProgramParameter(program, GL.VALIDATE_STATUS)) {
      console.error(
        "ERROR: Program validation failed!",
        GL.getProgramInfoLog(program)
      );
      return;
    }


    GL.useProgram(program);

    return program;
  }