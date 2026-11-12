const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const paint=new Proxy({},{get:()=>()=>{}});
function node(id){return nodes[id]??=( {value:({palette:'blue',environment:'light',initial:'24',rate:'6'})[id]||'',checked:true,hidden:false,textContent:'',style:{},getContext:()=>paint,querySelector:s=>node(id+s),addEventListener(t,f){this[t]=f},append(){},replaceChildren(){},setAttribute(){},scrollIntoView(){},showModal(){this.open=true},close(){this.open=false},click(){this.onclick?.()},getBoundingClientRect:()=>({left:0,top:0,width:960,height:540})});}
const context={document:{getElementById:node,createElement:()=>node(Math.random()),addEventListener(){}},performance:{now:()=>0},requestAnimationFrame(){},Math,console};vm.createContext(context);vm.runInContext(fs.readFileSync('game.js','utf8'),context);
vm.runInContext(`
if(organisms.length!==24)throw Error('Initial population');
const beforeStart=colors.join(',');$('start').onclick();if(colors.join(',')!==beforeStart)throw Error('Keep preview colors when starting');
for(let i=0;i<20;i++){const before=shadeByTone.join(','),oldColors=colors.join(',');reset();if(shadeByTone.join(',')===before||new Set(shadeByTone).size!==5)throw Error('New shuffled identifiers');if(colors.join(',')===oldColors)throw Error('Shuffle number-color association');if([...colors].sort().join(',')!==[...palettes[palette].colors].sort().join(','))throw Error('Keep the same five colors');}
for(let t=0;t<5;t++)for(const direction of [-1,1])if(shadeByTone[mutatedTone(t,direction)]!==Math.max(0,Math.min(4,shadeByTone[t]+direction)))throw Error('Mutation follows neighboring shade');
$('start').onclick(); for(let i=0;i<61;i++)step(.1);
if(organisms.length!==48)throw Error('Reproduction');
for(let i=0;i<200;i++)step(.1);
if(organisms.length>120)throw Error('Capacity');
if(!capacityReached||!$('capacity-notice').textContent.includes('suspensos'))throw Error('Capacity announcement');
const fullBirths=births;step(1);if(births!==fullBirths||capacitySeconds<=0)throw Error('No births when full');
organisms.splice(0,1);step(.01);if($('capacity-notice').textContent.includes('suspensos'))throw Error('Space is available after capture');
for(let i=0;i<100;i++)step(.1);if(births<=fullBirths)throw Error('Births resume when space is available');
sample();explainResult(false);if(!$('darwin-resources').textContent.includes('limite foi atingido'))throw Error('Darwin explains actual capacity');
reset();$('start').onclick(); organisms=[organism(2,200,200)];
canvas.pointerdown({clientX:200,clientY:200});
if(organisms.length!==0||running)throw Error('Extinction');
if($('darwin-result').hidden||!$('darwin-outcome').textContent.includes('zero'))throw Error('Extinction interpretation');
if(!$('darwin-graph').textContent.includes('não são definidas'))throw Error('Empty population graph explanation');
if($('survivors').hidden||!$('survivors-summary').textContent.includes('nenhum indivíduo'))throw Error('Extinction bars');
reset();organisms=[organism(0),organism(2),organism(2),organism(4)];drawSurvivors();
if(JSON.stringify(survivorCounts())!=='[1,0,2,0,1]')throw Error('Bar counts');
if(!$('survivors-summary').textContent.includes('Tom 3: 2'))throw Error('Bar labels');
if(!$('extinction-announcements').innerHTML.includes('Tom 2: variante extinta')||!$('extinction-announcements').innerHTML.includes('Tom 4: variante extinta')||$('extinction-announcements').innerHTML.includes('Tom 3: variante extinta'))throw Error('Per-color extinction announcements');
if(!$('darwin-survival').textContent.includes('tom 3 terminou com mais sobreviventes: 2'))throw Error('Survivor leader interpretation');
if(!$('darwin-survival').textContent.includes('tons 2 e 4 foram extintas'))throw Error('Darwin contrasts success and extinct variants');
if($('darwin-graph').textContent.includes('barras'))throw Error('Keep line graph explanation separate');
organisms=[];drawSurvivors();if(!$('darwin-survival').textContent.includes('Nenhum indivíduo sobreviveu'))throw Error('Extinction interpretation by tone');
if(!$('darwin-survival').textContent.includes('extinção de toda a população'))throw Error('Darwin explains total extinction');
organisms=colors.map((_,t)=>organism(t));drawSurvivors();if(!$('darwin-survival').textContent.includes('Nenhuma variante foi extinta'))throw Error('Darwin avoids false extinction');
reset();if(!$('survivors').hidden)throw Error('Hide previous results');
reset();$('start').onclick();mutate=false;step(60);
if(running||!$('darwin-outcome').textContent.includes('60 segundos'))throw Error('Time limit interpretation');
if(!$('darwin-change').textContent.includes('proporções'))throw Error('Unchanged proportions explanation');
if(!$('darwin-resources').textContent.includes('não atingiu'))throw Error('Darwin does not invent capacity events');
reset();$('start').onclick();$('pause').onclick();
if(!paused)throw Error('Pause');$('pause').onclick();if(paused)throw Error('Resume');
for(const p of ['blue','orange','violet'])for(const level of ['light','medium','dark']){
  $('palette').value=p;$('environment').value=level;reset();
  if(!colors.every((color,t)=>color===roundShades[shadeByTone[t]])||shadeByTone[matchedTone()]!==({light:3,medium:2,dark:1})[level])throw Error('Shuffled palette and luminosity');
  $('start').onclick();if(!$('palette').disabled)throw Error('Palette locked during play');
}
`,context);console.log('Passed: population, reproduction, capacity, extinction, pause, timed conclusion, and Darwin explanations.');
