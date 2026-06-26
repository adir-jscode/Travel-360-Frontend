export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function queryStringFormatter(searchParamsObj: {
  [key: string]: string | string[] | undefined;
}): string {
  const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
    } else if (value !== undefined && value !== "") {
      return `${key}=${encodeURIComponent(value)}`;
    }
    return "";
  });
  return queryArray.filter((q) => q !== "").join("&");
}

export function getDaysUntil(date: string | Date): number {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
