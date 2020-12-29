import { h, render } from 'https://unpkg.com/preact@latest?module';
import { useState } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import htm from "https://unpkg.com/htm@latest/dist/htm.module.js?module";

const html = htm.bind(h);


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

const List = ({}) => {
  const items = [
    {id:1, val:"Hello"},
    {id:2, val:"Howdy"},
    {id:3, val:"OK"},
  ];
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
  const db = useSyncableStore();
  const matchingItems = useFilter(db, () => null, []);
  const itemsByField = useIndex(db, () => d.id);
  
  //db.replaceObject
  //db.replaceOriginal
  
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
        
      }}
    >
      <label>ID: <input name="new-id" size=4 /></label>
      <label>Value: <input name="new-val" /></label>
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
