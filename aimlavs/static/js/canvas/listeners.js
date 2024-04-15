let url = `ws://${window.location.host}/ws/socket-server/`
const chatSocket = new WebSocket(url)
let cursors = new Map();
let target = {
    x: 0,
    y: 0,
    clicked: false
}
canvas.addEventListener('mousedown', onMouseDown);

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var radius = 3;
var target_radius = 10
chatSocket.onmessage = function(e){
    let data = JSON.parse(e.data)
    
    if(data.type === 'user_log'){
        console.log(data.color, data.user)
        let users = document.getElementById('user')
        let color = document.getElementById('color')
        if (users.textContent.trim() !== "") {
            console.log("otro user se conectó");
        } else {
            users.innerText += data.user
            color.innerText += data.color
        }
        
    }

    if(data.type === 'chat'){
        let messages = document.getElementById('messages')
        messages.insertAdjacentHTML('beforeend',`<div>
            <p>${data.message}</p>
            </div>`)
    }

    if(data.type === 'm_move_r'){
        let users = document.getElementById('user')
        var color = document.getElementById("color");

        cursors.set(data.color, [data.x_pos, data.y_pos, data.color]);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if(!target.clicked){
            ctx.beginPath();
            ctx.arc(target.x, target.y, target_radius, 0, Math.PI * 2, false);
            ctx.fillStyle = '#ccc';
            ctx.fill();
            ctx.closePath();
        }
        
        for (let [key, value] of cursors) {
            if(key != data.color){
                console.log('there is other cursor')
                ctx.beginPath();
                ctx.arc(value[0], value[1], radius, 0, Math.PI * 2, false);
                ctx.fillStyle = value[2]; // Fill color
                ctx.fill(); // Fill the circle with the specified color
                ctx.closePath(); // Close the path
            }
        }

        ctx.beginPath();
        ctx.arc(data.x_pos, data.y_pos, radius, 0, Math.PI * 2, false);
        ctx.fillStyle = data.color; // Fill color
        ctx.fill(); // Fill the circle with the specified color
        ctx.closePath(); // Close the path
    }

    if(data.type === 'target'){
        target.x = data.coords[0]
        target.y = data.coords[1]
        ctx.beginPath();
        ctx.arc(target.x, target.y, target_radius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#ccc'; // Fill color
        ctx.fill(); // Fill the circle with the specified color
        ctx.closePath(); // Close the path
    }
}
let form = document.getElementById('form')
form.addEventListener('submit', (e) =>{
    e.preventDefault()
    let message = e.target.message.value
    chatSocket.send(JSON.stringify({
        'message': message
    }))
    form.reset()
})

function onMouseDown(event){
    var mousePos = getMousePos(canvas, event);
    if(mousePos.x >= target.x - target_radius && mousePos.x < target.x + target_radius && mousePos.y >= target.y - target_radius && mousePos.y < target.y + target_radius){
        target.clicked = true;
    }
}