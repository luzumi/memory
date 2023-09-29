export const globalState = {
  elements: {},
  gridSize: 8,
  setId: 1,
  waitingTime: 1000,
  gameStartTime: null,
  lastMousePosition: { x: 0, y: 0 },
  clickedImage: [],
  allFounded: false,
  globalGameTime: 0,
  images: [],
  score: 0,
  getImages: () => `img/set${globalState.setId}/`,
  getBackgrounds: () => `img/set${globalState.setId}/backgrounds/`,
  getImgHeader: () => `img/set${globalState.setId}/header/`,
};
