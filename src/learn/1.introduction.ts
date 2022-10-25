import { log, delimeterMsg, logF } from '../util';

function installations() {
  log(
    `Why PosgreSQL:

    - Object relational database that is keeping the SQL standarts
    - Excels at concurrency
    - Superior at avoiding data corruption
    - Custom Data Types, Operators & Index types
    - Extensible, Scalable & protects your data
    `,
  );
}

export default function introduction() {
  delimeterMsg('INTRODUCTION');
  logF(installations);
}
