import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadGLTF, loadAudio} from "../../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {
		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "Marker/targets.mind",
			maxTrack: 2,
			uiLoading: "yes",
			uiScanning: "yes",
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		//масив якорів
		const anchors = [
			mindarThree.addAnchor(0),
			mindarThree.addAnchor(1)
		]

		const raccoon = await loadGLTF('Model1/scene.gltf');
		
		raccoon.scene.scale.set(0.1, 0.1, 0.1);
		raccoon.scene.position.set(0, -0.4, 0);

		const bear = await loadGLTF('Model2/scene.gltf');
		
		bear.scene.scale.set(0.1, 0.1, 0.1);
		bear.scene.position.set(0, -0.4, 0);

		
		
		const audioClip = await loadAudio("m1.mp3");

		const audioListener = new THREE.AudioListener();
		camera.add(audioListener);

		audioListener.setMasterVolume( audioListener.getMasterVolume() * 20.0 );

		const sound = new THREE.PositionalAudio(audioListener);
		anchors[0].group.add(sound);
		sound.setBuffer(audioClip);
		sound.setRefDistance(100);
		sound.setLoop(true);

		anchors[0].onTargetFound = () => {
			sound.play();
		}

		anchors[0].onTargetLost = () => {
			sound.pause();
		}
		
		const audioClip2 = await loadAudio("m2.mp3");

		const audioListener2 = new THREE.AudioListener();
		camera.add(audioListener2);

		audioListener2.setMasterVolume( audioListener.getMasterVolume() * 20.0 );

		const sound2 = new THREE.PositionalAudio(audioListener);
		anchors[1].group.add(sound2);
		sound2.setBuffer(audioClip2);
		sound2.setRefDistance(100);
		sound2.setLoop(true);

		anchors[1].onTargetFound = () => {
			sound2.play();
		}

		anchors[1].onTargetLost = () => {
			sound2.pause();
		}
		
		anchors[0].group.add(raccoon.scene);
		anchors[1].group.add(bear.scene);


		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		//4. Запуск MindAR 
		await mindarThree.start();

		const gradus = Math.PI/180;

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			//if(isloaded)
			raccoon.scene.rotation.y -= 3*gradus;
			bear.scene.rotation.y += 2*gradus;
			renderer.render(scene, camera);
		});
	}

	start();
});
