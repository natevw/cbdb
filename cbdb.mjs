
class SyncableStore {
  
  constructor() {
    this._subscribers = [];
    this._next_sub_id = 0;
    
    this._remoteMeta = {};
    this._remoteData = {};
    
    this._localMeta = {};
    this._localData = {};
  }
  
  _compare(
    {key:lkey, value:lval, version:lrev},
    {key:rkey, value:rval, version:rrev},
  ) {
    // -1 to choose left, 0 if equivalent, +1 to choose right
    
  }
  
  _resolve(lObj, rObj, key) {   // -> {value, version, status}
    let ord = this._compare(lObj, rObj);
    
    /*
    if no local change:
        {changed:false, conflict:false, source:'remote'}
    
    if only local change:
        {changed:true, conflict:false, source:'local'}
      
    if both change:
        {changed:true, conflict:true, source:___}
    */
    
    let changed /* locally */,
        conflict /* changed remotely too */,
        source /* local/remote */;
    
    let value, version, status = {source,changed,conflict};  
    // TODO: pick a winner if not equivalent, and/or determine general status
    
    return {value, version, status};
  }
  
  _checkChange(key, source) {
    let {value:lval, version:lrev} = getLocal(key),
        {value:rval, version:rrev} = getRemote(key),
        {status} = this._resolve(lval, rval, lrev, rrev, key);
    
    // TODO: stuff?
  }
  
  getLocal(key) {
    let hasKey = Object.prototype.hasOwnProperty.call(this._localData, key);
    return {
      key: (hasKey) ? key : null,
      value: this._localData[key],
      version: this._localMeta[key],
    };
  }
  
  setLocal({key, value, version}) {
    let orig = this._localData[key];
    this._localData[key] = value;
    this._localMeta[key] = version;
    if (value !== orig) {
      _checkChange(key, 'local');
    }
    this._notifySubscribers(key, 'local');
  }
  
  getRemote(key) {
    let hasKey = Object.prototype.hasOwnProperty.call(this._remoteData, key);
    return {
      key: (hasKey) ? key : null,
      value: this._remoteData[key],
      version: this._remoteMeta[key],
    };
  }
  
  setRemote({key, value, version}) {
    this._remoteData[key] = value;
    this._remoteMeta[key] = version;
    this._notifySubscribers(key, 'remote');
  }
  
  get(key) {    // -> {value,version,status}
    return this._resolve(
      getLocal(key),
      getRemote(key),
    );
  }
  
  set(key, value, version) {
    let oldObj = get(key),
        newObj = {key,value,version},
        diff = this._compare(oldObj, newObj);
    if (diff > 0) {
      this.setLocal(newObj);
    }
    // else `oldObj` was equivalent or better
    
  }
  
  _notifySubscribers(key, source) {
    // NOTE: this is currently triggered on any local/remote set!
    // conceptually, it might only be called if a visible `value`
    // (regardless of `version` or `source`) changes but perhaps
    // we shouldn't assume that the UI doesn't use the metadata?
    this._subscribers.forEach((d) => {
      d.cb(key, this, source);
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


