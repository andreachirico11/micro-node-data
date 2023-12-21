export function getSqlDate(date: Date) {
  return date.toISOString().split('T').join(' ').split('Z').join('');
}

export function getActualDateWithAddedHours(hoursTOAdd: number) {
  return new Date(new Date().getTime() + hourToMs(hoursTOAdd));
}

export function hourToMs(hour: number) {
    return hour * 60 * 60 * 1000;
}

export function isDateInThePast(d: Date) {
  return Date.now() > d.getTime();
}
