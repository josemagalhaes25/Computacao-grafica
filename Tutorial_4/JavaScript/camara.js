/**
 * @param {float[3]} rightVector
 * @param {float[3]} upVector 
 * @param {float[3]} forwardVector
 * @param {float[3]} centerPoint
 */
function matrizDeVisualizacao(rightVector, upVector, forwardVector, centerPoint) {
    return [
        [rightVector[0], rightVector[1], rightVector[2], -math.multiply(rightVector, centerPoint)],
        [upVector[0], upVector[1], upVector[2], -math.multiply(upVector, centerPoint)],
        [forwardVector[0], forwardVector[1], forwardVector[2], -math.multiply(forwardVector, centerPoint)],
        [0, 0, 0, 1]
    ];
}


/**
 * @param {float} width
 * @param {float} height 
 * @param {float} nearPlane
 * @param {float} farPlane
 */



function matrizOrtografica(width, height, nearPlane, farPlane) {
    var matrizOrtografica = [
        [1/width, 0, 0, 0],
        [0, 1/height, 0, 0],
        [0, 0, 1/((farPlane/2)-nearPlane), -nearPlane/((farPlane/2)- nearPlane)],
        [0, 0, 0, 1]
    ];

    return math.multiply(matrizOrtografica, CriarMatrizTranslacao(0, 0, -(nearPlane + farPlane) / 2));
}


/**
 * @param {float} distance
 * @param {float} width
 * @param {float} height 
 * @param {float} nearPlane
 * @param {float} farPlane
 */


function matrizPerspetiva(distance, width, height, nearPlane, farPlane) {
    return [
        [distance/width, 0, 0, 0],
        [0, distance/height, 0, 0],
        [0, 0, farPlane/(farPlane - nearPlane), -nearPlane*farPlane/(farPlane - nearPlane)],
        [0, 0, 1, 0]
    ];
}



/**
 * @param {float} minX 
 * @param {float} maxX 
 * @param {float} minY 
 * @param {float} maxY 
 */


function matrizViewport(minX, maxX, minY, maxY) {
    return [
        [(maxX - minX) / 2, 0, 0, (maxX + minX) / 2],
        [0, (maxY - minY) / 2, 0, (maxY + minY) / 2],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}