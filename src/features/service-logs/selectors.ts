import type { RootState } from "../../app/store";
import type { ServiceType } from "../drafts/types";

export type LogsFilters = {
    q: string;
    type: ServiceType | "all";
    startFrom: string;
    startTo: string;
};

export const selectLogsOrder = (s: RootState) => s.logs.order;
export const selectLogById = (id: string) => (s: RootState) => s.logs.logs[id];

export const selectAllLogs = (s: RootState) =>
    s.logs.order.map((id) => s.logs.logs[id]).filter(Boolean);

function inRange(value: string, from: string, to: string) {
    if (from && value < from) return false;
    return !(to && value > to);

}

export function selectFilteredLogs(filters: LogsFilters) {
    return (s: RootState) => {
        const all = selectAllLogs(s);
        const q = filters.q.trim().toLowerCase();

        return all.filter((log) => {
            const d = log.data;

            if (filters.type !== "all" && d.type !== filters.type) return false;

            if (!inRange(d.startDate, filters.startFrom, filters.startTo)) return false;

            if (!q) return true;
            const haystack = [
                d.providerId,
                d.serviceOrder,
                d.carId,
                d.serviceDescription,
                d.type,
                d.startDate,
                d.endDate,
            ]
                .join(" ")
                .toLowerCase();

            return haystack.includes(q);
        });
    };
}
