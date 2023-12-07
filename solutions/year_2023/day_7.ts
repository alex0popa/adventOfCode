
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const CARDS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A'
] as const;

const CARDS_2 = [
  'J',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'Q',
  'K',
  'A'
] as const;

type Card = typeof CARDS[number];
type Hand = {
  cards: [Card, Card, Card, Card, Card],
  bid: number,
  rank1: number,
  rank2: number
};

const getCardIndex = (card: Card, cards: Card[]) => cards.indexOf(card);

const getCardsMap = () => {
  return CARDS.reduce((map, card) => map.set(card, 0), new Map<Card, number>() )
}

const getRank1 = (cards: Hand['cards']) => {
  const mapCards = getCardsMap();

  for (const card of cards) mapCards.set(card, (mapCards.get(card) ?? 0) + 1);

  const ranks = Array.from(mapCards.values());

  if(ranks.includes(5)) return 7;
  if(ranks.includes(4)) return 6;
  if(ranks.includes(3) && ranks.includes(2)) return 5;
  if(ranks.includes(3)) return 4;
  if(ranks.reduce((twoPairs, rank) => rank === 2 ? ++twoPairs : twoPairs, 0) === 2) return 3;
  if(ranks.includes(2)) return 2;

  return 1;
}

const getRank2 = (cards: Hand['cards'], bestRank: number) => {
  const noJollyCards = [...cards].filter(card => card !== 'J');

  for (const currentCard of noJollyCards) {
    const newCards = cards.map(card => card === 'J' ? currentCard : card) as Hand['cards'];
    const rank = getRank1(newCards);

    if(rank > bestRank) bestRank = rank;
  }

  return bestRank;
}

const compareHands = (hand1: Hand['cards'], hand2: Hand['cards'], cards: Card[]) => {
  for(let i = 0; i < 5; ++i) {
    if(getCardIndex(hand1[i], cards) < getCardIndex(hand2[i], cards)) return -1;
    if(getCardIndex(hand1[i], cards) > getCardIndex(hand2[i], cards)) return 1;
  }

  return 0;
}

(async () =>  {
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const hands = input.map<Hand>((line) => {
    const res = line.split(' ');
    const cards = (res[0].split('')) as Hand['cards'];
    const rank1 = getRank1(cards);
    const rank2 = !cards.includes('J') ? rank1 : getRank2(cards, rank1);

    return { cards, bid: +res[1], rank1, rank2 }
  });

  const handsSortedByRank1 = [...hands].sort((hand1, hand2) => {
    if(hand1.rank1 < hand2.rank1) return -1;
    if(hand1.rank1 > hand2.rank1) return 1;
    
    return compareHands(hand1.cards, hand2.cards, [...CARDS]);
  })

  const handsSortedByRank2 = [...hands].sort((hand1, hand2) => {
    if(hand1.rank2 < hand2.rank2) return -1;
    if(hand1.rank2 > hand2.rank2) return 1;
    
    return compareHands(hand1.cards, hand2.cards, [...CARDS_2]);
  });

  const star1 = handsSortedByRank1.reduce(
    (total, { bid }, idx) => total += (bid * (idx + 1)),
    0
  );

  const star2 = handsSortedByRank2.reduce(
    (total, { bid }, idx) => total += (bid * (idx + 1)),
    0
  );

  showTheResult({ star1, star2, path: __filename });
})();

