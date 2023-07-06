import { DB } from "https://deno.land/x/sqlite@v3.7.2/mod.ts";

type StoredTreeTuple = [number, string, string, string];

const db = new DB("relayer.db");
// I want to store the merkle root and the leaves of the tree (commitments) in the database
// For Bunny Bundles!
// The root is a string and the  leaves are a json with an array of strings inside
db.execute(`
  CREATE TABLE IF NOT EXISTS merkleTrees (
    id INTEGER PRIMARY KEY,
    root TEXT NOT NULL UNIQUE,
    leaves TEXT NOT NULL,
    network TEXT NOT NULL
  )
`);

const addMerkleTree = db.prepareQuery(
  "INSERT INTO merkleTrees (root, leaves,network) VALUES (:root, :leaves, :network)",
);

const getMerkleTreeByRoot = db.prepareQuery<StoredTreeTuple>(
  "SELECT root,leaves,network FROM merkleTrees WHERE root = :root AND network = :network",
);

export function runAddMerkleTree(
  root: string,
  leaves: string[],
  network: string,
): boolean {
  try {
    addMerkleTree.execute({ root, leaves: JSON.stringify(leaves), network });
    return true;
  } catch (_err) {
    return false;
  }
}

export function getMerkleTree(root: string, network: string) {
  return getMerkleTreeByRoot.first({ root, network });
}
