// AQUI EMPIEZA LO DE DIBUJAR EL JUEGOOOOOOOO
var divcont = document.getElementById("game-container");
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = divcont.clientWidth;
canvas.height = divcont.clientHeight;
let users = document.getElementById('user');
let color = document.getElementById('color');

var cols_const = 30;
var rows_const = 30;
let cols = Math.floor(canvas.width / cols_const);
let rows = Math.floor(canvas.height / rows_const);

// ctx.strokeStyle = '#0c72a8';

// for(let i = 0; i < cols + 1; i++){
//     ctx.beginPath();
//     ctx.moveTo(i * cols_const, 0);
//     ctx.lineTo(i * cols_const, canvas.height);
//     ctx.stroke();
// }
// for(let i = 0; i < rows + 1; i++){
//     ctx.beginPath();
//     ctx.moveTo(0, i * rows_const);
//     ctx.lineTo(canvas.width, i * rows_const);
//     ctx.stroke();
// }

// AQUI SE ACABA LO DE DIBUJAR EL JUEGOOOOOOOO

// mouse events listeners
canvas.addEventListener('mousemove', onMouseMove, false);

// mouse events functions

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function onMouseMove(event){
    var mousePos = getMousePos(canvas, event);    
    chatSocket.send(JSON.stringify({
        'x_pos': Math.floor(mousePos.x),
        'y_pos': Math.floor(mousePos.y),
        'user': users.innerText,
        'color': color.innerText
    }));
}