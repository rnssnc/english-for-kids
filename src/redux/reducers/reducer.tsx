import { ACTIONS } from '../actions/actions';

import { AnyAction } from '@reduxjs/toolkit';
import { TCard, TCategory, TGameAssets } from '../../services/english-for-kids-service';

export enum APP_MODES {
  train = 'train',
  play = 'play',
}

export enum GAME_MODES {
  none = 'none',
  ready = 'ready',
  game = 'game',
  finish = 'finish',
}

export type TAppState = {
  mode: APP_MODES;
  isAppNavShown: boolean;
  categories: TCategory[];
  selectedCategory: TCategory | null;

  loading: boolean;
  error: boolean;

  cards: TCard[];
  gameMode: GAME_MODES;
  currentCard: TCard | null;
  attempts: boolean[];
  cardsToPlay: TCard[];
  gameAssets: TGameAssets;
};

const initalState: TAppState = {
  mode: APP_MODES.train,
  categories: [],
  loading: false,
  error: false,
  isAppNavShown: false,
  selectedCategory: null,
  cards: [],
  gameMode: GAME_MODES.none,
  currentCard: null,
  attempts: [],
  cardsToPlay: [],
  gameAssets: {
    correctSoundSrc: '',
    incorrecSoundtSrc: '',
    winImageSrc: '',
    looseSoundSrc: '',
    looseImageSrc: '',
    winSoundSrc: '',
  },
};

const reducer = (state = initalState, action: AnyAction): TAppState => {
  switch (action.type) {
    case ACTIONS.APP_SET_MODE:
      const unGuessCards = [...state.cards].map((card) => {
        card.isGuessed = false;
        return card;
      });
      return {
        ...state,
        gameMode: GAME_MODES.ready,
        attempts: [],
        mode: action.payload,
        cards: unGuessCards,
      };
    case ACTIONS.FETCH_CATEGORIES_REQUESTED:
      return { ...state, categories: [], loading: true, error: false };
    case ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload, loading: false, error: false };
    case ACTIONS.FETCH_CATEGORIES_FAILURE:
      return { ...state, categories: [], loading: false, error: true };
    case ACTIONS.APP_SET_NAV_SHOW:
      return { ...state, isAppNavShown: action.payload };
    case ACTIONS.GAME_SET_CATEGORY:
      return { ...state, isAppNavShown: false, selectedCategory: action.payload };
    case ACTIONS.SET_GAME_CARDS:
      return {
        ...state,
        selectedCategory: {
          id: -1,
          cardCount: action.payload.length,
          imgSrc: '',
          title: 'Costum cards',
        },
        cards: action.payload,
      };
    case ACTIONS.FETCH_GAME_CARDS_REQUESTED:
      return { ...state, gameMode: GAME_MODES.none, cards: [], loading: true, error: false };
    case ACTIONS.FETCH_GAME_CARDS_SUCCESS:
      const cards = action.payload.map((card: TCard) => ({ ...card, isGuessed: false }));
      return { ...state, gameMode: GAME_MODES.ready, cards, loading: false, error: false };
    case ACTIONS.FETCH_GAME_CARDS_FAILURE:
      return { ...state, gameMode: GAME_MODES.none, cards: [], loading: false, error: true };
    case ACTIONS.GAME_SET_MODE:
      if (action.payload === GAME_MODES.none)
        return { ...state, attempts: [], gameMode: action.payload };
      return { ...state, gameMode: action.payload };
    case ACTIONS.GAME_SET_CURRENT_CARD:
      return { ...state, currentCard: action.payload };
    case ACTIONS.GAME_ADD_ATTEMPT: {
      if (action.payload === true) {
        const newCardsToPlay = [...state.cardsToPlay];
        newCardsToPlay.pop();

        const newCards = state.cards.map((card) =>
          card === state.currentCard ? ((card.isGuessed = true), card) : card,
        );

        const cardToPlay = newCardsToPlay[newCardsToPlay.length - 1];

        return {
          ...state,
          cards: newCards,
          currentCard: cardToPlay,
          cardsToPlay: newCardsToPlay,
          attempts: [...state.attempts, action.payload],
        };
      }
      return { ...state, attempts: [...state.attempts, action.payload] };
    }
    case ACTIONS.GAME_CLEAR_ATTEMPTS: {
      return { ...state, attempts: [] };
    }
    case ACTIONS.GAME_SET_CARDS_TO_PLAY: {
      return {
        ...state,
        currentCard: action.payload[action.payload.length - 1],
        cardsToPlay: action.payload,
      };
    }
    case ACTIONS.FETCH_GAME_ASSETS_SUCCESS:
      return {
        ...state,
        gameAssets: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
