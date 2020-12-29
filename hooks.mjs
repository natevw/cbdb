import {
  useRef, useMemo, useState, useEffect
} from "./vdom.mjs";

import { CoreStore } from "./cbdb.mjs";


const UNSET = Symbol('useStable-uninitialized');



function useStable(fn, deps) {
  // WORKAROUND: https://twitter.com/natevw/status/1344063848521760769
  
  // TODO: 
  //  see `useMemo` at https://github.com/preactjs/preact/blob/91016b/hooks/src/index.js#L214
  //  and `argsChanged` at https://github.com/preactjs/preact/blob/91016b/hooks/src/index.js#L376
  
  
  const ref = useRef(UNSET);
  // TODO: handle `deps`!
  if (ref.current === UNSET) {
    ref.current = fn();
  }
  return ref.current;
}


export function useSyncableStore(initialObjs) {
  // TODO: React threatens not to rely on semantic equivalence here — migrate to `useRef`?
  const db = useStable(() =>
    new CoreStore(initialObjs),
  [initialObjs]);
  
  const [ctr,setCtr] = useState(0);
  
  useEffect(() =>
    db.subscribe(() => {
      console.log("Database changed.");
      setCtr(ctr+1);
    }),
  [db]);
  
  return db;
}

export function useFilter() {
}

export function useIndex() { 
}
