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
  accessToken: string | null;
  user: UserType | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setUser: (user: UserType) => void;
  clearUser: () => void;
};

const createAuthSlice: StateCreator<AuthState> = (set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
});

type StoreType = AuthState;

export const useStoreBase = create<StoreType>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
      })),
      {
        name: "session-storage",
        getStorage: () => sessionStorage,
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);
