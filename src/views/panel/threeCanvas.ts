import { TweenEx } from '../utils/TweenEx';
import { ViewConst } from './const';
declare let THREE
declare let TWEEN
export const threeScene = new THREE.Scene();
export let initThree = () => {
    var scene, camera, renderer;
    var geometry, material, mesh;
    init();
    animate(0);

    function init() {
        scene = threeScene

        camera = new THREE.PerspectiveCamera(75, ViewConst.STAGE_WIDTH / ViewConst.STAGE_HEIGHT, 1, 10000);
        camera.position.z = 700;

        geometry = new THREE.BoxGeometry(200, 200, 200);
        material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        var geometry = new THREE.PlaneGeometry(1920, 1080, 32);
        let texture = THREE.ImageUtils.loadTexture('/img/panel/poker/bg.png')
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

        var plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
        console.log('mesh',mesh);
        // TweenEx.to(mesh, 5, {  })
        //     .update(_ => {
        //         mesh.rotation.x += 0.01
        //     })
        //     .start()
        TweenEx.delayedCall(3000, _ => {
            console.log('delay');
        })
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
    }

    function animate(time) {
        TWEEN.update(time)
        requestAnimationFrame(animate);
        // mesh.rotation.x += 0.01;
        // mesh.rotation.y += 0.02;
        renderer.render(scene, camera);
    }
}