import { CoreStore } from "./cbdb2.mjs";

const obj1 = {thing:1},
      obj2 = {thing:2},
      obj3 = {currentValue:0},
      obj4 = {another:1};

let db = new CoreStore([obj1,obj2,obj3]);
console.log("Objects:", db.objects);

const obj3b = {currentValue:42};
db.replace(obj3, obj3b);
console.log("Objects:", db.objects);

db.replace(null, obj4);
console.log("Objects:", db.objects);

db.updateOriginal(obj3, {differentValue:true});
console.log("Changes:", db.changes);



export function useSyncableStore() {
  
}

export function useFilter() {
}

export function useIndex() { 
}
