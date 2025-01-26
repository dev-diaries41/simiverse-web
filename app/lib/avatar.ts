import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';  // Correct import

// Function to create a 3D avatar from an image as a texture on a sphere
export function createAvatarFromImage(imageUrl: string, scene: THREE.Scene) {
    // Create a texture loader to load the image
    const textureLoader = new THREE.TextureLoader();
    
    // Load the image as a texture
    const texture = textureLoader.load(imageUrl);
    
    // Create a sphere geometry (can replace with any other 3D geometry)
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    
    // Create a material with the texture
    const material = new THREE.MeshBasicMaterial({ map: texture });
    
    // Create the mesh (sphere) with the material
    const avatar = new THREE.Mesh(geometry, material);
    
    // Add the avatar to the scene
    scene.add(avatar);
    
    // Return the avatar object in case you want to manipulate it later
    return avatar;
}


// Function to create a 3D avatar from a pre-existing GLTF model and apply a texture
export function createAvatarFromModelAndTexture(modelUrl: string, textureUrl: string, scene: THREE.Scene) {
    // Load the GLTF model
    const loader = new GLTFLoader();
    
    loader.load(modelUrl, function(gltf: any) {
        // Add the loaded model to the scene
        scene.add(gltf.scene);
        
        // Load the texture from the image
        const texture = new THREE.TextureLoader().load(textureUrl);
        
        // Traverse through the loaded model and apply texture to its materials
        gltf.scene.traverse(function(child: { isMesh: any; material: { map: THREE.Texture; }; }) {
            if (child.isMesh) {
                child.material.map = texture;
            }
        });
        
        // Return the 3D model object in case you need to manipulate it later
        return gltf.scene;
    });
}
