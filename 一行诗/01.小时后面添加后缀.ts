const suffixAmPmTs = (h: number): string => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`;

console.log(
    suffixAmPmTs(12)
)