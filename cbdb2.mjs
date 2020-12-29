
class SyncableStore {
  
  constructor(initialObjects=[]) {
    /*
    This array contains the "original" value of **all** tracked objects.
    `null` values within this array represent objects that have been deleted
    (or not yet created) at the original source.
    
    These values may change through time — see `updateOriginal()` method —
    because the source may change an "original" value whenever it pleases.
    The values in this array are intended to reflect the values of a set of
    (often shared) remote/source states at least so far as currently known.
    
    NOTE: objects are in a sense "identified" (internally) via their [stable]
          position in this array (by way of the `_indexByObject` property)!
    */
    this._sourceObjects = [...initialObjects];
    
    /*
    There may be many versions of each state object that is/has been tracked.
    This map keeps track of the index within the `_sourceObjects` array for
    all states that are still live (whether original or a local replacement).
    */
    this._indexByObject = new WeakMap();
    
    this._sourceObjects.forEach((obj, idx) => {
      // add each initial state object
      this._indexByObject[obj] = idx;
    });
    
    /*
    This map stores the value of any state that has been locally modified,
    keyed by each index in `_sourceObjects` which has been `replace()`d.
    */
    this._localReplacements = new Map();
  }
  
  get objects() {
    this._sourceObjects.map((obj, idx) =>
      this._localReplacements.has(idx) ?
        this._localReplacements.get(idx) : obj
    ).filter((obj) =>
      obj !== null
    );
  }
  
  get changes() {
    return this._localReplacements.entries().map(([idx, lclObj]) => {
      let srcObj = this._sourceObjects[idx];
      return {
        current: lclObj,
        original: srcObj
      };
    });
  }
  
  _getIndex(obj=null) {
    let idx;
    if (obj === null) {
      // reserve a tracking slot in main array
      idx = this._sourceObjects.push(null) - 1;
    } else if (this._indexByObject.has(obj)){
      idx = this._indexByObject.get(obj);
    } else {
      throw Error("Unknown object!");
    }
    return idx;
  }
  
  replace(obj, newObj) {
    // NOTE: `obj` could be an original, or an existing replacement!
    let idx = this._getIndex(obj);
    this._localReplacements.set(idx, newObj);
    if (newObj !== null) {
      this._indexByObject.set(newObj, idx);
    }
    this._changed();
  }
  
  resolve(obj) {
    // forget any local state overrides
    let idx = this._getIndex(obj);
    this._localReplacements.delete(idx);
    this._changed();
  }
  
  updateOriginal(obj, newObj) {
    let idx = this._getIndex(obj);
    this._originalObjects[idx] = newObj;
    if (newObj !== null) {
      this._indexByObject.set(newObj, idx);
    }
    this._changed();
  }
  
}
