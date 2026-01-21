import { create } from 'zustand';
import type { Member } from '../types/member_types';

export interface LoginState{
    user: Member | null,
    setUser: (member:Member | null) => void
}
export const useLoginStore = create<LoginState>()(
    (set) => ({
        user: null,
        setUser: (member) => set({ user: member }),
    }),
);