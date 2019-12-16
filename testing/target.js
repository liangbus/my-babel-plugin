var foo = 1, bar = 2

debugger;

foo === bar

console.error('Something wrong!!')
n = 2;
var count = 10
if(n === 1 && flag && count < 50) {
  alert(123) 
}
/**
 * square
 * @param {*} n 
 */
function square(n) {
  return n * n
}
// testing comment
let outer = 'I am outer string'
function testingFn() {
  let count = 0
  outer = 'outer in function body'
  return () => {
    return count++
  }
}

const addCount = testingFn()

console.log('testing babel plugin!')

