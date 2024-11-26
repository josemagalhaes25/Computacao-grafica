/** 
 * @param {number} x
 * @param {number} y
 * @param {number} z
*/

function CriarMatrizTranslacao(x,y,z){
    return [
        [1,0,0,x],
        [0,1,0,y],
        [0,0,1,z],
        [0,0,0,1]
    ];

}

/** 
 * @param {float} x 
 * @param {float} y 
 * @param {float} z 
*/


function CriarMatrizEscala(x,y,z){
    return [
        [x,0,0,0],
        [0,y,0,0],
        [0,0,z,0],
        [0,0,0,1]
    ];
}


/** 
 * @param {float} angulo 
*/

function criarMatrizRotacaoX(angulo){
    var radianos = angulo * Math.PI / 180;
    var c = Math.cos(radianos);
    var s = Math.sin(radianos);
    return [
        [1,0,0,0],
        [0,c,-s,0],
        [0,s,c,0],
        [0,0,0,1]
    ];
}


/** 
 * @param {float} angulo
*/

function criarMatrizRotacaoY(angulo){
    var radianos = angulo * Math.PI / 180;
    var c = Math.cos(radianos);
    var s = Math.sin(radianos);
    return [
        [c,0,s,0],
        [0,1,0,0],
        [-s,0,c,0],
        [0,0,0,1]
    ];
}

/** 
 * @param {float} angulo 
*/

function criarMatrizRotacaoZ(angulo){
    var radianos = angulo * Math.PI / 180;
    var c = Math.cos(radianos);
    var s = Math.sin(radianos);
    return [
        [c,-s,0,0],
        [s,c,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];
}
