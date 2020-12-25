
class SyncableStore {
  
  constructor() {
    this._remoteMeta = {};
    this._remoteData = {};
    
    this._localMeta = {};
    this._localData = {};
  }
  
  _compare(lval, rval, lrev, rrev, key) {   // -1 if lval, 0 if equivalent, +1 if rval
      
  }
  
  _resolve(lval, rval, lrev, rrev, key) {   // -> {value, version, status}
    let ord = this._compare(lval, rval, lrev, rrev, key);
    
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
  
  _checkChange(key) {
    let {value:lval, version:lrev} = getLocal(key),
        {value:rval, version:rrev} = getRemote(key),
        {status} = this._resolve(lval, rval, lrev, rrev, key);
    
    // TODO: stuff?
  }
  
  setLocal(key, value, status) {
    let {value:rval, version:rrev} = getRemote(key);
        tbd = _resolve(value, rval, status, rrev, key);
    if (tbd.changed) {
      // _ set _
    } else {
      // _ set _
    }
    
    this._localData[key] = value;
    this._localMeta[key] = status;
    _checkChange(key);
  }
  
  getLocal(key) {
    let value = this._localData[key],
        version = this._localMeta[key];
    return {value,version};
  }
  
  setRemote(key, value, status) {
    this._remoteData[key] = value;
    this._remoteMeta[key] = status;
    _checkChange(key);
  }
  
  getRemote(key) {
    let value = this._remoteData[key],
        version = this._remoteMeta[key];
    return {value,version};
  }
  
  get(key) {    // -> {value,version,status}
    let {value:lval, version:lrev} = getLocal(key),
        {value:rval, version:rrev} = getRemote(key);
    return this._resolve(lval, rval, lrev, rrev, key);
  }
  
  subscribe() {
    // notifies only if **value** changes
  }
  
}


