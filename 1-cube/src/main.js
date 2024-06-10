import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

window.addEventListener("load", function () {
  init();
});

// 앞으로 실행 될 모든 코드는 init 안에 작성됨
function init() {
  // 렌더러 인스턴스 생성

  const options = {
    color: 0x00ffff,
  };
  const renderer = new THREE.WebGLRenderer({
    // alpha: true,
    antialias: true,
  });

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

  const controls = new OrbitControls(camera, renderer.domElement);

  const cubeGeometry = new THREE.IcosahedronGeometry(1);

  // material 추가
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff, emissive: 0x11111 });

  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  const skeletonGeoMetry = new THREE.IcosahedronGeometry(2);
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    color: 0xaaaaa,
  });

  const skeleton = new THREE.Mesh(skeletonGeoMetry, skeletonMaterial);

  scene.add(cube, skeleton);

  // 3D 오브젝트를 장면에 추가 후 따로 위치를 설정하지 않으면 3차원 공간의 원점에 놓이게 되므로 카메라 방향 위치를 z 축 방향 뒤로 설정
  camera.position.z = 5;

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();

  // 애니메이션 적용
  function render() {
    const elapsedTime = clock.getElapsedTime();
    cube.rotation.x = elapsedTime;
    cube.rotation.y = elapsedTime;

    skeleton.rotation.x = elapsedTime * 1.5;
    skeleton.rotation.y = elapsedTime * 1.5;

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

  const gui = new GUI();
  gui.add(cube.position, "y").min(-3).max(3).step(0.1);
  gui.add(cube, "visible");

  gui.addColor(options, "color").onChange((value) => cube.material.color.set(value));
}
