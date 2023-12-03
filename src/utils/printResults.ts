export default (result: number, start: number) => {
  const end = performance.now();
  console.log(`The result is: ${result}`);
  console.log(`Runtime was: ${(end - start).toFixed(0)}ms`)
}