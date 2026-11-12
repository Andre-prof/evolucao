const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const paint=new Proxy({},{get:()=>()=>{}});
function node(id){return nodes[id]??=( {value:({palette:'blue',environment:'light',initial:'24',rate:'6'})[id]||'',checked:true,hidden:false,textContent:'',style:{},getContext:()=>paint,querySelector:s=>node(id+s),addEventListener(t,f){this[t]=f},append(){},replaceChildren(){},setAttribute(){},scrollIntoView(){},showModal(){this.open=true},close(){this.open=false},click(){this.onclick?.()},getBoundingClientRect:()=>({left:0,top:0,width:960,height:540})});}
const context={document:{getElementById:node,createElement:()=>node(Math.random()),addEventListener(){}},performance:{now:()=>0},requestAnimationFrame(){},Math,console};vm.createContext(context);vm.runInContext(fs.readFileSync('game.js','utf8'),context);
vm.runInContext(`
if(organisms.length!==24)throw Error('Initial population');
$('start').onclick(); for(let i=0;i<61;i++)step(.1);
if(organisms.length!==48)throw Error('Reproduction');
for(let i=0;i<200;i++)step(.1);
if(organisms.length>120)throw Error('Capacity');
reset();$('start').onclick(); organisms=[organism(2,200,200)];
canvas.pointerdown({clientX:200,clientY:200});
if(organisms.length!==0||running)throw Error('Extinction');
if($('darwin-result').hidden||!$('darwin-outcome').textContent.includes('zero'))throw Error('Extinction interpretation');
if(!$('darwin-graph').textContent.includes('não são definidas'))throw Error('Empty population graph explanation');
if($('survivors').hidden||!$('survivors-summary').textContent.includes('nenhum indivíduo'))throw Error('Extinction bars');
reset();organisms=[organism(0),organism(2),organism(2),organism(4)];drawSurvivors();
if(JSON.stringify(survivorCounts())!=='[1,0,2,0,1]')throw Error('Bar counts');
if(!$('survivors-summary').textContent.includes('Tom 3: 2'))throw Error('Bar labels');
if(!$('darwin-survival').textContent.includes('tom 3 terminou com mais'))throw Error('Survivor leader interpretation');
if($('darwin-graph').textContent.includes('barras'))throw Error('Keep line graph explanation separate');
organisms=[];drawSurvivors();if(!$('darwin-survival').textContent.includes('Nenhum tom deixou sobreviventes'))throw Error('Extinction interpretation by tone');
reset();if(!$('survivors').hidden)throw Error('Hide previous results');
reset();$('start').onclick();mutate=false;step(60);
if(running||!$('darwin-outcome').textContent.includes('60 segundos'))throw Error('Time limit interpretation');
if(!$('darwin-change').textContent.includes('proporções'))throw Error('Unchanged proportions explanation');
reset();$('start').onclick();$('pause').onclick();
if(!paused)throw Error('Pause');$('pause').onclick();if(paused)throw Error('Resume');
for(const p of ['blue','orange','violet'])for(const level of ['light','medium','dark']){
  $('palette').value=p;$('environment').value=level;reset();
  if(colors!==palettes[p].colors||matchedTone()!==({light:3,medium:2,dark:1})[level])throw Error('Palette and luminosity');
  $('start').onclick();if(!$('palette').disabled)throw Error('Palette locked during play');
}
`,context);console.log('Passed: population, reproduction, capacity, extinction, pause, timed conclusion, and Darwin explanations.');
