//Código corresponde ao vertex shader
var codigoVertexShader = [ 
    'precision mediump float;' //Indica precisão do float
    ,

    'attribute vec3 vertexPosition;', //Atributo de posição (indica a posição do vértice)
    
    'attribute vec3 vertexColor;', //Atributo de cor (indica a cor do vértice)
    ,
    'varying vec3 fragColor;', //Variavel de cor passada para o fragment shader (interface entre o vertex shader e o fragment shader)
    ,

    'void main(){',

    '   fragColor = vertexColor;', //Atribui a cor do vertice à variavel fragColor
    
    '   gl_Position = vec4(vertexPosition, 1.0);', //Posiciona o vertice na tela
    
    '}'
].join('\n');

//Código corresponde ao fragment shader
var codigoFragmentShader = [
    'precision mediump float;' //Indica precisão do float
    ,
    'varying vec3 fragColor;', //Variavel de cor passada do vertex shader (interface entre o vertex shader e o fragment shader)
    ,
    'void main() {',
    
    '   gl_FragColor = vec4(fragColor, 1.0);', //Atribui a cor do vertice à variavel fragColor
    
    '}'
].join('\n');