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

  function prepareCanvas() {
    // Set up WebGL rendering here

    // Example: Clear the canvas with a black color
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
      // X, Y, Z, R, G, B
      //FRENTE
      0 , 0, 0, 0, 0, 0,
      0, 1, 0, 0, 1, 0,
      1, 1, 0, 1, 1, 0,
      1, 0, 0, 1, 0, 0,
            //DIREITA
      1 , 0, 0, 1, 0, 0,
      1, 1, 0, 1, 1, 0,
      1, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 0, 1,
      //TRÁS
      1 , 0, 1, 1, 0, 1,
      1, 1, 1, 1, 1, 1,
      0, 1, 1, 0, 1, 1,
      0, 0, 1, 0, 0, 1,
      //ESQUERDA
      0 , 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 1,
      0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0,

      //CIMA
      0 , 1, 0, 0, 1, 0,
      0, 1, 1, 0, 1, 1,
      1, 1, 1, 1, 1, 1,
      1, 1, 0, 1, 1, 0,
      //BAIXO
      1 , 0, 0, 1, 0, 0,
      1, 0, 1, 1, 0, 1,
      0, 0, 1, 0, 0, 1,
      0, 0, 0, 0, 0, 0,
    ]

    vertexIndex = [
      //FRENTE
      0, 2, 1,
      0, 3, 2,
      //DIREITA
      4, 6, 5,
      4, 7, 6,
      //TRÁS
      8, 10, 9,
      8, 11, 10,
      //ESQUERDA
      12, 14, 13,
      12, 15, 14,

      //CIMA
      16, 18, 17,
      16, 19, 18,
      //BAIXO
      20, 22, 21,
      20, 23, 22,
    ]

    var triangleArray = [
      -0.5,
      0.5,
      0.0, // Vertex 1 position
      0.0,
      0.0,
      1.0, // Vertex 1 color
      0.5,
      0.5,
      0.0, // Vertex 2 position
      0.0,
      1.0,
      0.0, // Vertex 2 color
      0.0,
      -0.5,
      0.0, // Vertex 3 position
      1.0,
      0.0,
      0.0, // Vertex 3 color
    ];

    // Bind the buffer as the current ARRAY_BUFFER
    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);

    // Copy the triangleArray to the buffer on the GPU
    GL.bufferData(
      GL.ARRAY_BUFFER, // The type of buffer we're using
      new Float32Array(vertexPosition), // Convert the data to 32-bit floats
      GL.STATIC_DRAW // The data won't be changed within the GPU
    );
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);
    GL.bufferData(
      GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(vertexIndex),
      GL.STATIC_DRAW
    )
  }

  function prepareShaders() {
    // Attach the correct shader source code
    GL.shaderSource(vertexShader, codigoVertexShader);
    GL.shaderSource(fragmentShader, codigoFragmentShader);

    // Compile the shaders
    GL.compileShader(vertexShader);
    GL.compileShader(fragmentShader);

    // Check if vertex shader compilation was successful
    if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
      console.error(
        "ERROR: Vertex shader compilation failed!",
        GL.getShaderInfoLog(vertexShader)
      );
      return;
    }

    // Check if fragment shader compilation was successful
    if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
      console.error(
        "ERROR: Fragment shader compilation failed!",
        GL.getShaderInfoLog(fragmentShader)
      );
      return;
    }
  }

  function SendDataToShaders() {
    // Get the position of the attribute in the program
    var vertexPositionAttributeLocation = GL.getAttribLocation(
      program,
      "vertexPosition"
    );
    var vertexColorAttributeLocation = GL.getAttribLocation(
      program,
      "vertexColor"
    );

    GL.vertexAttribPointer(
      vertexPositionAttributeLocation,
      3,
      GL.FLOAT,
      false,
      6 * Float32Array.BYTES_PER_ELEMENT,
      0
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
    visualizationMatrixLocation = GL.getUniformLocation(
      program,
      "visualizationMatrix"
    );
    projectionMatrixLocation = GL.getUniformLocation(program, "projectionMatrix");
    viewportMatrixLocation = GL.getUniformLocation(program, "viewportMatrix");
  }

  function prepareProgram() {
    // Attach vertex shader to program
    GL.attachShader(program, vertexShader);

    // Attach fragment shader to program
    GL.attachShader(program, fragmentShader);

    // Link the program
    GL.linkProgram(program);

    // Check if linking was successful
    if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
      console.error(
        "ERROR: Program linking failed!",
        GL.getProgramInfoLog(program)
      );
      return;
    }

    // Check if validation was successful
    if (!GL.getProgramParameter(program, GL.VALIDATE_STATUS)) {
      console.error(
        "ERROR: Program validation failed!",
        GL.getProgramInfoLog(program)
      );
      return;
    }

    // Use the program
    GL.useProgram(program);

    return program;
  }