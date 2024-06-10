import * as THREE from "three";

window.addEventListener("load", function () {
  init();
});

// 앞으로 실행 될 모든 코드는 init 안에 작성됨
function init() {
  // 렌더러 인스턴스 생성

  const renderer = new THREE.WebGLRenderer({
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

  // 3D 오브젝트를 장면에 추가 후 따로 위치를 설정하지 않으면 3차원 공간의 원점에 놓이게 되므로 카메라 방향 위치를 z 축 방향 뒤로 설정
  camera.position.z = 5;

  render();

  // 애니메이션 적용
  function render() {
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
