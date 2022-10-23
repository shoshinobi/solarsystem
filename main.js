//import './style.css'
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


const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(-90, 140, 140)
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

/*-------------------------------- Lights ------------------------------*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
scene.add(ambientLight) 

const sunLight = new THREE.PointLight(0xffffff, 2, 300)
scene.add(sunLight)

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

// Sun
const sunGeo = new THREE.SphereGeometry(16, 32 , 32)
const sunMat = new THREE.MeshBasicMaterial({map: sunTex})
const sun = new THREE.Mesh(sunGeo, sunMat)
scene.add(sun)

// Mars
const marsOrbit = new THREE.Object3D()
scene.add(marsOrbit)
const marsGeo = new THREE.SphereGeometry(3, 32 , 32)
const marsMat = new THREE.MeshStandardMaterial({map: marsTex})
const mars = new THREE.Mesh(marsGeo, marsMat)
marsOrbit.add(mars)
mars.position.set(40, 0, 0)

// Saturn
const saturnOrbit = new THREE.Object3D()
scene.add(saturnOrbit)
const saturnGeo = new THREE.SphereGeometry(8, 32 , 32)
const saturnMat = new THREE.MeshStandardMaterial({map: saturnTex})
const saturn = new THREE.Mesh(saturnGeo, saturnMat)
saturnOrbit.add(saturn)
saturn.position.set(140, 0, 0)

// Saturn ring
const saturnRingGeo = new THREE.RingGeometry(10, 20, 32)
const saturnRingMat = new THREE.MeshStandardMaterial({map: saturnRingTex, side: THREE.DoubleSide})
const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat)
saturnRing.rotation.x = Math.PI * 0.5
saturn.add(saturnRing)







/*================================ UPDATE ==============================*/

const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    // Animation
    sun.rotation.y = elapsedTime * 0.1
    marsOrbit.rotation.y = elapsedTime * 0.3
    mars.rotation.y = elapsedTime * 0.4
    saturnOrbit.rotation.y = elapsedTime * 0.05
    saturn.rotation.y = elapsedTime * -0.3
    
    
    
    
    
    
    
    
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
