// Code for the vertex shader
var codigoVertexShader = [
    'precision mediump float;', 
    'attribute vec3 vertexPosition;', 
    //uma vez que agora vamos receber coordenadas UV já não vamos precisar da linha
    //'attribute vec3 vertexColor;', vamos substituir pela abaixo
    'attribute vec2 texCoords;',
    //Pela mesma explicação acima
    //'varying vec3 fragColor;', vamos substituir a linha abaixo
    'varying vec2 fragTexCoords;'
    ,
    'uniform mat4 transformationMatrix;',
    'uniform mat4 visualizationMatrix;', 
    'uniform mat4 projectionMatrix;',   
    'uniform mat4 viewportMatrix;',
    'void main() {',
    //Para que o fragmentShader receba as coordenadas UV
    '   fragTexCoords = texCoords;', 
    '   gl_Position = vec4(vertexPosition, 1.0) * transformationMatrix * visualizationMatrix * projectionMatrix * viewportMatrix;', 
    '}'
].join('\n');


var codigoFragmentShader = [
    'precision mediump float;',
    // mesma explicação acima
    //'varying vec3 fragColor;', vamos substituir pela linha abaixo
    'varying vec2 fragTexCoords;',
    //Vamos adicionar uma variável que guarde a textura que vai ser utilizada para
    //aplicar ao cubo
    'uniform sampler2D sampler;',
    'void main() {',
    //função abaixo busca a cor de cada pixel da textura
    '   gl_FragColor = texture2D(sampler, fragTexCoords);', 
    '}'
].join('\n');