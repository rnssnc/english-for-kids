import React from 'react';
import InView from 'react-intersection-observer';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  selectCategoryAndLoadCards,
  fetchCategories,
  addNewCategories,
  updateCategory,
} from '../../redux/actions/actions';
import { TAppState } from '../../redux/reducers/reducer';
import EnglishForKidsService, { TCategory } from '../../services/english-for-kids-service';
import { AppDispatch } from '../../store';
import compose from '../../utils/compose';
import AdminPanelCategoryCard from '../admin-panel-category-card/admin-panel-category-card';
import withEnglishForKidsService from '../hoc/with-english-for-kids-service';

import './admin-panel-category-list.sass';

interface IProps {
  categories: TCategory[];
  selectCategoryAndLoadCards: (category: TCategory, page: number) => void;
  englishForKidsService: EnglishForKidsService;
  addNewCategories: typeof addNewCategories;
  updateCategory: typeof updateCategory;
}

interface IState {
  categories: TCategory[];
  redirect: boolean;
  page: number;
}

class AdminPanelCategoryList extends React.Component<IProps, IState> {
  state: IState = {
    categories: [],
    redirect: false,
    page: 0,
  };

  componentDidUpdate(prevProps: IProps) {
    if (this.props.categories !== prevProps.categories) {
      this.setState({ categories: this.props.categories });
    }
  }
  render() {
    if (this.state.redirect) return <Redirect to="/words" />;
    if (this.props.categories.length === 0)
      return (
        <h2>
          Seems like something went wrong with server. Please contact me on discord Renaissance#6666
        </h2>
      );

    const items = this.state.categories.map((category, index) => (
      <AdminPanelCategoryListItem
        key={index}
        category={category}
        onSubmit={this.onSubmit}
        onAddWords={this.onAddWords}
        onNewItemCancel={category._id < 0 ? this.onNewItemCancel : undefined}
        onDelete={this.onDelele}
      />
    ));

    return (
      <div className="admin-panel-categories-list__wrapper">
        <ul className="admin-panel-categories-list">
          {items}
          <InView onChange={(isInView) => (isInView ? this.loadNextPage() : null)}>
            <li className="categories-list__item categories-list__item-add">
              <div className="admin-panel-category-card categories-list__add-category">
                <span className="typography-h4">Add new category</span>
                <button
                  className="categories-list__add-category-button"
                  onClick={this.addNewItemToRender}
                >
                  +
                </button>
              </div>
            </li>
          </InView>
        </ul>
      </div>
    );
  }
  onDelele = (_id: number) => {
    if (_id < 0) {
      this.setState(({ categories }) => {
        const newCategories = categories.filter((category) => category._id !== _id);

        return { categories: newCategories };
      });

      return;
    }

    this.props.englishForKidsService.deleteCategory(_id).then(() => {
      this.setState(({ categories }) => ({
        categories: categories.filter((category) => category._id !== _id),
      }));
    });
  };

  addNewItemToRender = () => {
    this.setState(({ categories }) => {
      return {
        categories: [
          ...categories,
          { cardCount: 0, _id: -categories.length - 1, imgSrc: '', title: '' },
        ],
      };
    });
  };

  onNewItemCancel = (_id: number) => {
    this.setState(({ categories }) => {
      return {
        categories: categories.filter((category) => category._id !== _id),
      };
    });
  };

  onSubmit = async (category: {
    _id: number;
    title: string;
    imgSrc: string;
    img?: File;
  }): Promise<string> => {
    let message = '';
    if (category._id < 0) {
      await this.props.englishForKidsService
        .createCategory({
          title: category.title,
          imgSrc: category.imgSrc,
          img: category.img,
        })
        .then((newCategory) => this.props.addNewCategories([newCategory]))
        .catch((err) => {
          if (err.code === 11000) message = 'This name is already taken';
          else message = err.message;
        });
    } else {
      await this.props.englishForKidsService
        .updateCategory(category)
        .then((newCategory) => this.props.updateCategory(newCategory))
        .catch((err) => {
          if (err.code === 11000) message = 'This name is already taken';
          else message = err.message;
        });
    }

    return message;
  };

  private setUpdatedCategoryToState = (oldId: number, newCategory: TCategory) => {
    this.setState(({ categories }) => {
      const newCategories = categories.map((item) => {
        if (item._id === oldId) {
          item._id = newCategory._id;
          item.title = newCategory.title;
          item.imgSrc = newCategory.imgSrc;
          item.cardCount = newCategory.cardCount;
        }
        return item;
      });
      return { categories: newCategories };
    });
  };

  onAddWords = (category: TCategory) => {
    this.props.selectCategoryAndLoadCards(category, 1);
    this.setState({ redirect: true });
  };

  loadNextPage = () => {
    this.props.englishForKidsService
      .getCategories(this.state.page + 1)
      .then((cards) => this.props.addNewCategories(cards))
      .then(() =>
        this.setState((state) => ({
          page: state.page + 1,
        })),
      );
  };
}

interface ICategoryItemProps {
  category: TCategory;
  onNewItemCancel?: (_id: number) => void;
  onAddWords: (category: TCategory) => void;
  onSubmit: (data: { _id: number; title: string; imgSrc: string; img?: File }) => Promise<string>;
  onDelete: (_id: number) => void;
}

const AdminPanelCategoryListItem = (props: ICategoryItemProps) => (
  <li className="categories-list__item">
    <AdminPanelCategoryCard
      category={props.category}
      onNewItemCancel={props.onNewItemCancel}
      onAddWordsClick={props.onAddWords}
      onSubmitClick={props.onSubmit}
      onDeleteClick={props.onDelete}
    />
  </li>
);
const mapStateToProps = ({ categories }: TAppState) => {
  return { categories };
};

const mapDispatchToProps = (
  dispatch: AppDispatch,
  { englishForKidsService }: { englishForKidsService: EnglishForKidsService },
) => {
  return bindActionCreators(
    {
      selectCategoryAndLoadCards: selectCategoryAndLoadCards(englishForKidsService),
      fetchCategories,
      updateCategory,
      addNewCategories,
    },
    dispatch,
  );
};

export default compose(
  withEnglishForKidsService(),
  connect(mapStateToProps, mapDispatchToProps),
)(AdminPanelCategoryList);
