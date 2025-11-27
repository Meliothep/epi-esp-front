import * as BABYLON from '@babylonjs/core';
import { GameBoard, GameEntity, GridPosition } from '../../types';

/**
 * Classe pour gérer la scène BabylonJS
 */
export class BabylonScene {
  private scene: BABYLON.Scene;
  private engine: BABYLON.Engine;
  private canvas: HTMLCanvasElement;
  private camera: BABYLON.UniversalCamera | null = null;
  private entities: Map<string, BABYLON.AbstractMesh> = new Map();
  private tileSize: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);

    // Configurer les paramètres de base
    this.setupScene();
    this.setupCamera();
    this.setupLighting();

    // Gérer le redimensionnement
    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    // Lancer la boucle de rendu
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  /**
   * Configurer la scène
   */
  private setupScene(): void {
    // Ajouter une texture de terrain ou une couleur de fond
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.15, 1);
    this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
  }

  /**
   * Configurer la caméra isométrique
   */
  private setupCamera(): void {
    this.camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(5, 10, 10));
    this.camera.attachControl(this.canvas, true);
    this.camera.inertia = 0.7;
    this.camera.angularSensibility = 1000;
  }

  /**
   * Configurer l'éclairage
   */
  private setupLighting(): void {
    const ambientLight = new BABYLON.HemisphericLight('ambientLight', new BABYLON.Vector3(0, 1, 0), this.scene);
    ambientLight.intensity = 0.6;

    const directionalLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 10, 0), this.scene);
    directionalLight.intensity = 0.8;
    directionalLight.range = 100;
  }

  /**
   * Créer un plateau de grille
   */
  createGrid(board: GameBoard): void {
    this.tileSize = board.tileSize;

    // Créer un plan pour chaque tile
    for (let row = 0; row < board.height; row++) {
      for (let col = 0; col < board.width; col++) {
        const position = this.gridToWorldPosition(row, col);
        const plane = BABYLON.MeshBuilder.CreateGround(
          `tile_${row}_${col}`,
          { width: this.tileSize, height: this.tileSize },
          this.scene
        );
        plane.position = new BABYLON.Vector3(position.x, 0, position.z);
        plane.material = this.createTileMaterial(row, col);
      }
    }
  }

  /**
   * Créer une entité de jeu
   */
  createEntity(entity: GameEntity): BABYLON.AbstractMesh {
    const position = this.gridToWorldPosition(entity.position.row, entity.position.col);
    
    let mesh: BABYLON.AbstractMesh;

    if (entity.type === 'character') {
      mesh = this.createCharacterMesh(entity.name);
    } else if (entity.type === 'object') {
      mesh = this.createObjectMesh();
    } else {
      mesh = BABYLON.MeshBuilder.CreateBox('terrain', { size: this.tileSize }, this.scene);
    }

    mesh.position = new BABYLON.Vector3(position.x, this.tileSize / 2, position.z);
    mesh.name = entity.id;
    this.entities.set(entity.id, mesh);

    return mesh;
  }

  /**
   * Créer un maillage de personnage
   */
  private createCharacterMesh(name: string): BABYLON.AbstractMesh {
    const group = new BABYLON.TransformNode(name, this.scene);

    // Corps
    const body = BABYLON.MeshBuilder.CreateCylinder('body', {
      diameter: 0.5,
      height: 1,
      tessellation: 16,
    }, this.scene);
    body.parent = group;
    body.position.y = 0;

    // Tête
    const head = BABYLON.MeshBuilder.CreateSphere('head', { diameter: 0.35, segments: 16 }, this.scene);
    head.parent = group;
    head.position.y = 0.75;

    // Colorer le mesh
    const material = new BABYLON.StandardMaterial('charMaterial', this.scene);
    material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.5);
    body.material = material;
    head.material = material;

    return group as unknown as BABYLON.AbstractMesh;
  }

  /**
   * Créer un maillage d'objet
   */
  private createObjectMesh(): BABYLON.AbstractMesh {
    const box = BABYLON.MeshBuilder.CreateBox('object', { size: 0.3 }, this.scene);
    const material = new BABYLON.StandardMaterial('objMaterial', this.scene);
    material.emissiveColor = new BABYLON.Color3(0.8, 0.6, 0.4);
    box.material = material;
    return box;
  }

  /**
   * Créer le matériel pour une tuile
   */
  private createTileMaterial(row: number, col: number): BABYLON.Material {
    const material = new BABYLON.StandardMaterial(`tile_${row}_${col}`, this.scene);
    
    // Alterner les couleurs pour créer un damier
    if ((row + col) % 2 === 0) {
      material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.25);
    } else {
      material.emissiveColor = new BABYLON.Color3(0.15, 0.15, 0.2);
    }

    return material;
  }

  /**
   * Convertir les coordonnées de grille en coordonnées du monde
   */
  gridToWorldPosition(row: number, col: number): { x: number; z: number } {
    return {
      x: col * this.tileSize,
      z: row * this.tileSize,
    };
  }

  /**
   * Convertir les coordonnées du monde en coordonnées de grille
   */
  worldToGridPosition(x: number, z: number): GridPosition {
    return {
      row: Math.floor(z / this.tileSize),
      col: Math.floor(x / this.tileSize),
    };
  }

  /**
   * Déplacer une entité
   */
  moveEntity(entityId: string, targetPosition: GridPosition): void {
    const mesh = this.entities.get(entityId);
    if (mesh) {
      const worldPos = this.gridToWorldPosition(targetPosition.row, targetPosition.col);
      mesh.position = new BABYLON.Vector3(worldPos.x, mesh.position.y, worldPos.z);
    }
  }

  /**
   * Supprimer une entité
   */
  removeEntity(entityId: string): void {
    const mesh = this.entities.get(entityId);
    if (mesh) {
      mesh.dispose();
      this.entities.delete(entityId);
    }
  }

  /**
   * Obtenir la scène
   */
  getScene(): BABYLON.Scene {
    return this.scene;
  }

  /**
   * Obtenir l'engine
   */
  getEngine(): BABYLON.Engine {
    return this.engine;
  }

  /**
   * Obtenir la caméra
   */
  getCamera(): BABYLON.UniversalCamera | null {
    return this.camera;
  }

  /**
   * Définir la position de la caméra
   */
  setCameraPosition(x: number, y: number, z: number): void {
    if (this.camera) {
      this.camera.position = new BABYLON.Vector3(x, y, z);
    }
  }

  /**
   * Nettoyer les ressources
   */
  dispose(): void {
    this.scene.dispose();
    this.engine.dispose();
  }
}
