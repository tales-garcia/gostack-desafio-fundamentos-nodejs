import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  type: 'outcome' | 'income';
  value: number;
  title: string;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (total, transaction) => {
        const result = total;
        if (transaction.type === 'income') {
          result.income += transaction.value;
        } else {
          result.outcome += transaction.value;
        }
        return result;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create(data: TransactionDTO): Transaction {
    const transaction = new Transaction(data);
    this.transactions.push(transaction);

    if (this.getBalance().total < 0) {
      throw Error("You don't enough money for this transaction");
    }

    return transaction;
  }
}

export default TransactionsRepository;
