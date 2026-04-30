export function formatTomanFa(value: number): string {
  try {
    return `${new Intl.NumberFormat('fa-IR').format(value)} تومان`;
  } catch {
    return `${value} تومان`;
  }
}
