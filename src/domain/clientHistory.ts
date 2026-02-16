import type { Client, ClientHistoryItem } from "@/types";

const FALLBACK_CLIENT_HISTORY: ClientHistoryItem[] = [
  {
    id: 101,
    date: "14 Feb 2024",
    type: "San Valentín",
    table: "105",
    items: ["Dom Pérignon '12", "Carpaccio Wagyu", "Solomillo Rossini x2"],
    total: 850.0,
    status: "Completado",
  },
  {
    id: 99,
    date: "02 Feb 2024",
    type: "Cena Casual",
    table: "104",
    items: ["Vino Blanco", "Tabla de Quesos"],
    total: 120.0,
    status: "Completado",
  },
  {
    id: 98,
    date: "20 Ene 2024",
    type: "Cena Negocios",
    table: "102",
    items: ["Vino Tinto Reserva", "Lubina Salvaje x3"],
    total: 420.5,
    status: "Completado",
  },
  {
    id: 85,
    date: "15 Dic 2023",
    type: "Cena Casual",
    table: "104",
    items: ["Old Fashioned x2", "Ostras Fine de Claire"],
    total: 145.0,
    status: "Completado",
  },
  {
    id: 72,
    date: "02 Nov 2023",
    type: "Aniversario",
    table: "VIP-1",
    items: ["Menú Degustación x2", "Maridaje Premium"],
    total: 1200.0,
    status: "Completado",
  },
];

export interface GroupedClientHistory {
  key: string;
  items: ClientHistoryItem[];
}

export const resolveClientHistory = (client: Client): ClientHistoryItem[] =>
  client.history.length > 0 ? client.history : FALLBACK_CLIENT_HISTORY;

export const buildGroupedClientHistory = (
  history: ClientHistoryItem[]
): GroupedClientHistory[] => {
  const groupsByKey = new Map<string, ClientHistoryItem[]>();

  for (const item of history) {
    const dateParts = item.date.split(" ");
    const month = dateParts[1];
    const year = dateParts[2];
    const groupKey = month && year ? `${month} ${year}` : "Reciente";

    const existing = groupsByKey.get(groupKey);
    if (existing) {
      existing.push(item);
      continue;
    }

    groupsByKey.set(groupKey, [item]);
  }

  return Array.from(groupsByKey.entries()).map(([key, items]) => ({ key, items }));
};

export const calculateClientHistoryTotals = (history: ClientHistoryItem[]) => ({
  totalSpend: history.reduce((acc, item) => acc + item.total, 0),
  totalVisits: history.length,
});
