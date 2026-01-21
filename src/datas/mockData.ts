import { type Member } from "../types/member_types";
export const SampleMembers: Member[] = [
  {
    id: "1",
    name: "김민수",
    phone: "010-1234-5678",
    role: "MEM",
    join_date: "2026-01-10",
    status: "active",
    back_number: 1,
    position1: "MF",
    position2: "DF",
    main_foot: "right",
    level: "good",
    note: "테스트",
    updated_at: new Date("2026-01-10")
  },
  {
    id: "2",
    name: "이지은",
    phone: "010-2345-6789",
    role: "MEM",
    join_date: "2026-01-10",
    status: "inactive",
    back_number: 1,
    position1: "MF",
    position2: "DF",
    main_foot: "right",
    level: "good",
    note: "테스트",
    updated_at: new Date("2026-01-10")
  },
 ];