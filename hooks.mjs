import {
  useCallback, useMemo, useState, useEffect
} from "./vdom.mjs";

import { CoreStore } from "./cbdb.mjs";

// WORKAROUND: https://twitter.com/natevw/status/1344063848521760769
// TODO: if the imported `useMemo` stops providing semantic stability,
//       replace this with an implementation that does.
//  see `useMemo` at https://github.com/preactjs/preact/blob/91016b/hooks/src/index.js#L214
//  and `argsChanged` at https://github.com/preactjs/preact/blob/91016b/hooks/src/index.js#L376  
const useStable = useMemo;

function useRefresh() {
  // HT: https://stackoverflow.com/a/53215514/179583
  const [, setShamValue] = useState();
  return useCallback(() =>
    setShamValue(new Object()),
  []);
}

const objectIdentity = d => d;

export function useSyncableStore(initialObjs, key=objectIdentity) {
  const db = useStable(() =>
    new CoreStore(initialObjs),
  []);
  
  // TODO: could/should we do anything if `initialObjs` changes?
  //       (seems like we would need to know external identifiers…)
  
  const forceUpdate = useRefresh();
  useEffect(() =>
    db.subscribe(() => {
      console.log("Database changed.");
      forceUpdate();
    }),
  [db]);
  
  return db;
}

export function useFilter() {
}

export function useIndex() { 
}
