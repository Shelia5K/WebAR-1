import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
import {loadVideo} from "../../../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	var startButton;

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "Marker/targets.mind",
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		const video = await loadVideo('sea.mp4');

		const texture = new THREE.VideoTexture( video );

		const geometry = new THREE.PlaneGeometry( 1, 720/1280 );
		const material = new THREE.MeshBasicMaterial( {map: texture} );
		const plane = new THREE.Mesh( geometry, material );

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add( plane );

		anchor.onTargetFound = () => {
			video.play();
		}

		anchor.onTargetLost = () => {
			video.pause();
		}

		video.addEventListener("play", () => {
			video.currentTime = 0;
		});


		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
