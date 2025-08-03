export function formatDateIsoLocal(datetimeStr) {
  const d = new Date(datetimeStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}
