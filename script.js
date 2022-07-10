const grid = document.querySelector('.grid')
const muestraResultado = document.querySelector('.puntos')
let naveUsuario = 202
let width = 15
let direction = 1
let haciaDerecha = true
let quitarInvasores = []
let resultado = 0

let entrada = prompt('Ingresa tu nombre');
let usuario = document.querySelector('.usuario')
Swal.fire(`Bienvenido ${entrada}`)
usuario.innerHTML = `<h2> Buena suerte ${entrada}</h2>`;
localStorage.setItem("jugador", entrada);
let mensaje = localStorage.getItem('jugador');
console.log(mensaje); 


for (let i = 0; i<225; i++) {
    const cuadrado = document.createElement ('div')
    grid.appendChild(cuadrado)
}

// Array de invasores 

const cuadrados = Array.from(document.querySelectorAll('.grid div'))
const invasores = [ 
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw (){
    for (let i=0; i < invasores.length; i++) {
        if(!quitarInvasores.includes(i)) {
        cuadrados[invasores[i]].classList.add('invader')
       }
    }
}
draw ()

function remove(){
    for (let i=0; i < invasores.length; i++) {
        cuadrados [invasores[i]].classList.remove('invader')
    }
}

// Nave del jugador y movimiento. Un evento que mediante un switch permite al jugador mover la nave de izquierda a derecha con las flechas del teclado.

cuadrados[naveUsuario].classList.add ('ship')

function moverNave (e) {
    cuadrados[naveUsuario].classList.remove ('ship')
    switch(e.key){
        case 'ArrowLeft':
            if (naveUsuario % width !== 0) naveUsuario -=1
        break
        case 'ArrowRight' :
            if (naveUsuario % width < width -1) naveUsuario +=1
        break
    }
    cuadrados [naveUsuario].classList.add('ship')
}
document.addEventListener('keydown', moverNave)

// Movimiento de los invasores. Comienzan a moverse de derecha a izquierda hasta que el array de invasores toca el borde.
// Luego, baja un línea y se desplaza hacia el lado contrario repitiendo el proceso.

function moverInvasor () {
const bordeIzquierdo = invasores [0] % width === 0 
const bordeDerecho = invasores [invasores.length - 1] % width  === width -1
remove ()

if (bordeDerecho && haciaDerecha) {
    for (let i = 0; i < invasores.length; i++) {
        invasores[i] += width -1
        direction= -1
        haciaDerecha = false
    }
}

if (bordeIzquierdo && !haciaDerecha) {
    for (let i = 0; i < invasores.length; i++){
    invasores[i] += width
    direction = 1
    haciaDerecha = true
    }
}

for (let i = 0; i < invasores.length; i++) {
    invasores[i] += direction
}
draw()
             
// Final - el juego acaba si el jugador mata a todos los invasores (Victoria) o estos llegan hasta abajo (Derrota).
// adicionalmente, a medida de que el jugador mate invasores irá sumando puntos que se guardaran en el local storage.

if (cuadrados[naveUsuario].classList.contains('invader', 'ship')){
    muestraResultado.innerHTML = 'GAME OVER'
    clearInterval(invadersId)
}

for (let i = 0; i < invasores.length; i++){
if(invasores[i] > cuadrados.length) {
  muestraResultado.innerHTML = 'GAME OVER'
  clearInterval(invadersId)
  }
 }
 if(quitarInvasores.length === invasores.length) {
    muestraResultado.innerHTML = 'GANASTE'
    clearInterval(invadersId)
}
localStorage.setItem("puntuacion", resultado);
let puntos = localStorage.getItem('puntuacion');
console.log(puntos);
}
invadersId = setInterval (moverInvasor, 300)

// Laser del usuario. Si el laser pasa por una casilla del grid que tiene un invasor, desaparece el invasor, el laser y agrega un efecto de "explosion"

function disparo (e) {
    let laserId
    let laserNave = naveUsuario
    function moverLaser(){
        cuadrados[laserNave].classList.remove('laser')
        laserNave -= width
        cuadrados[laserNave].classList.add('laser')

        if(cuadrados[laserNave].classList.contains('invader')) {
          cuadrados[laserNave].classList.remove('laser')
          cuadrados[laserNave].classList.remove('invader')
          cuadrados[laserNave].classList.add('explosion')

          setTimeout(()=> cuadrados[laserNave].classList.remove('explosion'), 300)
          clearInterval(laserId)

          const quitarInvasor = invasores.indexOf(laserNave)
          quitarInvasores.push(quitarInvasor)
          resultado++
          muestraResultado.innerHTML = resultado
          console.log(quitarInvasores)
          
        }
    }
    switch (e.key) {
        case 'ArrowUp':
            laserId = setInterval(moverLaser, 100)
    }

}

document.addEventListener('keydown', disparo)