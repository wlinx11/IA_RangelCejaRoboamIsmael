# Reporte Phaser rebota

## Que cambia en el juego

Este juego será distinto al Phaser de las 3 balas disparadas. En este, nuestro avatar tendrá un movimiento más libre por todos los ejes del escenario, y la pelota no será disparada desde un alien ni seguirá un trayecto predeterminado. En su lugar, será disparada con un ángulo al azar y rebotará por todo el escenario cada vez que colisione con una de las paredes del juego.

### Agregar las nuevas físicas de la pelota y movimientos del personaje

Para agregar las nuevas físicas y mejorar el control del personaje, reutilicé los assets existentes en el juego original.

jugador = juego.add.sprite(w / 2, h / 2, 'mono');
jugador = juego.add.sprite(w / 2, h / 2, 'mono');
juego.physics.enable(jugador);
jugador.body.collideWorldBounds = true;
jugador.animations.add('corre', [8, 9, 10, 11]);
jugador.animations.play('corre', 10, true);

bala = juego.add.sprite(0, 0, 'bala');
juego.physics.enable(bala);
bala.body.collideWorldBounds = true;
bala.body.bounce.set(1);
setRandomBalaVelocity();

function setRandomBalaVelocity() {
var baseSpeed = 450;
var angle = juego.rnd.angle();
bala.body.velocity.set(
Math.cos(angle) * baseSpeed,
Math.sin(angle) * baseSpeed,
    );
}

Con esta funcion y asignaciones para la bala le permitimos tener colisiones con el mundo, una generacion en un angulo al azar y velocidad al azar.

Y como mencione antes, una de las nuevas caracteristicas del personaje es su libertad de movimiento, asi que ahora recibira la cruceta para dar las direcciones.

cursores = juego.input.keyboard.createCursorKeys();

### Redes neuronales

La red neuronal tendra 5 entradas, una capa oculta de 10 neuronas y 4 salidas, las entradas seran "dx" y "dy" que son las distancias entre la posicion de la pelota y el jugador en los ejes X y y. "distancia" que es la distancia euclidiana entre la pelota y el jugador y "PX" y "PY" que son las coordenadas del avatar. Y las salidas se limitan a simplemente los movimientos del avatar que son arriba, abajo, izquierda y derecha.

Network = new synaptic.Architect.Perceptron(5, 10, 4);
Network_Entramiento = new synaptic.Trainer(Network);

'input': [dx, dy, distancia, PX, PY],
'output': [moveLeft, moveRight, moveUp, moveDown]

Mantuve la tasa de aprendizaje y las iteraciones con los mismos valores que el otro juego por que me me funcioaron bien, son muchos ciclos para medir los datos no cambios no tan bruscos entre ellos.

function enRedNeural() {
    Network_Entramiento.train(entrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true });
}

añadi funciones para la logica de entrenamiento y las desiciones basadas en las salidas de la red neuronal ya que son mas movimientos y posibilidades como los registros de datos de entrenamiento que recopilan datos cuando se esta jugando manualmente el juego.

function registrarDatosEntrenamiento(moveLeft, moveRight, moveUp, moveDown) {
    if (!modo_automatico && bala.position.x > 0) {
        var dx = bala.x - jugador.x;
        var dy = bala.y - jugador.y;
        var distancia = Math.sqrt(dx * dx + dy * dy);

        var movimiento = moveLeft || moveRight || moveUp || moveDown;

        if (movimiento) {
            PX = jugador.x;
            PY = jugador.y;

            entrenamiento.push({
                'input': [dx, dy, distancia, PX, PY],
                'output': [moveLeft, moveRight, moveUp, moveDown]
            });

            console.log('Datos de Entrenamiento Registrados');
        }
    }
}

y la funcion de manejar movimiento automatico, que sera la que tomara las decisiones basadas en la red neuronal entrenada.
function manejarMovimientoAutomatico() {
    var dx = bala.x - jugador.x;
    var dy = bala.y - jugador.y;
    var distancia = Math.sqrt(dx * dx + dy * dy);
    var input = [dx, dy, distancia, jugador.x, jugador.y];

    Network_Salida = Network.activate(input);

    var moveLeft = Network_Salida[0] > 0.5 ? 1 : 0;
    var moveRight = Network_Salida[1] > 0.5 ? 1 : 0;
    var moveUp = Network_Salida[2] > 0.5 ? 1 : 0;
    var moveDown = Network_Salida[3] > 0.5 ? 1 : 0;

    jugador.body.velocity.x = (moveRight - moveLeft) * 300;
    jugador.body.velocity.y = (moveDown - moveUp) * 300;

    console.log('-------------------------------------------');
    console.log('Auto - Movimiento:');
    console.log('Izquierda:', moveLeft);
    console.log('Derecha:', moveRight);
    console.log('Arriba:', moveUp);
    console.log('Abajo:', moveDown);
}
