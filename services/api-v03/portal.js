'use strict';
const $=id=>document.getElementById(id);
let token=null;
function say(t,error=false){$('message').textContent=t;$('message').className=error?'msg error':'msg';}
async function api(path,method='GET',data){const res=await fetch(path,{method,headers:{'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{})},body:data?JSON.stringify(data):undefined});const json=await res.json();if(!res.ok)throw Error(json.error||'Erreur réseau');return json;}
function values(form){return Object.fromEntries(new FormData(form).entries());}
async function refresh(){const {user}=await api('/api/me');$('user').textContent=user.name+' — '+user.role+' ('+user.email+')';$('guest').style.display='none';$('session').style.display='block';const {inquiries}=await api('/api/inquiries');$('history').replaceChildren(...inquiries.map(item=>{const li=document.createElement('li');li.textContent='#'+item.id+' — '+item.status+' — '+item.message;return li;}));}
$('register').addEventListener('submit',async e=>{e.preventDefault();try{const r=await api('/api/register','POST',values(e.target));say(r.message);e.target.reset();}catch(err){say(err.message,true);}});
$('login').addEventListener('submit',async e=>{e.preventDefault();try{const r=await api('/api/login','POST',values(e.target));token=r.token;await refresh();say('Connexion réussie');e.target.reset();}catch(err){say(err.message,true);}});
$('inquiry').addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/inquiries','POST',values(e.target));e.target.reset();await refresh();say('Demande enregistrée');}catch(err){say(err.message,true);}});
$('logout').addEventListener('click',async()=>{try{await api('/api/logout','POST');}catch{}token=null;$('guest').style.display='grid';$('session').style.display='none';say('Déconnexion effectuée');});
