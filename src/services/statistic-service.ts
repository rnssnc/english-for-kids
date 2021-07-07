import { TCard } from './english-for-kids-service';

export type TWordStatistic = {
  card: TCard;
  category: string;
  trainCount: number;
  correctCount: number;
  incorrectCount: number;
  precent: string;
};

export default class StatisticService {
  static keyName = 'wordStatistic';

  static getStatistic(): TWordStatistic[] {
    const data = localStorage.getItem(this.keyName);
    if (data) return JSON.parse(data);

    return [];
  }

  static clearStatistic() {
    localStorage.setItem(this.keyName, '[]');
  }

  static increaseWordCorrect(card: TCard, category: string) {
    this.increaseField(card, category, 'correctCount');
  }

  static increaseWordIncorrect(card: TCard, category: string) {
    this.increaseField(card, category, 'incorrectCount');
  }

  static increaseWordTrain(card: TCard, category: string) {
    this.increaseField(card, category, 'trainCount', false);
  }

  private static increaseField(
    card: TCard,
    category: string,
    field: keyof TWordStatistic,
    recalculatePrecents = true,
  ) {
    const statistic = this.getStatistic();

    const index = statistic.findIndex(
      (item) => item.card.word === card.word && item.category === category,
    );

    if (index > -1) {
      statistic[index][field]++;

      if (recalculatePrecents)
        statistic[index].precent = `${
          (statistic[index].correctCount /
            (statistic[index].incorrectCount + statistic[index].correctCount)) *
          100
        }%`;

      localStorage.setItem(this.keyName, JSON.stringify(statistic));
      return;
    }

    this.pushNewItem(card, category, field);
  }

  private static pushNewItem(card: TCard, category: string, field: keyof TWordStatistic) {
    const statistic = this.getStatistic();

    const newItem = {
      card: card,
      category,
      trainCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      precent: '-',
    };

    newItem[field]++;

    statistic.push(newItem);

    localStorage.setItem(this.keyName, JSON.stringify(statistic));
  }
}
