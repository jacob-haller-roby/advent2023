export default async (test: () => Promise<number>) => {
  const start = performance.now();
  const result = await test();
  const end = performance.now();
  console.log(`The result is: ${result}`);
  console.log(`Runtime was: ${(end - start).toFixed(0)}ms`)
}