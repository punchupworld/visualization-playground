import { GUI } from "lil-gui";
import * as THREE from "three";
import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  GridHelper,
  Group,
  OrthographicCamera,
  PCFSoftShadowMap,
  PointLight,
  PointLightHelper,
  SpotLight,
  SpotLightHelper,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const setup3dScene = (scene, canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({
    alpha: true,
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const cameraOffset = 30;

  const camera = new OrthographicCamera(
    -cameraOffset,
    cameraOffset + 10,
    cameraOffset,
    -cameraOffset,
    0.1,
    1000,
  );
  const cameraHelper = new THREE.CameraHelper(camera);
  cameraHelper.visible = true;
  scene.add(cameraHelper);

  // Add debug controls
  const gui = new GUI();
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x").min(-10).max(10).step(0.01);
  cameraFolder.add(camera.position, "y").min(-10).max(10).step(0.01);
  cameraFolder.add(camera.position, "z").min(-10).max(10).step(0.01);

  scene.add(new GridHelper(100, 100));
  camera.position.set(-10, 10, 10);
  camera.zoom = 1;

  // camera.lookAt(20, 1, -10);

  // camera.updateProjectionMatrix();
  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.target.set(0, 11, 0);
  // controls.listenToKeyEvents(window);
  // controls.screenSpacePanning = true;
  // controls.enablePan = true;
  gui.show(false);
  controls.autoRotate = true;
  // controls.keys = {
  //   LEFT: "ArrowLeft", //left arrow
  //   UP: "ArrowUp", // up arrow
  //   RIGHT: "ArrowRight", // right arrow
  //   BOTTOM: "ArrowDown", // down arrow
  // };

  return { scene, renderer, camera, controls, gui };
};

export const setupLighting = (scene, renderer, gui) => {
  // main group
  const mainGroup = new Group();
  mainGroup.position.y = 0.5;

  scene.add(mainGroup);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  // set up ambient light
  const al = new AmbientLight(0xffffff, 1);
  mainGroup.add(al);

  // set up ambient light gui
  const alFolder = gui.addFolder("ambient light");
  const alSettings = { color: al.color.getHex() };
  alFolder.add(al, "visible");
  alFolder.add(al, "intensity", 0, 1, 0.1);
  alFolder
    .addColor(alSettings, "color")
    .onChange((value) => al.color.set(value));
  alFolder.add(al.position, "x", -2, 4, 0.5);
  alFolder.add(al.position, "y", -2, 4, 0.5);
  alFolder.add(al.position, "z", -2, 4, 0.5);

  alFolder.open();

  // setup directional light + helper
  const dl = new DirectionalLight(0xffffff, 0.5);
  // use this for YouTube thumbnail
  dl.position.set(0, 2, 2);
  // dl.position.set(0, 2, 0);
  dl.castShadow = true;
  const dlHelper = new DirectionalLightHelper(dl, 3);
  mainGroup.add(dl);
  // mainGroup.add(dlHelper);

  // set up directional light gui
  const dlSettings = {
    visible: true,
    color: dl.color.getHex(),
  };
  const dlFolder = gui.addFolder("directional light");
  dlFolder.add(dlSettings, "visible").onChange((value) => {
    dl.visible = value;
    dlHelper.visible = value;
  });
  dlFolder.add(dl, "intensity", 0, 1, 0.25);
  dlFolder.add(dl.position, "y", 1, 4, 0.5);
  dlFolder.add(dl, "castShadow");
  dlFolder
    .addColor(dlSettings, "color")
    .onChange((value) => dl.color.set(value));
  dlFolder.open();

  // set up spot light + helper
  const sl = new SpotLight(0x00ff00, 1, 8, Math.PI / 8, 0);
  sl.position.set(0, 2, 2);
  sl.shadow.mapSize.height = 1024;
  sl.shadow.mapSize.width = 1024;

  const slHelper = new SpotLightHelper(sl);
  // mainGroup.add(sl, slHelper);

  // set up spot light gui
  const slSettings = {
    visible: true,
  };
  const slFolder = gui.addFolder("spot light");
  slFolder.add(slSettings, "visible").onChange((value) => {
    sl.visible = value;
    slHelper.visible = value;
  });
  slFolder.add(sl, "intensity", 0, 4, 0.5);
  slFolder.add(sl, "angle", Math.PI / 16, Math.PI / 2, Math.PI / 16);
  slFolder.add(sl, "castShadow");
  slFolder.add(sl.position, "x", -100, 100, 0.5);
  slFolder.add(sl.position, "y", -100, 100, 0.5);
  slFolder.add(sl.position, "z", -100, 100, 0.5);
  slFolder.open();

  const pl = new PointLight(0xffffff, 1, 8, 2);
  pl.position.set(2, 2, 2);
  const plHelper = new PointLightHelper(pl, 0.5);
  // mainGroup.add(pl, plHelper);

  // set up point light gui
  const plSettings = {
    visible: true,
    color: pl.color.getHex(),
  };
  const plFolder = gui.addFolder("point light");
  plFolder.add(plSettings, "visible").onChange((value) => {
    pl.visible = value;
    plHelper.visible = value;
  });
  plFolder.add(pl, "intensity", 0, 2, 0.25);
  plFolder.add(pl.position, "x", -2, 4, 0.5);
  plFolder.add(pl.position, "y", -2, 4, 0.5);
  plFolder.add(pl.position, "z", -2, 4, 0.5);
  plFolder.add(pl, "castShadow");
  plFolder
    .addColor(plSettings, "color")
    .onChange((value) => pl.color.set(value));
  plFolder.open();
};
