import { BankState } from "@/store/bank/slice";
import { DeckState } from "@/store/deck/slice";
import { PlayerState } from "@/store/player/slice";
import { TableState } from "@/store/table/slice";

export type StoreState = BankState & DeckState & TableState & PlayerState;
