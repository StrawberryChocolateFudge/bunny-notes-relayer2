//An in-memory mutex to reject repeated requests with the same commitment
//to disallow wasting resources

// A little in memory kv store to protect from spam requests!
// after the tx is sent, the commitment is saved in memory,
// when another request comes the commitment is checked!
// The value is a time and if it's older than 10 minutes it will be deleted.
// That is plenty of time to mine blocks and allow a retry in 10 min if something goes wrong
//it should never occur naturally, only if there is DDOS or other attack!

const map = new Map();

export const EXPIRYTIME = 600000;

export const MUTEXERRORMESSAGE =
  "Transaction already dispatched! If it returned an error, you need to wait 10 minutes try again!";

function readCommitment(commitment: string) {
  return map.get(commitment);
}

function writeCommitment(commitment: string, date: number) {
  return map.set(commitment, date);
}

function deleteCommitment(commitment: string) {
  return map.delete(commitment);
}

export function requestMutex(commitment: string, expiryTime: number) {
  // checking if the commitment is in the KV, this is to protect against spamming
  const kvCommitment = readCommitment(commitment);
  if (kvCommitment !== undefined) {
    // If the date of the commitment is less than 10 min then it's an error,
    // otherwise I delete the commitment and allow try again! 10 min is plenty of block time (this is an edge case)

    const timeNow = new Date().getTime();

    if ((timeNow - kvCommitment) < expiryTime) {
      return [
        false,
        MUTEXERRORMESSAGE,
      ];
    } else {
      deleteCommitment(commitment);
    }
  }
  // save the commitment to memory so I know the transaciton has been dispatched for it!
  writeCommitment(commitment, new Date().getTime());
  return [true, ""];
}
