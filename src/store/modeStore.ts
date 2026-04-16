import { create } from 'zustand';

type Mode = 'founder' | 'vc' | null;

interface ModeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  selectedFund: string;
  setSelectedFund: (fund: string) => void;
}

export const useModeStore = create<ModeState>((set) => ({
  mode: null,
  setMode: (mode) => set({ mode }),
  selectedFund: 'Sequoia Capital',
  setSelectedFund: (fund) => set({ selectedFund: fund }),
}));
