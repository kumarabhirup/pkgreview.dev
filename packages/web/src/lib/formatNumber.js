export default function formatNumber(x) {
  const parts = x?.toString()?.split('.')
  if (parts) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts?.join('.') || null
}
