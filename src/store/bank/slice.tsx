import { StoreState } from "@/interfaces/app";
import {
  Accounts,
  Balance,
  generateAccounts,
  generateBalance,
  generateBills,
} from "@/store/bank/static";
import { StoreStateCreator } from "@/store/useStore";
import { WritableDraft } from "immer/dist/internal";
import _ from "lodash";
export interface BankState {
  accounts: Accounts;
  getAccountIds: () => string[];
  createPlayerAccount: (draft: WritableDraft<StoreState>) => void;
  getBalance: (id: string) => Balance;
  getBet: (id: string) => Balance;
  getBalanceBills: (playerId: string, currency: string) => string[];
  getBetBills: (playerId: string, currency: string) => string[];
  getBetBillKeys: (playerId: string) => string[];
  getBalanceBillsCount: (playerId: string, currency: string) => number;
  getBetBillsCount: (playerId: string, currency: string) => number;
  hasBalanceBills: (playerId: string, currency: string) => boolean;
  hasBetBills: (playerId: string, currency: string) => boolean;
  shiftBillsDraft: (
    playerId: string,
    currency: string,
    draft: WritableDraft<StoreState>,
  ) => WritableDraft<StoreState>;
  shiftBills: (playerId: string, currency: string) => void;
  canBet: (playerId: string, amount: number) => boolean;
  addBetDraft: (
    playerId: string,
    currency: string,
    draft: WritableDraft<StoreState>,
  ) => WritableDraft<StoreState>;
  addBet: (playerId: string, currency: string) => void;
  removeBet: (playerId: string, currency: string) => void;
  handleBet: (playerId: string, currency: string) => void;
  transfetBetToBalance: (
    fromId: string,
    toId: string,
    draft: WritableDraft<StoreState>,
  ) => void;
  returnBetToBalance: (
    playerId: string,
    draft: WritableDraft<StoreState>,
  ) => void;
  getAllBetBills: () => Balance["bills"];
}
const useBankSlice: StoreStateCreator<BankState> = (set, get) => ({
  getAllBetBills: () => {
    var betBills: Balance["bills"] = {};
    get()
      .getAccountIds()
      .forEach((id) => {
        get()
          .getBetBillKeys(id)
          .forEach((currency) => {
            if (!betBills[currency]) betBills[currency] = [];
            betBills[currency] = betBills[currency].concat(
              get().getBetBills(id, currency),
            );
          });
      });
    return betBills;
  },
  transfetBetToBalance: (fromId, toId, draft) => {
    var to = draft.accounts[toId];
    var from = draft.accounts[fromId];
    Object.keys(from.bet.bills).forEach((currency) => {
      var bills = from.bet.bills[currency];
      bills.forEach((bill) => {
        to.balance.bills[currency].push(bill);
      });
      from.bet.bills[currency] = [];
    });

    to.balance.total += from.bet.total;
    from.bet.total = 0;
  },
  returnBetToBalance: (playerId, draft) => {
    var player = draft.accounts[playerId];
    Object.keys(player.bet.bills).forEach((currency) => {
      var bills = player.bet.bills[currency];
      bills.forEach((bill) => {
        player.balance.bills[currency].push(bill);
      });
      player.bet.bills[currency] = [];
    });
    player.balance.total += player.bet.total;
    player.bet = generateBalance(false);
  },
  accounts: {
    dealer: generateAccounts(true),
  },
  getAccountIds: () => Object.keys(get().accounts).map((id) => id),
  createPlayerAccount: (draft) => {
    if (!get().accounts[get().uid]) {
      draft.accounts[get().uid] = generateAccounts();
      return draft;
    }
  },
  getBalance: (playerId: string) => get().accounts[playerId].balance,
  getBet: (playerId: string) => {
    return get().accounts[playerId].bet;
  },
  getBalanceBills: (playerId, currency) =>
    get().accounts[playerId].balance.bills[currency],
  getBetBillKeys: (playerId) => Object.keys(get().getBet(playerId).bills),
  getBetBills: (playerId, currency) =>
    get().accounts[playerId].bet.bills[currency],
  getBalanceBillsCount: (playerId, currency) =>
    get().getBalanceBills(playerId, currency).length,
  getBetBillsCount: (playerId, currency) =>
    get().getBetBills(playerId, currency).length,
  hasBalanceBills: (playerId, currency) =>
    get().getBalanceBillsCount(playerId, currency) > 0,
  hasBetBills: (id, currency) => get().getBetBillsCount(id, currency) > 0,
  shiftBillsDraft: (playerId, currency, draft) => {
    const balance = get().getBalance(playerId);
    if (balance.total < parseInt(currency)) {
      return draft;
    }
    const largerBill = Object.keys(balance.bills).find(
      (currentCurrency) =>
        parseInt(currentCurrency) > parseInt(currency) &&
        get().getBalanceBillsCount(playerId, currentCurrency) > 0,
    );
    if (largerBill) {
      draft.accounts[playerId].balance.bills[largerBill].pop();
      draft.accounts[playerId].balance.bills[currency] = get()
        .getBalance(playerId)
        .bills[currency].concat(
          generateBills(
            Math.floor(parseInt(largerBill) / parseInt(currency)),
            largerBill.toString(),
          ),
        );
      return draft;
    } else {
      const smallerBills = Object.keys(balance.bills)
        .filter(
          (currentCurrency) => parseInt(currentCurrency) <= parseInt(currency),
        )
        .sort((a, b) => parseInt(b) - parseInt(a));
      var remainder = parseInt(currency);
      for (let index = 0; index < smallerBills.length; index++) {
        const currentCurrency = smallerBills[index];
        const billValue = parseInt(currentCurrency);
        const totalBillCount = balance.bills[currentCurrency].length;
        if (remainder === 0) {
          break;
        }
        const neededBillCount = Math.floor(remainder / billValue);
        const billCount =
          _.min([neededBillCount, totalBillCount]) || totalBillCount;
        remainder = remainder - billValue * billCount;
        const balanceSmallerBill = [...balance.bills[currentCurrency]];
        balanceSmallerBill.splice(0, billCount);
        draft.accounts[playerId].balance.bills[currentCurrency] =
          balanceSmallerBill;
      }
      draft.accounts[playerId].balance.bills[currency] = get()
        .getBalanceBills(playerId, currency)
        .concat(generateBills(1, currency));
      return draft;
    }
  },
  shiftBills: (playerId, currency) => {
    set((draft) => get().shiftBillsDraft(playerId, currency, draft));
  },
  canBet: (playerId, amount) =>
    get().accounts[playerId].balance.total >= amount,
  addBetDraft: (playerId, currency, draft) => {
    var bill = draft.accounts[playerId].balance.bills[currency].pop();
    if (bill) {
      draft.accounts[playerId].balance.total -= parseInt(currency);
      draft.accounts[playerId].bet.bills[currency].push(bill);
      draft.accounts[playerId].bet.total += parseInt(currency);
    }
    return draft;
  },
  addBet: (playerId, currency) =>
    set(
      (draft) => get().addBetDraft(playerId, currency, draft),
      false,
      `bank/addBet/${playerId}/${currency}`,
    ),

  removeBet: (id, currency) =>
    set(
      (draft) => {
        if (get().hasBetBills(id, currency)) {
          var bill = draft.accounts[id].bet.bills[currency].pop();
          if (bill) {
            draft.accounts[id].bet.total -= parseInt(currency);
            draft.accounts[id].balance.bills[currency].push(bill);
            draft.accounts[id].balance.total += parseInt(currency);
          }
        }
        return draft;
      },
      false,
      `bank/removeBet/${id}/${currency}`,
    ),
  handleBet: (id, currency) => {
    if (get().canBet(id, parseInt(currency))) {
      set(
        (draft) => {
          if (get().canBet(id, parseInt(currency))) {
            if (get().hasBalanceBills(id, currency)) {
              get().addBetDraft(id, currency, draft);
            } else {
              get().shiftBillsDraft(id, currency, draft);
              get().addBetDraft(id, currency, draft);
            }
          }
        },
        false,
        `bank/handleBet/${id}/${currency}`,
      );
    }
  },
});
export default useBankSlice;
