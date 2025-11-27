// BabylonJS utilities
export { BabylonScene } from './BabylonScene';

/**
 * Utilitaires pour les interactions BabylonJS
 */

import * as BABYLON from '@babylonjs/core';

export const raycastTile = (_scene: BABYLON.Scene, _camera: BABYLON.Camera, _mouseX: number, _mouseY: number): { row: number; col: number } | null => {
  // Raycast sur un plan
  // À implémenter selon les besoins
  return null;
};

export const createIsometricView = (camera: BABYLON.UniversalCamera): void => {
  camera.position = new BABYLON.Vector3(10, 10, 10);
  camera.setTarget(BABYLON.Vector3.Zero());
};
