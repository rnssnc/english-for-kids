export type TCategory = {
  id: number;
  title: string;
  imgSrc: string;
  cardCount: number;
};

export type TCard = {
  word: string;
  translation: string;
  imageSrc: string;
  audioSrc: string;
  isGuessed: boolean;
  category: string;
};

export type TGameAssets = {
  correctSoundSrc: string;
  incorrecSoundtSrc: string;
  winSoundSrc: string;
  looseSoundSrc: string;
  winImageSrc: string;
  looseImageSrc: string;
};

export default class EnglishForKidsService {
  async getCategories() {
    return (await fetch('./assets/categories.json')).json();
  }

  async getCategoryCards(id: number): Promise<TCard[]> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        resolve((await fetch(`./assets/categories/${id}.json`)).json());
      }, 700);
    });
    // return (await fetch(`./assets/categories/${id}.json`)).json();
  }

  async getGameAssets() {
    return (await fetch(`./assets/assets.json`)).json();
  }

  async getCategoryCard(categoryId: number, cardWord: string) {
    const cards = await (await fetch(`./assets/categories/${categoryId}.json`)).json();

    return cards.find((card: TCard) => card.word === cardWord);
  }
}
