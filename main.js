//import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { GUI } from 'lil-gui'
// import compositor
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { CameraHelper } from 'three'





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
const mars = createPlanet(3, marsTex, 40)

const earth = createPlanet(3, earthTex, 60)
const uranus = createPlanet(3, uranusTex, 140, {innerRad: 3.5, outerRad: 4.5, tex: uranusRingTex})
const jupiter = createPlanet(10, jupiterTex, 100)

// Saturn
const saturn = createPlanet(8, saturnTex, 140, {
    innerRad: 10,
    outerRad: 20,
    tex: saturnRingTex
})


function createPlanet(size, tex, position, ring) {
    const planetOrbit = new THREE.Object3D()
    scene.add(planetOrbit)
    const planetGeo = new THREE.SphereGeometry(size, 32 , 32)
    const planetMat = new THREE.MeshStandardMaterial({map: tex})
    const planetMesh = new THREE.Mesh(planetGeo, planetMat)
    planetOrbit.add(planetMesh)
    planetMesh.position.set(position, 0, 0)
    
    if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRad, ring.outerRad, 32)
        const ringMat = new THREE.MeshStandardMaterial({map: ring.tex, side: THREE.DoubleSide})
        const ringMesh = new THREE.Mesh(ringGeo, ringMat)
        ringMesh.rotation.x = Math.PI * 0.5
        planetMesh.add(ringMesh)
    }

    return {mesh: planetMesh, orbit: planetOrbit}
}


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
    antialias: true,


})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*-------------------------------- Lights ------------------------------*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
scene.add(ambientLight) 

const sunLight = new THREE.PointLight(0xffffff, 2, 300)
scene.add(sunLight)






/*-------------------------------- Effects Compositor ------------------------------*/

const renderScene = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)

// Bloom Pass
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight))
bloomPass.strength = 0.4
bloomPass.radius = 1.75
bloomPass.threshold = 0.01
composer.addPass(bloomPass)





/*================================ UPDATE ==============================*/

const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    // Animation
    sun.rotation.y = elapsedTime * 0.1
    mars.orbit.rotation.y = elapsedTime * 0.5
    mars.mesh.rotation.y = elapsedTime * 0.4
    saturn.orbit.rotation.y = elapsedTime * 0.05
    saturn.mesh.rotation.y = elapsedTime * -0.3
    jupiter.orbit.rotation.y = elapsedTime * 0.1
    jupiter.mesh.rotation.y = elapsedTime * -0.7
    uranus.orbit.rotation.y = elapsedTime * 0.2
    uranus.mesh.rotation.y = elapsedTime * 0.3
    earth.orbit.rotation.y = elapsedTime * 0.5
    earth.mesh.rotation.y = elapsedTime * 0.3

    
    controls.update()

    //renderer.render(scene, camera)
    composer.render()
    window.requestAnimationFrame(tick)
}
tick()

// add grid helper
const gridHelper = new THREE.GridHelper(10, 10)
scene.add(gridHelper)

// add axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
