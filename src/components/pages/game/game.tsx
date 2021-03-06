import { bindActionCreators } from '@reduxjs/toolkit';
import React from 'react';
import { connect } from 'react-redux';
import {
  fetchCards,
  setCardsToPlay,
  setGameMode,
  selectCategory,
} from '../../../redux/actions/actions';
import { APP_MODES, GAME_MODES, TAppState } from '../../../redux/reducers';
import EnglishForKidsService, {
  TGameAssets,
  TCard,
  TCategory,
} from '../../../services/english-for-kids-service';
import { AppDispatch } from '../../../store';
import compose from '../../../utils/compose';
import withEnglishForKidsService from '../../hoc/with-english-for-kids-service';
import Spinner from '../../spinner/spinner';
import WordList from '../../word-list/word-list';
import GameStartButton from '../../game-start-button/game-start-button';
import RepeatButton from '../../repeat-button/repeat-button';
import AttemptCounter from '../../attempt-counter/attempt-counter';
import GameResultModal from '../../game-results-modal/game-result-modal';
import { Redirect } from 'react-router-dom';

import _ from 'lodash';

import './game.sass';

interface IProps {
  selectedCategory: TCategory | null;
  cards: TCard[];
  loading: boolean;
  fetchCards: (title: string, page: number) => void;
  mode: APP_MODES;
  gameMode: GAME_MODES;
  setCardsToPlay: typeof setCardsToPlay;
  currentCard: TCard | null;
  gameAssets: TGameAssets;
  attempts: boolean[];
  cardsToPlay: TCard[];
  setGameMode: typeof setGameMode;
  selectCategory: typeof selectCategory;
}

interface IState {
  redirect: boolean;
}

class GamePage extends React.Component<IProps, IState> {
  state: IState = {
    redirect: false,
  };

  currentItem!: TCard;

  audio!: HTMLAudioElement;

  componentDidMount() {
    if (!this.props.selectedCategory) this.setState({ redirect: true });
  }

  componentDidUpdate(prevProps: IProps) {
    const { selectedCategory, currentCard } = this.props;
    if (selectedCategory?._id !== prevProps.selectedCategory?._id) {
      if (selectedCategory) this.props.fetchCards(selectedCategory.title, -1);
    }

    if (currentCard?.word !== prevProps.currentCard?.word) {
      if (this.props.cardsToPlay.length === 0) this.finishGame();

      _.delay(() => this.playSound(), 400);
    }

    if (this.props.selectedCategory !== prevProps.selectedCategory) {
      this.props.setGameMode(GAME_MODES.none);
    }
  }

  componentWillUnmount() {
    this.props.selectCategory(null);
    this.props.setGameMode(GAME_MODES.ready);
  }

  render() {
    if (this.state.redirect) return <Redirect to="/" />;

    const { selectedCategory, cards, loading, gameMode, mode, attempts } = this.props;

    let emptyMessage = null;
    if (cards.length === 0)
      emptyMessage = (
        <h2>
          Seems like no cards added to this category. <br /> You can add it by yourself in admin
          panel.
        </h2>
      );

    const isAppModePlay = mode === APP_MODES.play;
    const isModeGameReady = gameMode === GAME_MODES.ready;
    const isModeGame = gameMode === GAME_MODES.game;
    const isGameModeFinish = gameMode === GAME_MODES.finish;

    const spinner = loading ? <Spinner /> : emptyMessage;

    const content = (
      <React.Fragment>
        <h2 className="typography-h2">{selectedCategory?.title}</h2>
        {!isGameModeFinish && <WordList cards={cards} />}
        <div className="actions-wrapper">
          {isModeGameReady && isAppModePlay && <GameStartButton onClick={this.startGame} />}
          {isModeGame && <RepeatButton onClick={() => this.playSound()} />}
          {isModeGame && <AttemptCounter attempts={attempts} />}
          {isGameModeFinish && <GameResultModal />}
        </div>
      </React.Fragment>
    );

    return (
      <section className="section">
        {content}
        {spinner}
      </section>
    );
  }

  startGame = () => {
    const { cards } = this.props;

    const items = _.shuffle({ ...cards });

    this.props.setCardsToPlay(items);
  };

  finishGame = () => {
    this.props.setGameMode(GAME_MODES.finish);
  };

  playSound = () => {
    if (!this.props.currentCard) return;

    const { audioSrc } = this.props.currentCard;

    if (this.audio) this.audio.pause();
    this.audio = new Audio(audioSrc);

    this.audio.play();
  };
}

const mapStateToProps = ({
  selectedCategory,
  cards,
  loading,
  gameMode,
  mode,
  currentCard,
  attempts,
  cardsToPlay,
  gameAssets,
}: TAppState) => {
  return {
    selectedCategory,
    cards,
    loading,
    mode,
    gameMode,
    currentCard,
    attempts,
    cardsToPlay,
    gameAssets,
  };
};

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    { fetchCards: fetchCards(englishForKidsService), setCardsToPlay, setGameMode, selectCategory },
    dispatch,
  );
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(GamePage);
