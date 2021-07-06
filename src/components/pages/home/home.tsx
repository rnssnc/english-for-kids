import React from 'react';
import CategoriesList from '../../categories-list/categories-list';

export default class HomePage extends React.Component {
  render() {
    return (
      <section className="section">
        <h2 className="typography-h2">Train & Play</h2>
        <CategoriesList />
      </section>
    );
  }
}
