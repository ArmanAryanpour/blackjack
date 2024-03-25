import { Chip } from "@/components/Chips";
import { v4 } from "uuid";

export type Currency = {
  name: string;
  value: number;
  component: (props: React.ComponentProps<typeof Chip>) => React.ReactNode;
  default: number;
};

export type Balance = {
  bills: {
    [key: string]: string[];
  };
  total: number;
};

export type Account = {
  balance: Balance;
  bet: Balance;
};
export type Accounts = {
  [playerId: string]: Account;
};
export const currencies = [
  {
    name: "5",
    value: 5,
    default: 20,
  },
  {
    name: "10",
    value: 10,
    default: 10,
  },
  {
    name: "50",
    value: 50,
    default: 2,
  },
  {
    name: "100",
    value: 100,
    default: 2,
  },
  {
    name: "500",
    value: 500,
    default: 1,
  },
];
export const generateBills = (count: number, name: string) => {
  return Array(count)
    .fill(name)
    .map((each) => `chip-${name}-${v4()}`);
};
export const generateBalance = (fill: boolean, double?: boolean) => {
  const balance: Balance = {
    bills: {},
    total: 0,
  };
  for (let index = 0; index < currencies.length; index++) {
    const currency = currencies[index];
    if (fill) {
      balance.bills[currency.name] = generateBills(
        double ? currencies[index].default * 100 : currencies[index].default,
        currency.name,
      );
      balance.total += currency.value * balance.bills[currency.name].length;
    } else {
      balance.bills[currency.name] = [];
    }
  }
  return balance;
};

export const generateAccounts = (double?: boolean) => {
  return {
    balance: generateBalance(true, double),
    bet: generateBalance(false, double),
  } as Account;
};
