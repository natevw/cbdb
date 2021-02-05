# cbdb

Status: this repo contains several **EXPERIMENTS** that have been abandoned and/or backburnered in an unfinished (and undocumented) state. Feel free to use the issues tracker here for discussion, but what I ended up doing instead was rewriting **[Memcouch](https://github.com/natevw/memcouch)** itself as a solution to the problems I was wrestling with.

----


`cbdb` helps you build auto-saving and auto-syncing JavaScript apps.

It is an in-memory "state container" (sort of like [Redux](https://redux.js.org/) or [unistore](https://github.com/developit/unistore)) but designed to synchronize with a persistent and/or shared database (e.g. CouchDB or GraphQL) using an API adapter in the background.

```
UI ↔︎ (working copy) ↔︎ API
```

Data in a `cbdb` instance is tracked in a key-value fashion and can also be queried as an array. When data is changed, `cbdb` remembers the working copy and helps you eventually merge the work back into its primary source.


## Example

This could be your app:

```
```

None of the core methods of `cbdb` are shown in this example! Those are boring.


```
import {SyncableStore} from 'cbdb';

const db = new SyncableStore();

```


leverages reselect or hooks




You can use it with PouchDB for "offline first" apps, or with CouchDB for "offline second" apps, or with any other server API that shares state changes.








## Background

see memcouch

`cbdb` is short for Chair-Brain DB, which is short for a tangled web of puns involving:

* chairs being single user couches
* the fact that the animals with pouches lack a corpus callosum between the two halves of their brains
* a hint of PEBKAC on my own part; the interfaces I build are supposed to handle conflicting edits and I/O errors but I am rarely that computer savvy


## License

TODO: another distracting decision
