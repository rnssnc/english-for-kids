import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TAppState } from '../../redux/reducers/reducer';
import EnglishForKidsService, { TCategory } from '../../services/english-for-kids-service';
import { setAppNavShown, selectCategoryAndLoadCards } from '../../redux/actions/actions';

import './app-navigation.sass';
import compose from '../../utils/compose';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';
import { AppDispatch } from '../../store';
import { bindActionCreators } from '@reduxjs/toolkit';

interface IProps {
  categories: TCategory[];
  isAppNavShown: boolean;
  setAppNavShown: typeof setAppNavShown;
  selectCategoryAndLoadCards: (category: TCategory) => void;
}

class AppNavigation extends React.Component<IProps, unknown> {
  render() {
    const { categories, isAppNavShown } = this.props;

    const items =
      categories.length > 0
        ? categories.map((category) =>
            AppNavigationItem({ category, onClick: this.handleItemClick }),
          )
        : null;

    return (
      <div
        className={`app-navigation__wrapper ${isAppNavShown ? 'shown' : ''}`}
        onClick={this.handleWrapperClick}
      >
        <nav className={`app-navigation ${isAppNavShown ? 'shown' : ''}`}>
          <ul className="app-navigation-list">
            <li className="app-navigation-list__item">
              <Link className="app-navigation-list__link" to="/" onClick={this.handleWrapperClick}>
                Home
              </Link>
            </li>
            {items}
            <li className="app-navigation-list__item">
              <Link
                className="app-navigation-list__link"
                to="/statistic"
                onClick={this.handleWrapperClick}
              >
                Statistic
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }

  handleWrapperClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) this.props.setAppNavShown(false);
  };

  handleItemClick = (category: TCategory) => {
    this.props.selectCategoryAndLoadCards(category);
  };
}

interface INavigationItemProps {
  category: TCategory;
  onClick: (category: TCategory) => void;
}

const AppNavigationItem = ({ category, onClick }: INavigationItemProps) => {
  return (
    <li key={category.id} className="app-navigation-list__item" onClick={() => onClick(category)}>
      <Link className="app-navigation-list__link" to="/game">
        {category.title}
      </Link>
    </li>
  );
};

const mapStateToProps = ({ categories, isAppNavShown }: TAppState) => {
  return { categories, isAppNavShown };
};

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    {
      setAppNavShown,
      selectCategoryAndLoadCards: selectCategoryAndLoadCards(englishForKidsService),
    },
    dispatch,
  );
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(AppNavigation);
