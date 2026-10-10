(function(){
var root=document.documentElement,btn=document.getElementById('theme');
try{var t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
btn.onclick=function(){
  var dark=getComputedStyle(root).colorScheme==='dark',n=dark?'light':'dark';
  root.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}
  setTimeout(init,30);
};
var c=document.getElementById('sim'),x=c.getContext('2d'),W,H,B,cx,cy,col,bg,age=0;
var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function size(){var d=devicePixelRatio||1;W=c.clientWidth;H=c.clientHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);init()}
function init(){
  var s=getComputedStyle(root);bg=s.getPropertyValue('--bg').trim();
  col=[s.getPropertyValue('--acc').trim(),s.getPropertyValue('--fg').trim(),s.getPropertyValue('--mute').trim()];
  x.globalAlpha=1;x.fillStyle=bg;x.fillRect(0,0,W,H);
  var wide=W>800;cx=wide?W*.68:W*.5;cy=wide?H*.45:H*.3;
  var r=Math.min(W,H)*(wide?.2:.14),k=Math.sqrt(350/(r*1.732));
  B=[0,1,2].map(function(i){var a=i*2.094+Math.random()*.5,v=k*r/200*(.9+Math.random()*.25);
    return{x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,px:0,py:0,vx:-Math.sin(a)*v*1.1,vy:Math.cos(a)*v*1.1}});
  B.forEach(function(b){b.px=b.x;b.py=b.y});age=0;
  if(still){for(var i=0;i<900;i++)step(.5,true)}
}
function step(dt,draw){
  var G=350*(Math.min(W,H)*.2/200)*Math.min(W,H)*.2/200*0+350;
  for(var i=0;i<3;i++){var a=B[i],ax=0,ay=0;
    for(var j=0;j<3;j++){if(i===j)continue;var dx=B[j].x-a.x,dy=B[j].y-a.y,d2=dx*dx+dy*dy+400,inv=G/(d2*Math.sqrt(d2));ax+=dx*inv;ay+=dy*inv}
    a.vx+=ax*dt;a.vy+=ay*dt}
  B.forEach(function(b,i){b.px=b.x;b.py=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(draw){x.strokeStyle=col[i];x.globalAlpha=.9;x.lineWidth=1.4;x.beginPath();x.moveTo(b.px,b.py);x.lineTo(b.x,b.y);x.stroke()}})
}
function frame(){
  x.globalAlpha=.035;x.fillStyle=bg;x.fillRect(0,0,W,H);
  for(var n=0;n<4;n++)step(.5,true);
  x.globalAlpha=1;B.forEach(function(b,i){x.fillStyle=col[i];x.beginPath();x.arc(b.x,b.y,3.5,0,6.283);x.fill()});
  age++;
  var far=B.some(function(b){return Math.abs(b.x-cx)>Math.max(W,H)||Math.abs(b.y-cy)>Math.max(W,H)});
  if(far||age>2400)init();
  requestAnimationFrame(frame)
}
addEventListener('resize',size);c.addEventListener('click',init);
size();if(!still)requestAnimationFrame(frame);
})();
