import {
  render, html, useState, useRef
} from "./vdom.mjs";

import { useSyncableStore, useFilter, useIndex } from "./hooks.mjs";


const Action = ({label,trigger,...props}) => html`<button
  type="button"
  onclick=${() => void trigger()}
  ...${props}
>${label}</button>`;


const Item = ({content:d}) => {
  return html`<div class="item">
    <label>ID: <code>${d.id}</code></label>
    <label>Value: <input value=${d.val} /></label>
  </div>`;
};

const List = ({items}) => {
  return html`<ul>
    ${items.map(d =>
      html`<li>
        <${Item} content=${d} />
        <${Action}
          label="Remove"
          trigger=${null}
        />
      </li>`
    )}
  </ul>`;
};


const LocalEditor = ({name}) => {
  const _objs = useRef([
    {id:1, val:"Hello"},
    {id:2, val:"Howdy"},
    {id:3, val:"OK"},
  ]);
  const db = useSyncableStore(_objs.current);
  
  //const matchingItems = useFilter(db, () => null, []);
  //const itemsByField = useIndex(db, () => d.id);
  const items = db.objects;
  console.log("HERE", items, db.objects);
  
  const [autoSave, setAutoSave] = useState(false);
  const maySave = !autoSave;
  const [autoSync, setAutoSync] = useState(false);
  const maySync = !autoSync;
  
  return html`<div class="local-editor">
    <h2>${name}</h2>
    
    <div class="controls">
      <div class="status-control save">
        <h3>Save status</h3>
        <p>
          <code>TODO</code>
        </p>
        <${Action}
          label="Save now"
          trigger=${() => {
            alert("TODO");
          }}
          disabled=${!maySave}
        />
        <label>
          <input type="checkbox"
            checked=${autoSave}
            oninput=${evt => {
              setAutoSave(evt.target.checked);
            }}
          />
          Automatic
        </label>
      </div>
      <div class="status-control sync">
        <h3>Sync status</h3>
        <p>
          <code>TODO: last sync</code>
        </p>
        <${Action}
          label="Sync now"
          trigger=${() => {
            alert("TODO");
          }}
          disabled=${!maySync}
        />
        <label>
          <input type="checkbox"
            checked=${autoSync}
            oninput=${evt => {
              setAutoSync(evt.target.checked);
            }}
          />
          Automatic
        </label>
      </div>
    </div>
    
    <${List} items=${items} />
    
    <form class="new-item"
      onsubmit=${evt => {
        evt.preventDefault();
        
        let _form = new FormData(evt.target),
            data = Object.fromEntries(_form);
        db.replace(null, data);
        console.log(db.objects);
      }}
    >
      <label>ID: <input name="id" size=4 /></label>
      <label>Value: <input name="val" /></label>
      <button>Add</button>
    </form>
  </div>`;
}

const RemoteDisplay = ({}) => html`<div class="remote-display" />`;

const Demo = ({}) => html`<div>
  <h1>cbdb</h1>
  
  <div class="editors">
    <${LocalEditor} name="Editor #1" />
    <${LocalEditor} name="Editor #2" />
  </div>
  <${RemoteDisplay} />
</div>`;

render(html`<${Demo} />`, document.body);
