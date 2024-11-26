var codigoVertexShader = [
    'precision mediump float;' 
    ,

    'attribute vec3 vertexPosition;',
    ,
    'attribute vec3 vertexColor;'
   ,
    'varying vec3 fragColor;' 
    ,

    'uniform mat4 transformationMatrix;',
    'uniform mat4 visualizationMatrix;',
    'uniform mat4 projectionMatrix;',
    'uniform mat4 viewportMatrix;',
    ,

    'void main() {'
    ,
    '   fragColor = vertexColor;' 
    ,   //Depois de transformação geométrica é necessário multiplicar pelas matrizes de visualização, projeção e viewport
    '   gl_Position = vec4(vertexPosition, 1.0)*transformationMatrix*visualizationMatrix*visualizationMatrix*viewportMatrix;' 
    ,
    '}'
].join('\n') 

var codigoFragmentShader = [ 
    'precision mediump float;' 
    ,
    'varying vec3 fragColor;' 
    ,
    'void main() {'
    ,
    '   gl_FragColor = vec4(fragColor, 1.0);' 
    ,
    '}'
    ,
].join('\n')