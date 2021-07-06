import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import StatisticService, { TWordStatistic } from '../../../services/statistic-service';
import WordStatisticTable from '../../word-statistic-table/word-statistic-table';
import { setGameCards } from '../../../redux/actions/actions';

import './statistic.sass';

interface IProps {
  setGameCards: typeof setGameCards;
}

interface IState {
  statistic: TWordStatistic[];
  redirect: boolean;
}

class StatisticPage extends React.Component<IProps, IState> {
  state: IState = {
    statistic: [],
    redirect: false,
  };

  componentDidMount() {
    this.setState({ statistic: StatisticService.getStatistic() });
  }

  render() {
    if (this.state.redirect) return <Redirect to="/game" push />;

    return (
      <section className="section">
        <div className="statistic-info-controlls-wrapper">
          <h2 className="typography-h2">Statistic</h2>
          <div className="statistic-actions-wrapper">
            <button className="button button-repeat-words" onClick={this.setWordsToRepeat}>
              Repeat hard words
            </button>
            <button
              className="button button-statistic-reset"
              onClick={() => StatisticService.clearStatistic.call(StatisticService)}
            >
              Reset
            </button>
          </div>
        </div>
        <WordStatisticTable statistic={this.state.statistic} />
      </section>
    );
  }

  setWordsToRepeat = () => {
    const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });

    const items = this.state.statistic
      .filter((item) => item.precent !== '-' && item.precent !== '100%')
      .sort((a, b) => collator.compare(a.precent, b.precent))
      .slice(0, 8)
      .map((item) => item.card);

    this.props.setGameCards(items);
    this.setState({ redirect: true });
  };
}

const mapDispatchToProps = {
  setGameCards,
};

export default connect(null, mapDispatchToProps)(StatisticPage);
