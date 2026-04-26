import { create } from 'zustand';

type FaqHubState = {
  activeCategoryId: number | null;
  searchQuery: string;
  setActiveCategoryId: (id: number) => void;
  setSearchQuery: (q: string) => void;
};

export const useFaqHubStore = create<FaqHubState>(set => ({
  activeCategoryId: null,
  searchQuery: '',
  setActiveCategoryId: id => {
    set({ activeCategoryId: id });
  },
  setSearchQuery: q => {
    set({ searchQuery: q });
  },
}));
