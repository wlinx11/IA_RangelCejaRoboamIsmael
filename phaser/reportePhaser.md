# Reporte Phaser

## Modificaciones al código original

Tenemos el codigo del juego "phaser" que es un avatar que debe esquivar unas balas que le lanza un alien, este juego tiene la capacidad de aprender con las entradas del jugador y luego tratar de replicarlas. El objetivo de este proyecto es modificar el juego para que se agreguen 3 balas que apunten al avatar, y que este avatar tenga mas opciones de movimiento para esquivarlas, una bala le caera encima y la otra se disparara desde la esquina superior derecha del escenario.

### Agregar las nuevas físicas de las balas y movimientos del personaje

Para agregar las nuevas balas y naves enemigas, reutilice los assets existentes en el juego original.

player = juego.add.sprite(50, h, 'mono');
nave2 = juego.add.sprite(20, 10, 'nave');
bola2 = juego.add.sprite(60, 70, 'bola');
nave3 = juego.add.sprite(w - 200, 10, 'nave');
bola3 = juego.add.sprite(600, 100, 'bola');

y aparte, nuestro juego necesitara mas acciones que solo saltos, ahora podremos desplazarnos de izquierda a derecha para esquivar la bola.

moverDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
moverAtras = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

### redes neuronales

tambien modifique la red neuronal, como el juego ahora tendra mas movimientos y balas, entonces tendra mas entradas y salidas que seran

'input': [desplazamientobola, velocidadbola, desplazamientobola2, desplazamientobola3x, desplazamientobola3y],
            'output': [estatusAire, estatuSuelo, estado_derecha, destado_izquierda, estado_atras, estado_inicial]

Network = new synaptic.Architect.Perceptron(5, 12, 6);
Network_Entramiento = new synaptic.Trainer(Network);

en las entradas tenemos desplazamientobola para cada bola, que sera la distancia que existe entre el avatar y la bola, la bola 3 tiene especificamente una para su coordenada X y otra para su coordenada Y, la unica bola que tendra velocidades diferentes es la bola original puesto que las otras 2 se veran afectadas por la gravedad al caer de las librerias de phaser, por eso estoy considerando la velocidad de la bola original, mientras que en las salidas estoy considerando las posiciones que puede tomar el avatar que vendrian a ser sus movimientos izquierda/derecha, su salto, su su altura y su posicion inicial.

tambien ajuste las iteraciones del juego a 10,000 para que analice todos los datos de entrenamiento las suficientes veces para que llegue a buenas conclusiones pero no tarde tanto procesando la informacion y la tasa de aprendizaje sera de 0.0003 para que cada que una interacion pase a otra, no tenga datos muy distintos entre si causando problemas entre ellos.

function enRedNeural() {
    Network_Entramiento.train(datosEntrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true });
}

finalmente agregue funciones para la logica del entrenamiento y sus decisiones, ahora que existen mas movimientos, existen mas posibilidades y complejidades al procesar su entrenamiento y aprendizaje.

function datosDeEntrenamiento(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    Network_Salida = Network.activate(param_entrada);
    var aire = Math.round(Network_Salida[0] * 100);
    var piso = Math.round(Network_Salida[1] * 100);
    var der = Math.round(Network_Salida[2] * 100);
    var izq = Math.round(Network_Salida[3] * 100);
    var atras = Math.round(Network_Salida[4] * 100);
    var ini = Math.round(Network_Salida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return Network_Salida[0] >= Network_Salida[1];
}

function datosDeEntrenamiento2(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    Network_Salida = Network.activate(param_entrada);
    var aire = Math.round(Network_Salida[0] * 100);
    var piso = Math.round(Network_Salida[1] * 100);
    var der = Math.round(Network_Salida[2] * 100);
    var izq = Math.round(Network_Salida[3] * 100);
    var atras = Math.round(Network_Salida[4] * 100);
    var ini = Math.round(Network_Salida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return Network_Salida[2] >= Network_Salida[3];
}

function datosDeEntrenamiento3(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    Network_Salida = Network.activate(param_entrada);
    var aire = Math.round(Network_Salida[0] * 100);
    var piso = Math.round(Network_Salida[1] * 100);
    var der = Math.round(Network_Salida[2] * 100);
    var izq = Math.round(Network_Salida[3] * 100);
    var atras = Math.round(Network_Salida[4] * 100);
    var ini = Math.round(Network_Salida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return Network_Salida[4] >= Network_Salida[5];
}
