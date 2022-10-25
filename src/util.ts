// nodejs only logs

function delimeterMsg(str: string) {
  const msg = `*************** ${str} *****************`;
  console.log('');
  console.log(`\x1b[32m%s\x1b[0m`, msg);
  console.log('');
}

function log(...args: any[]) {
  console.log(...args);
}

function logF(f: (args: any) => void, ...args: any) {
  const name = splitToWords(f.name);
  console.log('\x1b[33m%s\x1b[0m', name);
  f(args);
}

function splitToWords(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((str, i) => (i === 0 ? capitalize(str) : str.toLowerCase()))
    .join(' ');
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { log, logF, delimeterMsg };
