/**
 * @param {float} x Valor para translação no eixo do X
 * @param {float} y Valor para translação no eixo do Y
 * @param {float} z Valor para translação no eixo do Z
 * Devolve um 2D array com a matriz de translação pedida
 */
function CriarMatrizTranslacao(x,y,z)
{
    // Matriz de translação final
    return[
        [1,  0,  0,  x],
        [0,  1,  0,  y],
        [0,  0,  1,  z],
        [0,  0,  0,  1]
    ];
}

function CriarMatrizEscala(x,y,z)
{
    // Matriz de escala final
    return[
        [x,  0,  0,  0],
        [0,  y,  0,  0],
        [0,  0,  z,  0],
        [0,  0,  0,  1]
    ];
}

/**
 * @param {float} angulo Ângulo em graus para rodar no eixo do X
 */
function CriarMatrizRotacaoX(angulo)
{
    // Seno e cosseno são calculados em radianos, logo é necessário converter de graus
    // para radianos utilizando a linha a baixo
    var radianos = angulo * Math.PI/180;

    // Matriz final de Rotação no eixo do X
    return[
        [1,              0,                             0,                          0],
        [0,              Math.cos(radianos),            -Math.sin(radianos),        0],
        [0,              Math.sin(radianos),            Math.cos(radianos),         0],
        [0,              0,                             0,                          1]
    ];
}

/**
 * @param {float} angulo Ângulo em graus para rodar no eixo do Y 
 */
function CriarMatrizRotacaoY(angulo)
{
    // Seno e cosseno são calculados em radianos, logo é necessário converter de graus
    // para radianos utilizando a linha a baixo
    var radianos = angulo * Math.PI/180;

    // Matriz final de Rotação no eixo do Y
    return[
        [Math.cos(radianos),     0,         Math.sin(radianos),     0],
        [0,                      1,         0,                      0],
        [-Math.sin(radianos),    0,         Math.cos(radianos),     0],
        [0,                      0,         0,                      1]
    ];
}

/**
 * @param {float} angulo Ângulo em graus para rodar no eixo do Z 
 */
function CriarMatrizRotacaoZ(angulo)
{
    // Seno e cosseno são calculados em radianos, logo é necessário converter de graus
    // para radianos utilizando a linha a baixo
    var radianos = angulo * Math.PI/180;

    // Matriz final de Rotação no eixo do Z
    return[
        [Math.cos(radianos),     -Math.sin(radianos),        0,      0],
        [Math.sin(radianos),     Math.cos(radianos),         0,      0],
        [0,                      0,                          1,      0],
        [0,                      0,                          0,      1]
    ];
}

function CriarMatrizTranslacaoCircular(angulo, raio) {
    // Calcular as coordenadas de translação com base no ângulo
    var x = raio * Math.cos(angulo * Math.PI / 180);
    var y = raio * Math.sin(angulo * Math.PI / 180);

    // Matriz de translação final
    return [
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}