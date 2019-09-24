import { EXPENSE, INCOME, CASH } from "../utils/constants";

const QUANTITY = 10000000;
const MULTIPLIER = 100;

const mockText =
  "The president is currently elected by a plurality voting direct election of the areas administered by the Republic of China for a term of four years. Before 1991, the president was selected by the National Assembly of the Republic of China for a term of six years. The Constitution names the president as head of state and commander-in-chief of the Republic of China Armed Forces (formerly known as the National Revolutionary Army). The president is responsible for conducting foreign relations, such as concluding treaties, declaring war, and making peace. The president must promulgate all laws and has no right to veto. Other powers of the president include granting amnesty, pardon or clemency, declaring martial law, and conferring honors and decorations. The President can appoint Senior Advisors (資政), National Policy Advisors (國策顧問) and Strategy Advisors (戰略顧問), but they do not form a council.[2][3] The Constitution does not clearly define whether the president is more powerful than the premier, as it names the Executive Yuan (headed by the premier) as the \"highest administrative authority\" with oversight over domestic matters while giving the president powers as commander-in-chief of the military and authority over foreign affairs. Prior to his election as president in 1948, Chiang Kai-shek had insisted that he be premier under the new Constitution, while allowing the president (to which Chiang nominated Hu Shih) be a mere figurehead.[4] However, the National Assembly overwhelmingly supported Chiang as president and once in this position, Chiang continued to exercise vast prerogatives as leader and the premiership served to execute policy, not make it. Thus, until the 1980s power in the Republic of China was personalized rather than institutionalized which meant that the power of the president depended largely on who occupied the office. For example, during the tenure of Yen Chia-kan, the office was largely ceremonial with real power in the hands of Premier Chiang Ching-Kuo, and power switched back to the presidency when Chiang became president. After President Lee Teng-hui succeeded Chiang as president in 1988, the power struggle within the KMT extended to the constitutional debate over the relationship between the president and the premier. The first three premiers under Lee, Yu Kuo-hwa, Lee Huan, and Hau Pei-tsun were mainlanders who had initially opposed Lee's ascension to power.The appointment of Lee and Hau were compromises by President Lee to placate conservatives in the KMT.The subsequent appointment of the first native Taiwanese premier Lien Chan was taken as a sign of Lee's consolidation of power. Moreover, during this time, the power of the premier to approve the president's appointments and the power of the Legislative Yuan to confirm the president's choice of premier was removed establishing the president as the more powerful position of the two. After the 2000 election of Chen Shui-bian as president, the presidency and the Legislative Yuan were controlled by different parties which brought forth a number of latent constitutional issues such as the role of the legislature in appointing and dismissing a premier, the right of the president to call a special session of the legislature, and who has the power to call a referendum. Most of these issues have been resolved through inter-party negotiations.";

const msTimezone = 1000 * 60 * 60 * 3;

const msDay = 1000 * 60 * 60 * 24;

const msYear2000 = msDay * (365 * 30 + 7) + msTimezone;

const randBool = () => Math.random() < 0.5;

const mockComment = () => {
  // select length of comment
  const nChars = Math.round(Math.random() * 25) + 5;

  // select start position
  let startIndex = Math.random() * (mockText.length - 2 - nChars);
  while (mockText[startIndex] === " ") {
    startIndex = Math.random() * (mockText.length - 2 - nChars);
  }

  return mockText.slice(startIndex, startIndex + nChars);
};

const createTransaction = (amount, date, type) => ({
  amount,
  date,
  account: CASH,
  type,
  comment: mockComment()
});

const income = (amount, date) => createTransaction(amount, date, INCOME);

const expense = (amount, date) => createTransaction(amount, date, EXPENSE);

const randomAmount = (max = 1, min = 0, multiplier = MULTIPLIER) => {
  if (max === 0) {
    return max;
  }
  let amount = 0;
  while (amount === 0) {
    amount =
      Math.round((Math.random() * (max - min) + min) / multiplier) * multiplier;
  }
  return amount;
};

const hour = 1000 * 60 * 60;

const generateTransactions = number => {
  let currentId = 0;
  const transactions = {};
  let total = 0;
  let currentDate = msYear2000;
  for (let i = 0; i < number; i += 1) {
    const tooMuch = 1 / Math.random() < Math.abs(total);
    const doExpense = randBool();

    currentDate += (1 / Math.random()) * hour * 3;
    if ((tooMuch && total > 0) || doExpense) {
      // Expense
      const amount = randomAmount(QUANTITY);
      transactions[currentId] = expense(amount, currentDate);
      total -= amount;
    } else {
      // Income
      const amount = randomAmount(QUANTITY);
      transactions[currentId] = income(amount, currentDate);
      total += amount;
    }
    currentId += 1;
  }
  return transactions;
};

export default generateTransactions;
