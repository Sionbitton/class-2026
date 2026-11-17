const fs = require('fs'), vm = require('vm'), assert = require('assert');
const root = require('path').resolve(__dirname, '..');
function environment(){
 const elements=new Map(), messages=[], storage=new Map(), timers=[];
 class Element {
  constructor(tag='div'){this.tagName=tag;this.children=[];this.listeners={};this.style={};this.dataset={};this.value='';this.textContent='';this.disabled=false;this.hidden=false;this.width=640;this.height=512;this.complete=true;this.naturalWidth=64;this.clientWidth=640;this.clientHeight=480;this.classList={add(){},remove(){}};this.style.removeProperty=()=>{};}
  addEventListener(type,fn){(this.listeners[type] ||= []).push(fn)}
  async emit(type,props={}){for(const fn of this.listeners[type]||[])await fn({preventDefault(){},submitter:new Element('button'),...props})}
  append(...items){this.children.push(...items);for(const item of items)if(typeof item==='object')item.parent=this} appendChild(item){this.append(item)} replaceChildren(...items){this.children=items}
  setAttribute(name,value){this[name]=value} getContext(){return new Proxy({},{get:()=>()=>{}})}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)} querySelectorAll(s){return this.children.filter(x=>x.className===s.slice(1))} focus(){} scrollIntoView(){} setPointerCapture(){} getBoundingClientRect(){return {left:0,top:0,width:640,height:480}}
 }
 const document={querySelector(s){if(!elements.has(s))elements.set(s,new Element());return elements.get(s)},querySelectorAll:s=>[...elements.values()].flatMap(x=>x.querySelectorAll(s)),getElementById:id=>document.querySelector('#'+id),createElement:t=>new Element(t),createTextNode:t=>t,head:new Element()};
 const window=new Element();window.innerWidth=1000;window.innerHeight=700;
 const sandbox={document,window,console:{log:(...x)=>messages.push(x.join(' '))},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},MutationObserver:class{observe(){}},setInterval:()=>1,clearInterval(){},URL,URLSearchParams,setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){},requestAnimationFrame(){},Image:Element,AudioContext:class{resume(){return Promise.resolve()}createOscillator(){return {frequency:{},connect(){},start(){},stop(){}}}createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}},Math,Map};
 vm.createContext(sandbox);
 return {sandbox,elements,document,window,messages,storage,timers,run:code=>vm.runInContext(code,sandbox),load:n=>vm.runInContext(fs.readFileSync(root+`/js/${n}/index.js`,'utf8').replace(/export \{[^}]+\};?/g,''),sandbox)};
}
(async()=>{
 let e=environment();e.run(fs.readFileSync(root+'/js/70/options.js','utf8'));e.load(70);
 e.run('addPart(parts[0]);saveDraft()');assert.equal(JSON.parse(e.storage.get('spud-studio-current-v1')).parts.length,1);
 const item=e.document.querySelector('#stage').children[0];await item.emit('pointerdown',{button:0,pointerId:1,clientX:320,clientY:187});await item.emit('pointermove',{pointerId:1,clientX:400,clientY:240});assert.equal(item.style.left,'62.5%');
 await e.document.querySelector('#rotate').emit('click');assert.equal(item.dataset.rotation,'15');
 await e.document.querySelector('#save-form').emit('submit');assert.equal(JSON.parse(e.storage.get('spud-studio-pals-v1')).length,1);
 e.run('saveDraft();reset();openPal(JSON.parse(localStorage.getItem(draftKey)))');assert.equal(e.document.querySelector('#stage').querySelectorAll('.placed').length,1);
 await e.document.querySelector('#music').emit('click');assert.equal(e.run('musicTimer'),1);await e.document.querySelector('#music').emit('click');assert.equal(e.run('musicTimer'),null);
 console.log('70/74 shared game: adding, custom pointer dragging, rotation, named save, draft restoration, music toggle PASS');
 e=environment();e.load(71);assert.deepEqual(e.messages,['now going at speed 60','Color: blue, speed: 60','now FLYING at speed 500','Color: white, speed: 500']);assert.equal(e.run('plane instanceof Vehicle && plane instanceof Plane && plane.constructor === Plane'),true);console.log('71: constructor, inherited print, overridden go and independent state PASS');
 e=environment();e.load(72);assert(e.run(`(()=>{const b=new Ball('red',25);b.x=999;b.y=999;b.move(.04,false);return b.x===615&&b.y===487&&b.dx<0&&b.dy<0})()`));console.log('72: ball bounds and reflected velocities PASS');
 e=environment();e.load(73);await e.document.querySelector('#start').emit('click');assert(e.run('apple.x%64===0 && apple.y%64===0 && !segments.some(s=>s.x===apple.x&&s.y===apple.y)'));
 e.run('apple={x:192,y:192};tick()');assert.equal(e.run('score'),1);assert.equal(e.run('segments.length'),2);assert(e.run('speed<350'));
 await e.window.emit('keydown',{key:'ArrowLeft'});assert.equal(e.run('nextDirection'),'ArrowRight');
 e.run("segments=[{x:576,y:192}]; direction=nextDirection='ArrowRight';tick()");assert.equal(e.run('running'),false);
 await e.document.querySelector('#start').emit('click');e.run("segments=[{x:128,y:128},{x:192,y:128},{x:192,y:192},{x:128,y:192}];direction=nextDirection='ArrowRight';apple={x:0,y:0};tick()");assert.equal(e.run('running'),false);console.log('73: grid placement, no overlap, eating, growth, score, speed, reversal, wall/self collision PASS');
 for(const n of [68,69]){
  e=environment(); const markers=[];
  class FakeMap{panTo(){}setZoom(){}fitBounds(){}}
  class Info{close(){}setContent(){}open(){}}
  class Marker{constructor(options){Object.assign(this,options);markers.push(this)}addListener(){}}
  class Bounds{extend(){}}
  e.sandbox.google={maps:{importLibrary:async name=>name==='maps'?{Map:FakeMap,InfoWindow:Info}:name==='marker'?{AdvancedMarkerElement:Marker}:{LatLngBounds:Bounds}}};
  e.document.head.append=()=>e.window.homeworkMapsReady();
  let batch=0;e.sandbox.fetch=async()=>({ok:true,json:async()=>({geonames:[{title:'Place '+(++batch),lat:40,lng:-74,summary:'safe',wikipediaUrl:'en.wikipedia.org/wiki/Test'}]})});
  e.load(n);e.document.querySelector('#username').value='TEST_USER';e.document.querySelector('#maps-key').value='TEST_ONLY';
  await e.document.querySelector('#setup').emit('submit');
  e.document.querySelector('#query').value='first';await e.document.querySelector('#search-form').emit('submit');
  e.document.querySelector('#query').value='second';await e.document.querySelector('#search-form').emit('submit');
  assert.equal(e.run('places.length'),n===69?2:1);assert.equal(e.run("safeUrl('javascript:alert(1)',true)"),'');
  if(n===69){assert.equal(JSON.parse(e.storage.get('homework69-places')).length,2);await e.document.querySelector('#clear').emit('click');assert.equal(e.run('places.length'),0);assert.equal(e.storage.size,0);assert(markers.every(m=>m.map===null));}
  console.log(n+': mocked library init, searches, markers, result replacement/persistence, URL rejection'+(n===69?', clear map/storage':'')+' PASS');
 }
})().catch(error=>{console.error(error);process.exit(1)});
