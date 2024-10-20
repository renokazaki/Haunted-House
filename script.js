import * as THREE from 'three'
import { Timer } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  

// シーンのセットアップ
const scene = new THREE.Scene();

// カメラのセットアップ
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 3000);
camera.position.z = 8;
camera.position.y = 4;
camera.position.x = 7;
scene.add(camera)

/**
 * Texturesロード用インスタンス
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorTexture = textureLoader.load('./public/floor.webp')
const floorAlphaTexture =  textureLoader.load('./public/alpha.webp')


//walls
const wallsTexture = textureLoader.load('./public/brick2.webp')
//door
const doortexture = textureLoader.load('./public/color.webp')
//roof
const rooftexture = textureLoader.load('./public/roof.webp')
//bash
const bushtexture = textureLoader.load('./public/grass2.webp')


//grave
const gravesTexture = textureLoader.load('./public/grave.webp')

//以下オブジェクトの生成
//土台==================================
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map:floorTexture ,
        alphaMap: floorAlphaTexture,
        transparent: true,
        aoMap: floorTexture,
        roughnessMap: floorTexture,
        metalnessMap: floorTexture,
        normalMap: floorTexture,
        displacementMap: floorTexture


    })
)
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

//=========================================

//家のオブジェクトグループ
// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({map:wallsTexture,    aoMap: gravesTexture,
        roughnessMap: wallsTexture,
        metalnessMap: wallsTexture,
        normalMap: wallsTexture})
)
walls.position.y += 1.25
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({map :rooftexture})
)
roof.position.y = 2.5 + 0.75
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 2.2),
    new THREE.MeshStandardMaterial({ map: doortexture })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// 複数の茂みを生成
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({map:bushtexture,
    aoMap: gravesTexture,

})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.4, 0.4, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.5, 0.5, 0.5)
bush2.position.set(0.8, 0.4, -2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.4, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.35, 0.35, 0.35)
bush4.position.set(- 0.8, 0.3, -2.2)

house.add(bush1, bush2, bush3, bush4)

//家のグループここまで==================================================================
// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({map:gravesTexture,
    aoMap: bushtexture,
    roughnessMap: bushtexture,
    normalMap: bushtexture
})

const graves = new THREE.Group()
scene.add(graves)

for(let i = 0; i < 30; i++)
    {
 // Coordinates
 const angle = Math.random() * Math.PI * 2
 const radius = 5 + Math.random() * 4
 const x = Math.sin(angle)*radius
 const z = Math.cos(angle)*radius

    // Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.6
    grave.position.z = z
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    // Add to the graves group
    graves.add(grave)
    }




//オブジェクトの生成ここまで============================================

//Light==================================================
//AmbientLight
const ambientLight = new THREE.AmbientLight('#86cdff', 1)
scene.add(ambientLight)
//Directionallight
const derectionalLight = new THREE.DirectionalLight('#86cdff', 4)
derectionalLight.position.set(3,2,-8)
scene.add(derectionalLight)
// Door light
const doorLight = new THREE.PointLight('#ff7d46', 0.8)
doorLight.position.set(0, 2.4, 2.3)
house.add(doorLight)


/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 0.5)
const ghost2 = new THREE.PointLight('#ff0088', 0.5)
const ghost3 = new THREE.PointLight('#ff0000', 0.5)
scene.add(ghost1, ghost2, ghost3)


//==========================================

// 軸ヘルパーの追加
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height)
//======================================================--
/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and receive
derectionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true


for(const grave of graves.children)
    {
        grave.castShadow = true
        grave.receiveShadow = true
    }

//背景=================================================-
/**
 * Sky
 */
const sky = new Sky()
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
sky.scale.set(100, 100, 100)

scene.add(sky)

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#ff0000', 1, 13)
scene.fog = new THREE.FogExp2('#04343f', 0.08)

//背景ここまで================================================-
// カメラコントロール
const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// アニメーションループ
const timer = new Timer();
const tick = () => {
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = - elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)
 
 
    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)
 
    // レンダリング
  renderer.render(scene, camera);

  // 次のフレームを要求
  requestAnimationFrame(tick);
};

tick();


window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
           // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
     // Update renderer
     renderer.setSize(sizes.width, sizes.height)
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    })

// フルスクリーン対応
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  
    if (!fullscreenElement) {
      canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  });