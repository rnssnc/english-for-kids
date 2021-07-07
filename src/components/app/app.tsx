import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomePage, StatisticPage, GamePage } from '../pages';
import AppHeader from '../app-header/app-header';

import './app.sass';
import { connect } from 'react-redux';
import { AppDispatch } from '../../store';
import EnglishForKidsService from '../../services/english-for-kids-service';
import { bindActionCreators } from 'redux';
import { fetchCategories, fetchGameAssets } from '../../redux/actions/actions';
import compose from '../../utils/compose';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';
import AppNavigation from '../app-navigation/app-navigation';
import LavaLamp from '../lavalamp/lavalamp';
import { APP_MODES, TAppState } from '../../redux/reducers/reducer';
import AppFooter from '../app-footer/app-footer';

interface IProps {
  fetchCategories: () => void;
  fetchGameAssets: () => void;
  mode: APP_MODES;
}

class App extends React.Component<IProps, unknown> {
  componentDidMount() {
    this.props.fetchCategories();
    this.props.fetchGameAssets();
  }

  render() {
    const { mode } = this.props;

    this.setDocumentDatasetMode(mode);

    return (
      <main role="main" className="main">
        <LavaLamp />
        <AppHeader />
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/statistic" component={StatisticPage} />
          <Route path="/game" component={GamePage} />
        </Switch>
        <AppFooter />
        <AppNavigation />
      </main>
    );
  }

  setDocumentDatasetMode(mode: APP_MODES) {
    document.documentElement.dataset.appMode = mode;
  }
}

const mapStateToProps = ({ mode }: TAppState) => {
  return { mode };
};

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    {
      fetchCategories: fetchCategories(englishForKidsService),
      fetchGameAssets: fetchGameAssets(englishForKidsService),
    },
    dispatch,
  );
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(App);
