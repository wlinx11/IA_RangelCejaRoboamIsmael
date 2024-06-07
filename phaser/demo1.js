var w = 800;
var h = 400;
var player;
var fondo;

var bola, bolaD = false, nave;
var bola2, bolaD2 = false, nave2;
var bola3, bolaD3 = false, nave3;

var salto;

var moverDerecha;
var moverAtras;

var menu;

var velocidadbola;
var desplazamientobola;

var velocidadbola2;
var desplazamientobola2;

var velocidadbola3x;
var desplazamientobola3x;

var velocidadbola3y;
var desplazamientobola3y;

var estatusAire;
var estatuSuelo;

var Network
var Network_Entramiento
var Network_Salida
var datosEntrenamiento = [];
var modo_automatico = false, eCompleto = false;

var desplazamiento_derecha_tiempo;
var desplazamiento_atras_tiempo;

var estado_derecha;
var destado_izquierda;
var estado_atras;
var estado_inicial;

var bolas;

var playerGolpeado;

var tiempoB3;
var tiempoB2;


var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    juego.load.image('fondo', 'assets/game/fondo.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48);
    juego.load.image('nave', 'assets/game/ufo.png');
    juego.load.image('bola', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');
}

function create() {
    
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 800;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w - 100, h - 70, 'nave');
    bola = juego.add.sprite(w - 100, h, 'bola');
    player = juego.add.sprite(50, h, 'mono');

    nave2 = juego.add.sprite(20, 10, 'nave');
    bola2 = juego.add.sprite(60, 70, 'bola');
    nave3 = juego.add.sprite(w - 200, 10, 'nave');
    bola3 = juego.add.sprite(600, 100, 'bola');

    juego.physics.enable(player);
    player.body.collideWorldBounds = true;
    var corre = player.animations.add('corre', [8, 9, 10, 11]);
    player.animations.play('corre', 10, true);

    juego.physics.enable(bola);
    bola.body.collideWorldBounds = true;

    juego.physics.enable(bola2);
    bola2.body.collideWorldBounds = true;
    juego.physics.enable(bola3);
    bola3.body.collideWorldBounds = true;

    pausa_lateral = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausa_lateral.inputEnabled = true;
    pausa_lateral.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    salto = juego.input.keyboard.addKeys({
        'space': Phaser.Keyboard.SPACEBAR,
        'up': Phaser.Keyboard.UP
    });
    
    moverDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    moverAtras = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    Network = new synaptic.Architect.Perceptron(5, 12, 6);
    Network_Entramiento = new synaptic.Trainer(Network);

    estado_derecha = 0;
    destado_izquierda = 1;
    estado_inicial = 1;
    estado_atras = 0;

    desplazamiento_derecha_tiempo = 0;
    desplazamiento_atras_tiempo = 0;

    bolas = juego.add.group();
    bolas.add(bola);
    bolas.add(bola2);
    bolas.add(bola3);

    playerGolpeado = false;
    regresandoDer = false;
    regresandoAtras = false;

    tiempoB3 = 0;
    tiempoB2 = 0;
}

function enRedNeural() {
    Network_Entramiento.train(datosEntrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true });
}

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

function pausa() {
    juego.paused = true;
    menu = juego.add.sprite(w / 2, h / 2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event) {
    if (juego.paused) {
        var menu_x1 = w / 2 - 270 / 2, menu_x2 = w / 2 + 270 / 2,
            menu_y1 = h / 2 - 180 / 2, menu_y2 = h / 2 + 180 / 2;
        var mouse_x = event.x,
            mouse_y = event.y;
        if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
            if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 && mouse_y <= menu_y1 + 90) {
                eCompleto = false;
                datosEntrenamiento = [];
                modo_automatico = false;
                juego.time.reset(); // Reinicia el temporizador del juego
            } else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 + 90 && mouse_y <= menu_y2) {
                if (!eCompleto) {
                    console.log("", "Entrenamiento " + datosEntrenamiento.length + " valores");
                    enRedNeural();
                    eCompleto = true;
                    juego.time.reset(); // Reinicia el temporizador del juego
                }
                modo_automatico = true;
            }
            menu.destroy();
            resetVariables();
            bolas.forEach(function (bola) {
                bola.body.checkCollision.none = false;
            });
            juego.paused = false;
            playerGolpeado = false;
            bolaD2 = false;
            bolaD3 = false;
        }
    }
}

function resetVariables() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    bola.body.velocity.x = 0;
    bola.position.x = w - 100;
    player.position.x = 50;
    bolaD = false;

    bola2.body.velocity.y = 0;
    bola2.position.y = 70;
    bolaD2 = false;
    bola3.body.velocity.y = 0;
    bola3.body.velocity.x = 0;
    bola3.position.x = 600;
    bola3.position.y = 100;
    bolaD3 = false;
    estado_derecha = 0;
    destado_izquierda = 1;
    desplazamiento_derecha_tiempo = 0;
    playerGolpeado = false;
    regresandoDer = false;

    estado_inicial = 1;
    estado_atras = 0;
    desplazamiento_atras_tiempo = 0;
    regresandoAtras = false;

    tiempoB3 = 0;
    tiempoB2 = 0;
}

function saltar() {
    player.body.velocity.y = -270;
}

function moverseDer() {
    destado_izquierda = 0;
    estado_derecha = 1;
    player.position.x = 90;
    //player.position.x = Phaser.Math.linear(50, 90, 0.7);
    estado_atras = 0;
    estado_inicial = 1;

    desplazamiento_atras_tiempo = 0;
    desplazamiento_derecha_tiempo = 0;

    regresandoAtras = false;
    regresandoDer = false;
}

function moverseAtr() {
    destado_izquierda = 1;
    estado_derecha = 0;
    player.position.x = 0;

    estado_atras = 1;
    estado_inicial = 0;

    desplazamiento_atras_tiempo = 0;
    desplazamiento_derecha_tiempo = 0;

    regresandoAtras = false;
    regresandoDer = false;
}

function update() {
    fondo.tilePosition.x -= 1;
    juego.physics.arcade.collide(bolas, player, colisionH, null, this);

    estatuSuelo = 1;
    estatusAire = 0;

    if (!player.body.onFloor()) {
        estatuSuelo = 0;
        estatusAire = 1;
    }

    desplazamientobola = Math.floor(player.position.x - bola.position.x);

    desplazamientobola2 = Math.floor(player.position.y - bola2.position.y);

    desplazamientobola3x = Math.floor(player.position.x - bola3.position.x);
    desplazamientobola3y = Math.floor(player.position.y - bola3.position.y);

    if (modo_automatico == false && moverDerecha.isDown && estado_derecha == 0) {
        moverseDer();
    }
    if (modo_automatico == false && moverAtras.isDown && estado_atras == 0) {
        moverseAtr();
    }
    if (modo_automatico == true && bola2.position.y > 250 && (estado_derecha == 0)) {
        if (datosDeEntrenamiento2([desplazamientobola, velocidadbola, desplazamientobola2, desplazamientobola3x, desplazamientobola3y])) {
            moverseDer();
        }
    }
    if (modo_automatico == true && (bola3.position.y > 200 || bola3.position.x < 400) && (estado_atras == 0)) {
        if (datosDeEntrenamiento3([desplazamientobola, velocidadbola, desplazamientobola2, desplazamientobola3x, desplazamientobola3y])) {
            moverseAtr();
        }
    }
    if (modo_automatico == false && (salto.space.isDown || salto.up.isDown) && player.body.onFloor()) {
        saltar();
    }
    if (modo_automatico == true && bola.position.x > 0 && player.body.onFloor()) {
        if (datosDeEntrenamiento([desplazamientobola, velocidadbola, desplazamientobola2, desplazamientobola3x, desplazamientobola3y])) {
            saltar();
        }
    }
    if (bolaD == false) {
        disparo();
    }
    if (bolaD2 == false && tiempoB2 >= 20) {
        disparo2();
    }
    if (bolaD3 == false && tiempoB3 >= 45) {
        disparo3();
    }
    //visible false
    if (bolaD3 == false) {
        bola3.position.x = 780;
        bola3.position.y = 380;
        bola3.body.velocity.y = 0;
        bola3.body.velocity.x = 0;
        bola3.visible = true;
        tiempoB3++;
    }
    if (bolaD2 == false) {
        bola2.body.velocity.y = 0;
        bola2.body.velocity.x = 0;
        bola2.position.x = 780;
        bola2.position.y = 380;
        bola2.visible = true;
        tiempoB2++;
    }
    if (bola.position.x <= 0) {
        bola.body.velocity.x = 0;
        bola.position.x = w - 100;
        bolaD = false;
    }
    if (bola2.position.y >= 360 && bola2.position.x <= 70 && bolaD2 == true) {
        bola2.position.x = 750;
        bola2.position.y = 350;
        bola2.body.velocity.y = 0;
        bola2.body.velocity.x = 0;
        bolaD2 = false;
        tiempoB2 = 0;
        bola2.visible = true;
    }
    if (bola3.position.y >= 380 && bola3.position.x <= 70 && bolaD3 == true) {
        bola3.body.velocity.y = 0;
        bola3.body.velocity.x = 0;
        bola3.position.x = 600;
        bola3.position.y = 100;
        bolaD3 = false;
        tiempoB3 = 0;
        bola3.visible = true;
    }
    if (modo_automatico == false && bola.position.x > 0) {
        datosEntrenamiento.push({
            'input': [desplazamientobola, velocidadbola, desplazamientobola2, desplazamientobola3x, desplazamientobola3y],
            'output': [estatusAire, estatuSuelo, estado_derecha, destado_izquierda, estado_atras, estado_inicial]
        });
        console.log("B1 vx, B2 vy, B3 vx, B3 vy: ",
            velocidadbola + " " + velocidadbola2 + " " + velocidadbola3x + " " + velocidadbola3y);

        console.log("B1 x, B2 y, B3 x, B3 y, B1 vx, B2 vy, B3 vx, B3 vy: ",
            desplazamientobola + " " + desplazamientobola2 + " " + desplazamientobola3x + " " + desplazamientobola3y);

        console.log("Estatus Aire, Estatus Derecha, Estatus Atras: ",
            estatusAire + " " + estado_derecha + " " + estado_atras + " ");
    }
}

function disparo() {
    velocidadbola = -1 * velocidadRandom(200, 300);
    bola.body.velocity.y = 0;
    bola.body.velocity.x = velocidadbola;
    bolaD = true;
}

function disparo2() {
    velocidadbola2 = 1 * velocidadRandom(0.2, 1);
    bola2.position.x = 60;
    bola2.position.y = 70;
    bola2.body.velocity.x = 0;
    bola2.body.velocity.y = velocidadbola2;
    bolaD2 = true;
    bola2.visible = true;
}


var puedeDisparar = true;

function disparo3() {
    if (!puedeDisparar) return;

    puedeDisparar = false;
    setTimeout(function() {
        puedeDisparar = true;
    }, 8000); // 1000 milisegundos de retraso, ajusta este valor según sea necesario

    var targetX = 60;
    var targetY = h;
    var dx = targetX - bola3.x;
    var dy = targetY - bola3.y;
    var angle = Math.atan2(dy, dx);
    bola3.visible = true;
    velocidadbola3y = 1 * velocidadRandom(1, 2);
    velocidadbola3x = -640;
    bola3.position.x = 600;
    bola3.position.y = 100;
    bola3.body.velocity.x = velocidadbola3x;
    bola3.body.velocity.y = Math.sin(angle) * velocidadbola3y;
    bolaD3 = true;
}

function colisionH() {
    if (!playerGolpeado) {
        bolas.forEach(function (bola) {
            bola.body.checkCollision.none = true;
        });
        pausa();
        playerGolpeado = true;
    }
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render() {
}