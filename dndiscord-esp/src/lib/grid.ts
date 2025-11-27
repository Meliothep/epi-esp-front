/**
 * Utilitaires pour la grille de jeu
 */

import { GridPosition } from '../types';

export const isValidGridPosition = (position: GridPosition, width: number, height: number): boolean => {
  return position.row >= 0 && position.row < height && position.col >= 0 && position.col < width;
};

export const getAdjacentTiles = (position: GridPosition, distance: number = 1): GridPosition[] => {
  const tiles: GridPosition[] = [];

  for (let row = position.row - distance; row <= position.row + distance; row++) {
    for (let col = position.col - distance; col <= position.col + distance; col++) {
      if (row !== position.row || col !== position.col) {
        tiles.push({ row, col });
      }
    }
  }

  return tiles;
};

export const getPathBetweenTiles = (start: GridPosition, end: GridPosition): GridPosition[] => {
  const path: GridPosition[] = [start];
  
  let current = { ...start };
  const rowDiff = end.row - start.row;
  const colDiff = end.col - start.col;
  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

  while (current.row !== end.row || current.col !== end.col) {
    if (current.row !== end.row) {
      current.row += rowStep;
    }
    if (current.col !== end.col) {
      current.col += colStep;
    }
    path.push({ ...current });
  }

  return path;
};

export const getTileDistance = (from: GridPosition, to: GridPosition): number => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  return Math.max(rowDiff, colDiff); // Chebyshev distance
};

export const isTileInRange = (position: GridPosition, center: GridPosition, range: number): boolean => {
  return getTileDistance(position, center) <= range;
};

export const getTilesInRange = (center: GridPosition, range: number, maxWidth: number, maxHeight: number): GridPosition[] => {
  const tiles: GridPosition[] = [];

  for (let row = Math.max(0, center.row - range); row <= Math.min(maxHeight - 1, center.row + range); row++) {
    for (let col = Math.max(0, center.col - range); col <= Math.min(maxWidth - 1, center.col + range); col++) {
      if (isTileInRange({ row, col }, center, range)) {
        tiles.push({ row, col });
      }
    }
  }

  return tiles;
};
