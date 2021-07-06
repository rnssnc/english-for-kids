import EnglishForKidsService, {
  TGameAssets,
  TCard,
  TCategory,
} from '../../services/english-for-kids-service';
import { AppDispatch } from '../../store';
import { APP_MODES, GAME_MODES } from '../reducers/reducer';

export enum ACTIONS {
  APP_SET_MODE = 'APP_MODE_SWITCH',
  APP_SET_NAV_SHOW = 'APP_SET_NAV_SHOW',

  GAME_SET_CATEGORY = 'GAME_SET_CATEGORY',
  GAME_SET_MODE = 'GAME_SET_MODE',
  GAME_ADD_ATTEMPT = 'GAME_ADD_ATTEMPT',
  GAME_CLEAR_ATTEMPTS = 'GAME_CLEAR_ATTEMPTS',
  GAME_SET_CARDS_TO_PLAY = 'GAME_SET_CARD_TO_PLAY',
  GAME_SET_CURRENT_CARD = 'GAME_SET_CURRENT_CARD',

  FETCH_CATEGORIES_REQUESTED = 'FETCH_CATEGORIES_REQUESTED',
  FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS',
  FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE',

  FETCH_GAME_CARDS_REQUESTED = 'FETCH_GAME_CARDS_REQUESTED',
  FETCH_GAME_CARDS_SUCCESS = 'FETCH_GAME_CARDS_SUCCESS',
  FETCH_GAME_CARDS_FAILURE = 'FETCH_GAME_CARDS_FAILURE',
  SET_GAME_CARDS = 'SET_GAME_CARDS',

  FETCH_GAME_ASSETS_REQUESTED = 'FETCH_GAME_ASSETS_REQUESTED',
  FETCH_GAME_ASSETS_SUCCESS = 'FETCH_GAME_ASSETS_SUCCESS',
  FETCH_GAME_ASSETS_FAILURE = 'FETCH_GAME_ASSETS_FAILURE',
}

const setAppMode = (newMode: APP_MODES) => {
  return {
    type: ACTIONS.APP_SET_MODE,
    payload: newMode,
  };
};

const categoriesRequested = () => {
  return {
    type: ACTIONS.FETCH_CATEGORIES_REQUESTED,
  };
};

const categoriesSuccess = (categories: TCategory[]) => {
  return {
    type: ACTIONS.FETCH_CATEGORIES_SUCCESS,
    payload: categories,
  };
};

const categoriesFailure = (err: ErrorEvent) => {
  return {
    type: ACTIONS.FETCH_CATEGORIES_FAILURE,
    payload: err,
  };
};

const fetchCategories =
  (englishForKidsService: EnglishForKidsService) => () => (dispatch: AppDispatch) => {
    dispatch(categoriesRequested());
    englishForKidsService
      .getCategories()
      .then((data: TCategory[]) => dispatch(categoriesSuccess(data)))
      .catch((err: ErrorEvent) => dispatch(categoriesFailure(err)));
  };

const setAppNavShown = (isShown: boolean) => {
  return {
    type: ACTIONS.APP_SET_NAV_SHOW,
    payload: isShown,
  };
};

const selectCategory = (category: TCategory) => {
  return {
    type: ACTIONS.GAME_SET_CATEGORY,
    payload: category,
  };
};

const gameCardsRequsted = () => {
  return { type: ACTIONS.FETCH_GAME_CARDS_REQUESTED };
};

const gameCardsSuccess = (cards: TCard[]) => {
  return { type: ACTIONS.FETCH_GAME_CARDS_SUCCESS, payload: cards };
};

const gameCardsFailure = (err: ErrorEvent) => {
  return { type: ACTIONS.FETCH_GAME_CARDS_REQUESTED, payload: err };
};

const setGameCards = (cards: TCard[]) => {
  return {
    type: ACTIONS.SET_GAME_CARDS,
    payload: cards,
  };
};

const fetchCards =
  (englishForKidsService: EnglishForKidsService) => (id: number) => (dispatch: AppDispatch) => {
    dispatch(gameCardsRequsted());
    englishForKidsService
      .getCategoryCards(id)
      .then((data: TCard[]) => dispatch(gameCardsSuccess(data)))
      .catch((err: ErrorEvent) => dispatch(gameCardsFailure(err)));
  };

const selectCategoryAndLoadCards =
  (englishForKidsService: EnglishForKidsService) =>
  (category: TCategory) =>
  (dispatch: AppDispatch) => {
    dispatch(selectCategory(category));
    dispatch(gameCardsRequsted());
    englishForKidsService
      .getCategoryCards(category.id)
      .then((data: TCard[]) => dispatch(gameCardsSuccess(data)))
      .catch((err: ErrorEvent) => dispatch(gameCardsFailure(err)));
  };

const setGameMode = (mode: GAME_MODES) => {
  return {
    type: ACTIONS.GAME_SET_MODE,
    payload: mode,
  };
};

const setCurrentCard = (card: TCard) => {
  return { type: ACTIONS.GAME_SET_CURRENT_CARD, payload: card };
};

const addAttempt = (result: boolean) => {
  return { type: ACTIONS.GAME_ADD_ATTEMPT, payload: result };
};

const clearAttempts = () => {
  return { type: ACTIONS.GAME_CLEAR_ATTEMPTS };
};

const setCardsToPlay = (cards: TCard[]) => {
  return {
    type: ACTIONS.GAME_SET_CARDS_TO_PLAY,
    payload: cards,
  };
};

const gameAssetsRequested = () => {
  return {
    type: ACTIONS.FETCH_GAME_ASSETS_REQUESTED,
  };
};

const gameAssetsSuccess = (assets: TGameAssets) => {
  return {
    type: ACTIONS.FETCH_GAME_ASSETS_SUCCESS,
    payload: assets,
  };
};

const gameAssetsFailure = (err: ErrorEvent) => {
  return {
    type: ACTIONS.FETCH_GAME_ASSETS_FAILURE,
    payload: err,
  };
};

const fetchGameAssets =
  (englishForKidsService: EnglishForKidsService) => () => (dispatch: AppDispatch) => {
    dispatch(gameAssetsRequested());
    englishForKidsService
      .getGameAssets()
      .then((data: TGameAssets) => dispatch(gameAssetsSuccess(data)))
      .catch((err: ErrorEvent) => dispatch(gameAssetsFailure(err)));
  };

export {
  setAppMode,
  categoriesRequested,
  categoriesSuccess,
  categoriesFailure,
  fetchCategories,
  setAppNavShown,
  selectCategory,
  gameCardsRequsted,
  gameCardsSuccess,
  gameCardsFailure,
  fetchCards,
  setGameMode,
  setCurrentCard,
  addAttempt,
  clearAttempts,
  setCardsToPlay,
  selectCategoryAndLoadCards,
  fetchGameAssets,
  setGameCards,
};
