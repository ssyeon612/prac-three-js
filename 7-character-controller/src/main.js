import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

window.addEventListener("load", function () {
  init();
});

// 앞으로 실행 될 모든 코드는 init 안에 작성됨
async function init() {
  // 렌더러 인스턴스 생성

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  // 캔버스 사이즈 설정
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 렌더러 안에 있는 캔버스 요소를 돔에 추가
  document.body.appendChild(renderer.domElement);

  // 3D 컨텐르르 다룰 scene 추가
  const scene = new THREE.Scene();

  // 카메라 추가
  const camera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight, // aspect
    1, // near
    500 // far
  );

  // 3D 오브젝트를 장면에 추가 후 따로 위치를 설정하지 않으면 3차원 공간의 원점에 놓이게 되므로 카메라 방향 위치를 z 축 방향 뒤로 설정
  camera.position.set(0, 5, 20);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.minDistance = 15;
  controls.maxDistance = 25;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 3;

  const progressBarContainer = document.querySelector("#progress-bar-container");
  const progressBar = document.querySelector("#progress-bar");

  const loadingManager = new THREE.LoadingManager();

  loadingManager.onProgress = (url, loaded, total) => {
    progressBar.value = (loaded / total) * 100;
  };

  loadingManager.onLoad = () => {
    progressBarContainer.style.display = "none";
  };

  const gltfLoader = new GLTFLoader(loadingManager);

  const gltf = await gltfLoader.loadAsync("models/character.gltf");

  console.log(gltf);

  const model = gltf.scene;

  model.scale.set(0.1, 0.1, 0.1);

  model.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
    }
  });

  scene.add(model);

  camera.lookAt(model.position);

  const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 10000);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x00000 });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -7.5;
  plane.receiveShadow = true;

  scene.add(plane);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333);

  hemisphereLight.position.set(0, 20, 10);

  scene.add(hemisphereLight);

  const spotLight = new THREE.SpotLight(0xfffff, 1.5, 30, Math.PI * 0.15, 0.5, 0.5);

  spotLight.position.set(0, 20, 0);

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 8;

  scene.add(spotLight);

  const mixer = new THREE.AnimationMixer(model);

  const buttons = document.querySelector(".actions");

  let currentAction;

  const combineAnimations = gltf.animations.slice(1, 7);

  combineAnimations.forEach((animation) => {
    const button = document.createElement("button");
    button.innerText = animation.name;
    buttons.appendChild(button);
    button.addEventListener("click", () => {
      const previousAction = currentAction;
      currentAction = mixer.clipAction(animation);

      if (previousAction !== currentAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }
    });
  });

  const hasAnimation = gltf.animations.length !== 0;

  if (hasAnimation) {
    currentAction = mixer.clipAction(gltf.animations[0]);
    currentAction.play();
  }

  const clock = new THREE.Clock();

  render();

  // 애니메이션 적용
  function render() {
    const delta = clock.getDelta();

    mixer.update(delta);

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);
}
