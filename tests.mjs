import { strict as assert } from 'assert';

import { CoreStore } from "./cbdb2.mjs";

const obj1 = {thing:1},
      obj2 = {thing:2},
      obj3 = {currentValue:0},
      obj3v2 = {differentValue:true},
      obj3b = {currentValue:42},
      obj3c = {currentValue:-1},
      obj4 = {another:1},
      obj5 = {another:1};

let db = new CoreStore([obj1,obj2,obj3]);

// TODO: do we really want to guarantee order? check for each object instead? [others below…]
assert.deepEqual(db.objects, [obj1,obj2,obj3], "Should contain the objects we gave it.");

assert.equal(db.changes.length, 0, "Shouldn't be any changes off the bat.");

let notifyCount = 0;
const countNotifications = () => {
  ++notifyCount;
};


const unsubscribe = db.subscribe(countNotifications);

db.replace(obj3, obj3b);
assert.equal(db.changes.length, 1, "Should have a change.");
assert.equal(notifyCount, 1, "Subscriber callback should have fired.");
assert.deepEqual(db.changes, [{current:obj3b, original:obj3}], "Change should expose correct information.");

const unsubscribe2 = db.subscribe(countNotifications);

notifyCount = 0;
db.replace(null, obj4);
assert.equal(db.objects.length, 4, "Should have an additional object now.");
assert.equal(notifyCount, 2, "Subscriber callback should have fired twice (once for each subscriber).");
assert.deepEqual(db.changes, [{current:obj3b, original:obj3},{current:obj4,original:null}], "Changes should be up-to-date.");

assert.throws(() => {
  db.replace(null, obj4);
}, "Shouldn't be allowed to add duplicate copies of an object.");

db.replace(obj4, null);
assert.deepEqual(db.changes, [{current:obj3b, original:obj3}], "Changes should filter out temporary local objects.");

assert.doesNotThrow(() => {
  db.replace(null, obj4);
}, "Should be able to restore an earlier object if not a duplicate.");

notifyCount = 0;
unsubscribe();
db.replace(null, obj5);
assert.equal(db.objects.length, 5, "Should have an additional object despite same content.");
assert.equal(notifyCount, 1, "Subscriber callback should have fired once (for remaining subscriber).");

assert.doesNotThrow(() => {
  unsubscribe2();
  unsubscribe2();
}, "No problem calling unsubscribe helper multiple times");

notifyCount = 0;
db.replace(obj3b, obj3c);
assert.equal(notifyCount, 0, "No notifications should have been received.");
assert.equal(db.objects.length, 5, "Number of objects shouldn't change.");
assert.notEqual(db.objects.indexOf(obj3c), -1, "New object should be listed.");
assert.equal(db.objects.indexOf(obj3b), -1, "Old object should NOT be listed.");

let objectsBefore = db.objects,
    changesBefore = db.changes;
db.updateOriginal(obj3, obj3v2);
assert.deepEqual(db.objects, objectsBefore, "Objects shouldn't change when updating a locally-replaced original.");
assert.notDeepEqual(db.changes.map(d => d.original), changesBefore.map(d => d.original), "Original fields of changes should differ.");
assert.deepEqual(db.changes.map(d => d.current), changesBefore.map(d => d.current), "Current fields of changes shouldn't differ.");

db.resolve(obj3);
assert.notEqual(db.objects.indexOf(obj3v2), -1, "Replaced version of original object should now be exposed.");
assert.equal(db.changes.length, changesBefore.length - 1, "Should have one less change after local resolution.");

console.log("Seems legit.");
