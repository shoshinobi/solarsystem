import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { GUI } from 'lil-gui'




/*================================ START ==============================*/

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/*-------------------------------- Loders ------------------------------*/
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const loaderBar = document.getElementById('loader__bar')
const loaderContainer = document.querySelector('.loader__container')
loadingManager.onProgress = (url, loaded, toLoad) => {
  loaderBar.value = (loaded / toLoad) * 100
}
loadingManager.onLoad = () => {
  loaderContainer.style.display = 'none'
}

// Textures
const starsTex = textureLoader.load('./tex/stars.jpg')
const sunTex = textureLoader.load('./tex/sun.jpg')
const earthTex = textureLoader.load('./tex/earth.jpg')
const uranusTex = textureLoader.load('./tex/uranus.jpg')
const uranusRingTex = textureLoader.load('./tex/uranus ring.png')
const saturnTex = textureLoader.load('./tex/saturn.jpg')
const saturnRingTex = textureLoader.load('./tex/saturn ring.png')
const marsTex = textureLoader.load('./tex/mars.jpg')
const jupiterTex = textureLoader.load('./tex/jupiter.jpg')



/*-------------------------------- Canvas Resize ------------------------------*/

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*-------------------------------- Camera ------------------------------*/


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
camera.position.y = 1
scene.add(camera)

/*-------------------------------- Controls ------------------------------*/

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*-------------------------------- Renderer ------------------------------*/

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/*-------------------------------- Lights ------------------------------*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight) 

/*-------------------------------- Background ------------------------------*/

const cubeTextureLoader = new THREE.CubeTextureLoader();
const backgroundTexture = cubeTextureLoader.load([
    './tex/stars.jpg',
    './tex/stars.jpg',
    './tex/stars.jpg',
    './tex/stars.jpg',
    './tex/stars.jpg',
    './tex/stars.jpg',
])
scene.background = backgroundTexture



/*================================ Characters ==============================*/

const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0000 }))
scene.add(planet)




/*================================ UPDATE ==============================*/

const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()

// add grid helper
const gridHelper = new THREE.GridHelper(10, 10)
scene.add(gridHelper)

// add axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
