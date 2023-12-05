export default (text: string, length: number = 0): string => {
  const padLength = length - text.length;
  return padLength > 0 ?
    ' '.repeat(padLength) + text :
    text;
}