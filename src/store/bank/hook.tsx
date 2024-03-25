import useStore from "@/store/useStore";

export const useBankState = () =>
  useStore((state) => ({
    accounts: state.accounts,
  }));
export const useBankActions = () =>
  useStore((state) => ({
    getBalance: state.getBalance,
    getBet: state.getBet,
    getBalanceBills: state.getBalanceBills,
    getBetBills: state.getBetBills,
    getBalanceBillsCount: state.getBalanceBillsCount,
    getBetBillsCount: state.getBetBillsCount,
    hasBalanceBills: state.hasBalanceBills,
    hasBetBills: state.hasBetBills,
    shiftBills: state.shiftBills,
    canBet: state.canBet,
    addBet: state.addBet,
    removeBet: state.removeBet,
    handleBet: state.handleBet,
    getAllBetBills: state.getAllBetBills,
  }));
