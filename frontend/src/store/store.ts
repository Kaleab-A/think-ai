import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import createSelectors from "./selectors";

type UserType = {
  name: string;
  username: string;
  email: string;
};

type AuthState = {
  user: UserType | null;
  accessToken: string | null;
  expiresAt: number | null;

  setUser: (user: UserType | null) => void;
  setAccessToken: (token: string | null) => void;
  setExpiresAt: (expiresAt: number | null) => void;

  clearUser: () => void;
  clearAccessToken: () => void;
  clearExpiresAt: () => void;
};

const createAuthSlice: StateCreator<AuthState> = (set) => ({
  user: null,
  accessToken: null,
  expiresAt: null,

  setAccessToken: (token) => set({ accessToken: token }),
  setExpiresAt: (expiresAt: number | null) => set({ expiresAt }),
  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
  clearAccessToken: () => set({ accessToken: null }),
  clearExpiresAt: () => set({ expiresAt: null }),
});

type StoreType = AuthState;

export const useStoreBase = create<StoreType>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
      })),
      {
        name: "local-storage",
        getStorage: () => localStorage,
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);
