
export class CoreStore {
  
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
      this._indexByObject.set(obj, idx);
    });
    
    /*
    This map stores the value of any state that has been locally modified,
    keyed by each index in `_sourceObjects` which has been `replace()`d.
    */
    this._localReplacements = new Map();
    
    
    // these support our simple pub-sub mechanism
    this._subscribers = [];
    this._next_sub_id = 0;
  }
  
  get objects() {
    return this._sourceObjects.map((obj, idx) =>
      this._localReplacements.has(idx) ?
        this._localReplacements.get(idx) : obj
    ).filter((obj) =>
      obj !== null
    );
  }
  
  get changes() {
    return Array.from(this._localReplacements.entries(), ([idx, lclObj]) => {
      let srcObj = this._sourceObjects[idx];
      return {
        current: lclObj,
        original: srcObj
      };
    }).filter(({current,original}) =>
      current !== original
    );
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
  
  _throwIfDuplicate(obj, newIdx) {
    let idx = this._indexByObject.get(obj);
    if (idx != null && idx !== newIdx) {
      // we have tracked this object under a different identity;
      // this is okay so long as it is NOT still in use thereby!
      let active = (
        this._sourceObjects[idx] === obj ||
        this._localReplacements.get(idx) === obj
      );
      if (active) throw Error("The provided object is currently in use by another state.");
    }
  }
  
  replace(obj, newObj) {
    // NOTE: `obj` could be an original, or an existing replacement!
    let idx = this._getIndex(obj);
    if (newObj !== null) {
      this._throwIfDuplicate(newObj, idx);
      this._indexByObject.set(newObj, idx);
    }
    this._localReplacements.set(idx, newObj);
    this._notifySubscribers();
  }
  
  resolve(obj) {
    // forget any local state overrides
    let idx = this._getIndex(obj);
    this._localReplacements.delete(idx);
    this._notifySubscribers();
  }
  
  updateOriginal(obj, newObj) {
    let idx = this._getIndex(obj);
    if (newObj !== null) {
      this._throwIfDuplicate(newObj, idx);
      this._indexByObject.set(newObj, idx);
    }
    this._sourceObjects[idx] = newObj;
    this._notifySubscribers();
  }
  
  
  _notifySubscribers() {
    // NOTE: this is currently triggered on any local/remote set!
    // conceptually, it might only be called if a visible `value`
    // (regardless of `version` or `source`) changes but perhaps
    // we shouldn't assume that the UI doesn't use the metadata?
    this._subscribers.forEach((d) => {
      d.cb.call(this, arguments);
    });
  }
  
  _unsubscribe(id) {
    this._subscribers = this._subscribers.filter(d => d.id !== id);
  }
  
  subscribe(cb) {
    let id = this._next_sub_id++;
    this._subscribers.push({id,cb});
    return () => {
      this._unsubscribe(id);
    };
  }
  
}



export class TripleStore {
  
  constructor(initialObjects=[]) {
    this._db = new CoreStore(initialObjects);
    
    this._getKey = d => d;
    this._checkEqual
  }
  
  _getObject(key) {
    // {key,value,version}
    
  }
  
  has(key) {
    // TODO: this needs to handle (locally) `delete()`d keys somehow…
    return this._getObject(key) !== null;
  }
  
  get(key) {
    let obj = this._getObject(key);
    if (obj) return obj.value;
  }
  
  set(key, value) {
    let obj = this._getObject(key);
    this._db.replace(obj || null, {key,value,version:null});
  }
  
  delete(key) {
    let obj = this._getObject(key);
    if (obj) this._db.replace(obj, null);
  }
  
  // convenience function
  update(key, props) {
    let oldVal = this.get(key),
        newVal = Object.assign({}, oldVal, props);
    this.set(key, newVal);
  }
  
  
  
  setSource(key, val) {
    
  }
  
  
  
}
