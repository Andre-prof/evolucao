const $=id=>document.getElementById(id);
const palettes={
  blue:{name:'azul',colors:['#082d86','#164fc9','#2675ed','#3a98ff','#70beff']},
  orange:{name:'laranja',colors:['#652500','#a53e00','#d65b00','#f58b24','#ffb95c']},
  violet:{name:'violeta',colors:['#381264','#64239b','#8b3ec4','#b26aed','#d4a0ff']}
};
let palette='blue',colors=palettes.blue.colors;
const lineStyles=[[],[10,5],[3,4],[12,4,3,4],[2,3,2,7]];
const matchedTone=()=>({light:3,medium:2,dark:1})[environment];
function updateLegend(){
  $('legend').replaceChildren();
  colors.forEach((c,i)=>{const s=document.createElement('span'),dot=document.createElement('i');dot.style.background=c;s.append(dot,`Tom ${i+1}`);s.title=`${palettes[palette].name}, tom ${i+1}: ${i===0?'mais escuro':i===4?'mais claro':'intermediário'}`;$('legend').append(s)});
}
const canvas=$('world'),ctx=canvas.getContext('2d'),chart=$('chart'),cc=chart.getContext('2d');
let organisms=[],history=[],running=false,paused=false,elapsed=0,captures=0,births=0,last=0,lastSample=0,interval=6,mutate=true,environment='light',initialMean=0;
const rand=(a,b)=>a+Math.random()*(b-a);
function organism(t,x=rand(20,940),y=rand(20,520)){return{t,x,y,age:0,vx:rand(-5,5),vy:rand(-5,5)}}
function mean(){return organisms.length?organisms.reduce((s,o)=>s+o.t,0)/organisms.length:0}
function sample(){const counts=colors.map((_,t)=>organisms.filter(o=>o.t===t).length);history.push({time:elapsed,counts,total:organisms.length});drawChart()}
function drawChart(){
  cc.clearRect(0,0,700,210);cc.setLineDash([]);cc.fillStyle='#42516a';cc.font='11px sans-serif';
  for(let i=0;i<=2;i++){const y=15+i*80;cc.strokeStyle='#ccd5e0';cc.beginPath();cc.moveTo(35,y);cc.lineTo(685,y);cc.stroke();cc.fillText(`${100-i*50}%`,0,y+4)}
  cc.fillText('0 s',35,205);cc.fillText('30 s',350,205);cc.fillText('60 s',655,205);
  if(!history.length)return;
  colors.forEach((color,t)=>{cc.strokeStyle=color;cc.lineWidth=3;cc.setLineDash(lineStyles[t]);cc.beginPath();let pen=false;
    history.forEach(h=>{if(!h.total){pen=false;return}const x=35+h.time/60*650,y=175-h.counts[t]/h.total*160;if(!pen){cc.moveTo(x,y);pen=true}else cc.lineTo(x,y)});cc.stroke();
  });cc.setLineDash([]);
}
function background(){ctx.fillStyle=colors[matchedTone()];ctx.fillRect(0,0,960,540);let seed=381;for(let i=0;i<1900;i++){seed=(seed*16807)%2147483647;const x=seed%960;seed=(seed*16807)%2147483647;const y=seed%540;ctx.fillStyle=i%2?'#ffffff0b':'#0000000b';ctx.fillRect(x,y,2+i%5,2+i%4)}}
function draw(){background();for(const o of organisms){ctx.fillStyle=colors[o.t];ctx.beginPath();ctx.arc(o.x,o.y,11,0,Math.PI*2);ctx.fill()}}
function metrics(){$('pop').textContent=organisms.length;$('caught').textContent=captures;$('born').textContent=births;$('time').textContent=`${Math.ceil(Math.max(0,60-elapsed))}s`}
function survivorCounts(){return colors.map((_,t)=>organisms.filter(o=>o.t===t).length)}
function drawSurvivors(){
  const counts=survivorCounts(),total=counts.reduce((s,n)=>s+n,0);
  const max=Math.max(5,Math.ceil(Math.max(...counts)/5)*5);
  const summary=counts.map((n,i)=>`Tom ${i+1}: ${n}`).join('; ');
  const ticks=[0,max/2,max].map(n=>{const y=235-n/max*180;return `<line x1="55" y1="${y}" x2="715" y2="${y}" stroke="#b8c9dd"/><text x="43" y="${y+4}" text-anchor="end" fill="#42516a" font-size="13">${n.toLocaleString('pt-BR')}</text>`}).join('');
  const bars=counts.map((n,i)=>{const x=85+i*128,height=n/max*180;return `<rect x="${x}" y="${235-height}" width="70" height="${height}" rx="4" fill="${colors[i]}"/><text x="${x+35}" y="${223-height}" text-anchor="middle" fill="#12213b" font-size="21" font-weight="700">${n}</text><text x="${x+35}" y="262" text-anchor="middle" fill="#12213b" font-size="15">Tom ${i+1}</text><circle cx="${x+35}" cy="282" r="5" fill="${colors[i]}" stroke="#42516a" stroke-width=".5"/>`}).join('');
  $('bar-plot').innerHTML=`<svg viewBox="0 0 740 305" role="img" aria-label="Sobreviventes por tom. ${summary}" xmlns="http://www.w3.org/2000/svg" style="font-family:Arial,sans-serif"><text x="55" y="23" fill="#42516a" font-size="13">NÚMERO DE SOBREVIVENTES</text>${ticks}${bars}</svg>`;
  $('survivors-total').textContent=`${total} ${total===1?'sobrevivente':'sobreviventes'} no total`;
  $('survivors-summary').textContent=total===0?'População extinta: nenhum indivíduo restou, em nenhum dos cinco tons.':`Cada barra usa a cor do organismo e mostra sua quantidade, não sua porcentagem. ${summary}.`;
  const matched=matchedTone(),largest=Math.max(...counts);
  const leaders=counts.map((n,i)=>n===largest?i+1:null).filter(n=>n!==null);
  const leadNames=leaders.map(n=>`tom ${n}`).join(', ');
  const observed=total===0?'Nesta partida, todos foram capturados. Nenhum tom deixou sobreviventes.':leaders.length===5?`Nesta partida, todos os tons terminaram empatados, com ${largest} sobreviventes cada.`:leaders.length>1?`Nesta partida, ${leadNames} terminaram empatados com a maior quantidade: ${largest} sobreviventes cada.`:`Nesta partida, o ${leadNames} terminou com mais indivíduos vivos: ${largest}.`;
  $('darwin-survival').textContent=`O tom ${matched+1} coincide com a cor do ambiente. Ao se confundir com o fundo, tende a ser menos percebido pelo predador e a ter maior chance de sobreviver e deixar descendentes. ${observed} As barras contam os indivíduos vivos, incluindo descendentes: uma barra maior, sozinha, não mede a chance de sobrevivência. Reprodução, suas capturas e acaso também influenciam o resultado.`;
  $('darwin-bars').textContent='Aqui, cada barra representa um tom; sua altura e o número acima mostram quantos restaram. Compare essas quantidades para ver o resultado final. Este gráfico não mostra a passagem do tempo.';
  $('survivors').hidden=false;
}
function controls(disabled){['palette','environment','initial','rate','mutation'].forEach(id=>$(id).disabled=disabled)}
function reset(){document.getElementById("survivors").hidden=true;running=false;paused=false;elapsed=0;captures=0;births=0;lastSample=0;history=[];palette=palettes[document.getElementById("palette").value]?document.getElementById("palette").value:'blue';colors=palettes[palette].colors;updateLegend();environment=$('environment').value;interval=Number($('rate').value);mutate=$('mutation').checked;organisms=Array.from({length:Number($('initial').value)},(_,i)=>organism(i%5));initialMean=mean();$('darwin-result').hidden=true;$('start').hidden=false;$('cover').hidden=false;$('cover').querySelector('h2').textContent='Consegue encontrar todos?';$('cover').querySelector('p:not(.eyebrow)').textContent='Clique ou toque nos círculos. Os sobreviventes geram descendentes com cores herdadas.';$('start').textContent='Iniciar experimento ↗';$('pause').disabled=true;$('pause').textContent='Pausar';$('status').textContent='Prepare seu experimento';$('reading').textContent='Inicie uma partida para acompanhar a população.';controls(false);metrics();draw();drawChart()}
function explainResult(extinct){
  const first=history[0],final=history.at(-1),lastAlive=history.findLast(h=>h.total>0);
  const evidence=extinct?lastAlive:final;
  const pct=(h,t)=>h.total?h.counts[t]/h.total*100:0;
  const changes=colors.map((_,t)=>pct(evidence,t)-pct(first,t));
  const winner=changes.indexOf(Math.max(...changes)),gain=changes[winner];
  const matched=matchedTone();
  const delta=pct(evidence,matched)-pct(first,matched);
  $('darwin-title').textContent=extinct?'Extinção: o que os dados mostram?':'Tempo encerrado. Vamos investigar?';
  $('darwin-outcome').textContent=`${extinct?'Você capturou o último organismo!':'Os 60 segundos terminaram!'} Começamos com ${first.total} organismos; houve ${births} nascimentos e ${captures} capturas. ${extinct?'A população chegou a zero em '+elapsed.toFixed(1).replace('.',',')+' segundos. Sem sobreviventes, não há novos descendentes.':'Restaram '+final.total+' organismos. A reprodução e os sobreviventes mantiveram a população presente até o fim.'}`;
  const context=extinct?`No último registro com organismos vivos (aos ${evidence.time.toFixed(1).replace('.',',')} s), `:'Ao final, ';
  $('darwin-change').textContent=gain<.05?`${context}as proporções dos tons permaneceram praticamente iguais às iniciais. Isso pode acontecer: uma partida não precisa produzir uma mudança marcante.`:`${context}o tom ${winner+1} passou de ${pct(first,winner).toFixed(1).replace('.',',')}% para ${pct(evidence,winner).toFixed(1).replace('.',',')}% — ganho de ${gain.toFixed(1).replace('.',',')} pontos percentuais. Sua quantidade foi de ${first.counts[winner]} para ${evidence.counts[winner]}.`;
  $('darwin-graph').textContent=`O eixo horizontal marca os segundos; o vertical, a porcentagem da população de cada tom. Uma linha que sobe indica maior participação, mesmo que o número de indivíduos diminua.${extinct?' Na extinção, as linhas param: porcentagens de uma população vazia não são definidas.':''}`;
  const comparison=Math.abs(delta)<.05?`O tom ${matched+1}, que coincide com o fundo, manteve sua proporção.`:`O tom ${matched+1}, que coincide com o fundo, ${delta>0?'ganhou':'perdeu'} ${Math.abs(delta).toFixed(1).replace('.',',')} pontos percentuais.`;
  $('darwin-meaning').textContent=`${comparison} ${births===0?'Não houve nascimentos nesta partida: observamos o efeito das capturas, mas não a transmissão de características a uma nova geração.':'Os descendentes herdaram a cor dos progenitores. Diferenças na sobrevivência e no número de descendentes podem alterar as frequências entre gerações.'} Nenhum indivíduo mudou de cor para se esconder. ${mutate?'As variações nos nascimentos foram aleatórias, não respostas à necessidade. ':''}A camuflagem pode influenciar a captura, mas este resultado sozinho não prova sua causa: posição, suas escolhas e acaso também contam.`;
  $('darwin-question').textContent=`Minha pergunta: se você repetir com o outro ambiente, mantendo população e intervalo de reprodução, o tom ${matched+1} terá o mesmo resultado? Faça uma previsão e teste!`;
  $('reading').textContent=extinct?`População extinta aos ${elapsed.toFixed(1).replace('.',',')} s. As curvas mostram proporções apenas enquanto havia indivíduos vivos.`:`De ${first.total} para ${final.total} organismos em 60 s. Leia abaixo a análise de Darwin e compare os tons da legenda.`;
  $('chart').setAttribute('aria-label',`Proporções dos tons da paleta ${palettes[palette].name} ao longo da partida. ${$('darwin-change').textContent}`);
  drawSurvivors();
  $('darwin-result').hidden=false;$('results').scrollIntoView({behavior:'smooth',block:'start'});
}
function finish(extinct){running=false;paused=false;sample();$('pause').disabled=true;controls(false);$('status').textContent=extinct?'População extinta':'A população persistiu';$('cover').hidden=false;$('cover').querySelector('h2').textContent=extinct?'Você extinguiu a população.':'A vida continuou.';$('cover').querySelector('p:not(.eyebrow)').textContent=`${captures} capturas · ${births} nascimentos · ${organisms.length} sobreviventes. Veja a análise de Darwin abaixo.`;$('start').textContent='Novo experimento ↗';explainResult(extinct);metrics()}
function step(dt){elapsed=Math.min(60,elapsed+dt);const newborn=[];for(const o of organisms){o.age+=dt;o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.x<12||o.x>948){o.vx*=-1;o.x=Math.max(12,Math.min(948,o.x))}if(o.y<12||o.y>528){o.vy*=-1;o.y=Math.max(12,Math.min(528,o.y))}if(o.age>=interval){o.age-=interval;if(organisms.length+newborn.length<120){let t=o.t;if(mutate&&Math.random()<.1)t=Math.max(0,Math.min(4,t+(Math.random()<.5?-1:1)));newborn.push(organism(t,Math.max(12,Math.min(948,o.x+rand(-30,30))),Math.max(12,Math.min(528,o.y+rand(-30,30)))));births++}}}organisms.push(...newborn);if(elapsed-lastSample>=1){sample();lastSample=elapsed}metrics();if(elapsed>=60)finish(false)}
function frame(now){if(running&&!paused)step(Math.min((now-last)/1000,.1));last=now;draw();requestAnimationFrame(frame)}
$('start').onclick=()=>{reset();running=true;$('cover').hidden=true;$('pause').disabled=false;controls(true);$('status').textContent='Em andamento · encontre os círculos';sample();last=performance.now()};
$('pause').onclick=()=>{if(!running)return;paused=!paused;$('pause').textContent=paused?'Continuar':'Pausar';$('status').textContent=paused?'Experimento pausado':'Em andamento · encontre os círculos';$('cover').hidden=!paused;if(paused){$('cover').querySelector('h2').textContent='Experimento pausado';$('cover').querySelector('p:not(.eyebrow)').textContent='Use Continuar para retomar a mesma partida.';$('start').hidden=true}else $('start').hidden=false};
$('reset').onclick=()=>{$('start').hidden=false;reset()};
canvas.addEventListener('pointerdown',e=>{if(!running||paused)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*960/r.width,y=(e.clientY-r.top)*540/r.height;for(let i=organisms.length-1;i>=0;i--){const o=organisms[i];if(Math.hypot(o.x-x,o.y-y)<=13){if(organisms.length===1)sample();organisms.splice(i,1);captures++;metrics();if(!organisms.length)finish(true);break}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)$('pause').click()});
['palette','environment','initial','rate','mutation'].forEach(id=>$(id).addEventListener('change',()=>{if(!running)reset()}));$('initial').oninput=()=>{$('nval').textContent=$('initial').value};
$('retry').onclick=()=>{reset();$('world').scrollIntoView({behavior:'smooth',block:'center'})};
let resumeAfterWelcome=false;
function showWelcome(){resumeAfterWelcome=running&&!paused;if(resumeAfterWelcome)$('pause').click();$('welcome').showModal()}
$('help').onclick=showWelcome;
$('welcome-close').onclick=()=>$('welcome').close();
$('welcome').addEventListener('close',()=>{if(resumeAfterWelcome&&running&&paused)$('pause').click();resumeAfterWelcome=false});
reset();requestAnimationFrame(frame);showWelcome();
