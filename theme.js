(()=>{
  let theme='light';
  try{if(localStorage.getItem('evolucao-theme')==='dark')theme='dark'}catch{}
  document.documentElement.dataset.theme=theme;
  const sync=()=>document.querySelectorAll('[data-theme-choice]').forEach(button=>{
    button.setAttribute('aria-pressed',String(button.dataset.themeChoice===document.documentElement.dataset.theme));
  });
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-theme-choice]').forEach(button=>button.addEventListener('click',()=>{
      const next=button.dataset.themeChoice;
      document.documentElement.dataset.theme=next;
      try{localStorage.setItem('evolucao-theme',next)}catch{}
      sync();
    }));sync();
  });
})();
