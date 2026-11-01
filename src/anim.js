/* ---------- exercise animations: a parametric figure drawn on canvas ----------
   Angles are absolute, in degrees: 0 = pointing down, 90 = forward (right), 180 = up, -90 = back (left).
   Each limb is [segment1, segment2]; optional scale arrays shorten a segment to fake depth
   (a negative scale flips it, which reads as moving past the body toward/away from the viewer).
   Poses interpolate linearly, so authored values are chosen to travel along the real path. */
const STAND = {h:[110,95],t:180,al:[0,0],ll:[0,0]};
const SHOULDER_HANDLES = {al:[180,180],as:[-0.85,1]};
const POSES = {
 "chest-press":{v:"side",tube:{pt:[40,64]},door:40,A:{h:[110,97],t:172,al:[-45,90],ll:[15,0],lr:[-15,0]},B:{h:[110,97],t:172,al:[90,90],ll:[15,0],lr:[-15,0]}},
 "incline-press":{v:"side",tube:{pt:[40,140]},door:40,A:{h:[110,97],t:172,al:[-45,90],ll:[15,0],lr:[-15,0]},B:{h:[110,97],t:172,al:[135,135],ll:[15,0],lr:[-15,0]}},
 "chest-fly":{v:"front",tube:{pt:[110,62]},A:{...STAND,al:[85,95]},B:{...STAND,al:[70,90],as:[0.25,0.3]}},
 "band-pushup":{v:"side",tube:"back",A:{h:[109.5,143.6],t:97,al:[-110,0],ll:[-83,-83]},B:{h:[104.5,126],t:115,al:[0,0],ll:[-65,-65]}},
 "crossover":{v:"side",tube:{pt:[40,22]},door:40,A:{h:[110,97],t:165,al:[200,200],ll:[15,0],lr:[-15,0]},B:{h:[110,97],t:165,al:[40,40],ll:[15,0],lr:[-15,0]}},
 "seated-row":{v:"side",tube:"feet",A:{h:[80,150],t:165,al:[80,80],ll:[90,90]},B:{h:[80,150],t:185,al:[110,85],as:[-0.6,0.8],ll:[90,90]}},
 "bent-row":{v:"side",tube:"feet",A:{h:[100,98],t:130,al:[0,0],ll:[12,-5]},B:{h:[100,98],t:130,al:[-60,0],ll:[12,-5]}},
 "lat-pulldown":{v:"side",tube:{pt:[178,20]},door:178,A:{h:[105,125],t:175,al:[160,165],ll:[0,-90]},B:{h:[105,125],t:180,al:[160,178],as:[-0.85,1],ll:[0,-90]}},
 "straight-arm":{v:"side",tube:{pt:[180,30]},door:180,A:{h:[100,96],t:165,al:[140,140],ll:[10,-5]},B:{h:[100,96],t:165,al:[-10,-10],ll:[10,-5]}},
 "pull-apart":{v:"front",tube:"hands",A:{...STAND,al:[70,90],as:[0.25,0.3]},B:{...STAND,al:[90,90]}},
 "ohp":{v:"side",tube:"feet",A:{...STAND,...SHOULDER_HANDLES},B:{...STAND,al:[180,180]}},
 "lat-raise":{v:"front",tube:"feet",A:{...STAND,al:[8,8]},B:{...STAND,al:[88,92]}},
 "front-raise":{v:"side",tube:"feet",A:{...STAND,al:[5,5]},B:{...STAND,al:[90,90]}},
 "face-pull":{v:"side",tube:{pt:[180,42]},door:180,A:{h:[105,97],t:175,al:[95,95],ll:[12,0],lr:[-12,0]},B:{h:[105,97],t:178,al:[95,170],as:[-0.45,1],ll:[12,0],lr:[-12,0]}},
 "reverse-fly":{v:"front",tube:{pt:[110,66]},A:{...STAND,al:[70,90],as:[0.25,0.3]},B:{...STAND,al:[90,90]}},
 "curl":{v:"side",tube:"feet",A:{...STAND,al:[0,0]},B:{...STAND,al:[5,165]}},
 "hammer":{v:"side",tube:"feet",A:{...STAND,al:[0,0]},B:{...STAND,al:[8,150]}},
 "conc-curl":{v:"side",tube:"feet",stool:true,A:{h:[95,125],t:140,al:[5,5],ll:[90,0]},B:{h:[95,125],t:140,al:[5,125],ll:[90,0]}},
 "pushdown":{v:"side",tube:{pt:[180,25]},door:180,A:{h:[110,97],t:170,al:[5,100],ll:[12,0],lr:[-12,0]},B:{h:[110,97],t:170,al:[5,5],ll:[12,0],lr:[-12,0]}},
 "oh-ext":{v:"side",tube:"foot2",A:{h:[110,97],t:178,al:[170,340],ll:[18,0],lr:[-20,-10]},B:{h:[110,97],t:178,al:[170,180],ll:[18,0],lr:[-20,-10]}},
 "kickback":{v:"side",tube:"feet",A:{h:[105,97],t:118,al:[-62,0],ll:[12,-5]},B:{h:[105,97],t:118,al:[-62,-62],ll:[12,-5]}},
 "squat":{v:"side",tube:"feet",A:{...STAND,...SHOULDER_HANDLES},B:{h:[94,120],t:145,...SHOULDER_HANDLES,al:[150,165],ll:[75,-25]}},
 "rdl":{v:"side",tube:"feet",A:{...STAND},B:{h:[102,96],t:97,al:[0,0],ll:[15,0]}},
 "split-squat":{v:"side",tube:"foot1",A:{h:[110,98],t:180,...SHOULDER_HANDLES,ll:[20,-5],lr:[-25,-30]},B:{h:[110,121],t:178,...SHOULDER_HANDLES,ll:[75,-15],lr:[-10,-80]}},
 "glute-bridge":{v:"side",tube:"hips",A:{h:[110,148],t:-90,al:[90,90],ll:[135,20]},B:{h:[108,124],t:-62,al:[90,90],ll:[100,0]}},
 "lateral-walk":{v:"front",tube:"feetX",A:{h:[106,99],t:180,al:[18,-25],ll:[6,0]},B:{h:[114,101],t:180,al:[18,-25],ll:[22,-4]}},
 "good-morning":{v:"side",tube:"neck",A:{...STAND,al:[30,170],as:[0.7,0.6]},B:{h:[103,96],t:100,al:[100,240],as:[0.7,0.6],ll:[13,0]}},
 "calf":{v:"side",tube:"feet",A:{...STAND,...SHOULDER_HANDLES,ft:90},B:{h:[110,87],t:180,...SHOULDER_HANDLES,ll:[0,0],ft:45}},
 "pallof":{v:"front",tube:{pt:[30,64]},door:30,A:{...STAND,al:[0,-100],as:[0.6,0.4],ll:[8,0],nomirror:false},B:{...STAND,al:[-15,-90],as:[0.35,0.2],ll:[8,0]}},
 "woodchop":{v:"front",tube:{pt:[30,22]},door:30,nomirror:true,A:{h:[110,96],t:188,al:[210,210],ll:[10,0]},B:{h:[110,96],t:174,al:[395,400],ll:[10,0]}},
 "kneel-crunch":{v:"side",tube:{pt:[200,25]},door:200,A:{h:[95,125],t:175,al:[30,170],as:[0.5,0.8],ll:[0,-90]},B:{h:[95,125],t:110,al:[100,130],as:[0.5,0.7],ll:[0,-90]}},
 "dead-bug":{v:"side",tube:{pt:[30,146]},door:30,A:{h:[115,148],t:-90,al:[180,180],ar:[180,180],ll:[180,90],lr:[180,90]},B:{h:[115,148],t:-90,al:[180,180],ar:[260,260],ll:[100,95],lr:[180,90]}},
 "side-plank":{v:"side",tube:null,A:{h:[101.6,138.5],t:104.5,al:[0,90],ar:[30,160],ll:[-75.5,-75.5]},B:{h:[100,146],t:110.8,al:[0,90],ar:[30,160],ll:[-81.4,-81.4]}}
};

const SEG={torso:50,ua:26,fa:24,th:30,sh:30,head:9,foot:10};
function dir(a){const r=a*Math.PI/180;return [Math.sin(r),Math.cos(r)];}
function lerp(a,b,t){return a+(b-a)*t;}
function lerpArr(a,b,t){return a.map((v,i)=>lerp(v,b[i],t));}
function full(p){
  return {h:p.h,t:p.t,al:p.al,ar:p.ar||p.al,as:p.as||[1,1],ars:p.ars||p.as||[1,1],ll:p.ll,lr:p.lr||p.ll,ft:p.ft==null?90:p.ft};
}
function mix(A,B,t){
  A=full(A);B=full(B);
  return {h:lerpArr(A.h,B.h,t),t:lerp(A.t,B.t,t),al:lerpArr(A.al,B.al,t),ar:lerpArr(A.ar,B.ar,t),as:lerpArr(A.as,B.as,t),ars:lerpArr(A.ars,B.ars,t),ll:lerpArr(A.ll,B.ll,t),lr:lerpArr(A.lr,B.lr,t),ft:lerp(A.ft,B.ft,t)};
}
function chain(o,angles,lens,scales,mirror){
  const pts=[o];let p=o;
  angles.forEach((a,i)=>{const d=dir(mirror?-a:a);const L=lens[i]*(scales?scales[i]:1);p=[p[0]+d[0]*L,p[1]+d[1]*L];pts.push(p);});
  return pts;
}
function solve(spec,P){
  const front=spec.v==="front";
  const hip=P.h, td=dir(P.t);
  const neck=[hip[0]+td[0]*SEG.torso,hip[1]+td[1]*SEG.torso];
  const head=[neck[0]+td[0]*(SEG.head+3),neck[1]+td[1]*(SEG.head+3)];
  const sOff=front?11:0, hOff=front?6:0;
  // perpendicular to torso for left/right offsets in front view
  const perp=[-td[1],td[0]];
  const sh=s=>[neck[0]+perp[0]*sOff*s,neck[1]+perp[1]*sOff*s+ (front?4:0)];
  const hp=s=>[hip[0]+perp[0]*hOff*s,hip[1]+perp[1]*hOff*s];
  const mir=front&&!spec.nomirror;
  // near arm = al (drawn on screen right in front view)
  const armN=chain(sh(front?1:0),P.al,[SEG.ua,SEG.fa],P.as,false);
  const armF=chain(sh(front?-1:0),P.ar,[SEG.ua,SEG.fa],P.ars,mir);
  const legN=chain(hp(front?1:0),P.ll,[SEG.th,SEG.sh],null,false);
  const legF=chain(hp(front?-1:0),P.lr,[SEG.th,SEG.sh],null,mir);
  const footA=front?(0):P.ft;
  const foot=(leg,m)=>{const a=leg[2];if(front){return [a,[a[0]+(m?-1:1)*5,a[1]]];}const d=dir(footA);return [a,[a[0]+d[0]*SEG.foot,a[1]+d[1]*SEG.foot]];};
  return {hip,neck,head,armN,armF,legN,legF,footN:foot(legN,false),footF:foot(legF,true)};
}
function cssVar(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||"#888";}

/* ---- anatomical figure: shaded grey body, trained muscles highlighted ----
   Muscles per exercise: [primary, secondary], space-separated. */
const MUSCLES={
 "chest-press":["chest","delts triceps"],"incline-press":["chest","delts"],"chest-fly":["chest",""],"band-pushup":["chest","triceps abs"],"crossover":["chest",""],
 "seated-row":["upperback lats","biceps"],"bent-row":["lats upperback","biceps"],"lat-pulldown":["lats","biceps"],"straight-arm":["lats",""],"pull-apart":["upperback delts",""],
 "ohp":["delts","triceps"],"lat-raise":["delts",""],"front-raise":["delts",""],"face-pull":["delts upperback",""],"reverse-fly":["delts upperback",""],
 "curl":["biceps","forearms"],"hammer":["biceps forearms",""],"conc-curl":["biceps",""],
 "pushdown":["triceps",""],"oh-ext":["triceps",""],"kickback":["triceps",""],
 "squat":["quads glutes",""],"rdl":["hamstrings glutes","lowerback"],"split-squat":["quads glutes",""],"glute-bridge":["glutes","hamstrings"],
 "lateral-walk":["glutes",""],"good-morning":["hamstrings lowerback","glutes"],"calf":["calves",""],
 "pallof":["obliques abs",""],"woodchop":["obliques","abs"],"kneel-crunch":["abs",""],"dead-bug":["abs",""],"side-plank":["obliques",""]
};
function muscleState(id){
  const m=MUSCLES[id]||["",""], st={};
  m[1].split(" ").filter(Boolean).forEach(k=>st[k]="s");
  m[0].split(" ").filter(Boolean).forEach(k=>st[k]="p");
  return st;
}
const NEAR={skin:"#C4C8CD",shade:"#80868E",light:"#EEF0F2"};
const FAR={skin:"#A3A8AE",shade:"#676D75",light:"#C3C7CC"};
const BODY={line:"rgba(30,34,40,.22)",shorts:"#1E2125",shortsHi:"#3B4047",shoe:"#59606A",sole:"#E8E8E4",hair:"#33373D",handle:"#1B1D21"};
const HI={p:["#FF8A4C","#D8341C"],s:["#FFC3A0","#EE8A60"]};
const TUBE="#1F7AE0";

const V=(a,b)=>[b[0]-a[0],b[1]-a[1]];
const nrm=v=>{const l=Math.hypot(v[0],v[1])||1;return [v[0]/l,v[1]/l];};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
const add=(a,v,k)=>[a[0]+v[0]*k,a[1]+v[1]*k];
function at(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
function capsulePath(ctx,a,b,ra,rb){
  if(Math.hypot(b[0]-a[0],b[1]-a[1])<0.01) b=[a[0]+0.01,a[1]];
  const u=nrm(V(a,b)), au=Math.atan2(u[1],u[0]), n=[-u[1],u[0]];
  ctx.beginPath();
  ctx.moveTo(a[0]+n[0]*ra,a[1]+n[1]*ra);
  ctx.lineTo(b[0]+n[0]*rb,b[1]+n[1]*rb);
  ctx.arc(b[0],b[1],rb,au+Math.PI/2,au-Math.PI/2,true);
  ctx.lineTo(a[0]-n[0]*ra,a[1]-n[1]*ra);
  ctx.arc(a[0],a[1],ra,au-Math.PI/2,au-Math.PI*1.5,true);
  ctx.closePath();
}
// light comes from the upper left
function sideGrad(ctx,a,b,r,pal){
  const u=nrm(V(a,b)); let n=[-u[1],u[0]];
  if(dot(n,[-0.55,-0.83])<0) n=[-n[0],-n[1]];
  const m=at(a,b,0.5);
  const g=ctx.createLinearGradient(m[0]+n[0]*r,m[1]+n[1]*r,m[0]-n[0]*r,m[1]-n[1]*r);
  g.addColorStop(0,pal.light);g.addColorStop(0.42,pal.skin);g.addColorStop(1,pal.shade);
  return g;
}
function limb(ctx,a,b,ra,rb,pal){capsulePath(ctx,a,b,ra,rb);ctx.fillStyle=sideGrad(ctx,a,b,Math.max(ra,rb),pal);ctx.fill();}
function perpToward(a,b,want){const u=nrm(V(a,b));let n=[-u[1],u[0]];if(dot(n,want)<0)n=[-n[0],-n[1]];return n;}
// one muscle belly: an ellipse along a→b, shifted sideways; highlighted when trained, otherwise a faint contour
function belly(ctx,a,b,t,side,off,len,wid,state){
  const u=nrm(V(a,b)), c=add(at(a,b,t),side,off);
  ctx.beginPath();ctx.ellipse(c[0],c[1],Math.max(0.5,len),Math.max(0.5,wid),Math.atan2(u[1],u[0]),0,Math.PI*2);
  if(state){
    const col=HI[state], g=ctx.createRadialGradient(c[0]-wid*0.35,c[1]-wid*0.45,0.3,c[0],c[1],Math.max(len,wid));
    g.addColorStop(0,col[0]);g.addColorStop(1,col[1]);ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle="rgba(120,25,10,.35)";ctx.lineWidth=0.6;ctx.stroke();
  }else if(belly.contour){ctx.strokeStyle=BODY.line;ctx.lineWidth=0.6;ctx.stroke();}
}
function shortsGrad(ctx,a,b,r){return sideGrad(ctx,a,b,r,{light:BODY.shortsHi,skin:BODY.shorts,shade:"#0E0F11"});}
function clipTo(ctx,pathFn,draw){ctx.save();pathFn();ctx.clip();draw();ctx.restore();}

function drawFigure(ctx,spec,P,colors,alpha,id){
  const S=solve(spec,P), front=spec.v==="front", M=muscleState(id);
  const td=dir(P.t), fwd=[-td[1],td[0]], up=td;
  ctx.save();ctx.globalAlpha=alpha==null?1:alpha;ctx.lineCap="round";ctx.lineJoin="round";
  const seg=(a,b,w,c)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const dotAt=(p,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],r,0,Math.PI*2);ctx.fill();};

  // tube first, so the body and hands sit on top of it
  if(spec.tube){
    const tubeLine=(a,b)=>{const len=Math.hypot(b[0]-a[0],b[1]-a[1]);seg(a,b,Math.max(1.6,3.4-len/60),TUBE);};
    const t=spec.tube, hN=S.armN[2], hF=S.armF[2];
    if(t.pt){tubeLine(hF,t.pt);tubeLine(hN,t.pt);dotAt(t.pt,3.4,BODY.handle);}
    else if(t==="feet"){tubeLine(hN,S.footN[1]);tubeLine(hF,S.footF[1]);}
    else if(t==="feetX"){tubeLine(hN,S.footF[1]);tubeLine(hF,S.footN[1]);}
    else if(t==="foot1"){tubeLine(hN,S.footN[1]);tubeLine(hF,S.footN[1]);}
    else if(t==="foot2"){tubeLine(hN,S.footF[1]);tubeLine(hF,S.footF[1]);}
    else if(t==="hands"){tubeLine(hN,hF);}
    else if(t==="back"){tubeLine(hN,S.neck);tubeLine(S.neck,hF);}
    else if(t==="hips"){tubeLine(hN,S.hip);}
    else if(t==="neck"){tubeLine(S.footN[1],S.neck);}
  }

  const leg=(L,F,pal,mirror)=>{
    const [hip,knee,ankle]=L, toe=F[1];
    // shin and calf
    limb(ctx,knee,ankle,5.2,3.0,pal);
    clipTo(ctx,()=>capsulePath(ctx,knee,ankle,5.2,3.0),()=>{
      if(front) belly(ctx,knee,ankle,0.35,[0,0],0,9,3.2,M.calves);
      else{ const back=perpToward(knee,ankle,V(toe,ankle)); belly(ctx,knee,ankle,0.33,back,2.2,8.5,3.4,M.calves); }
    });
    // thigh
    limb(ctx,hip,knee,8.0,5.2,pal);
    clipTo(ctx,()=>capsulePath(ctx,hip,knee,8.0,5.2),()=>{
      if(front){
        belly(ctx,hip,knee,0.55,[0,0],0,11,4.6,M.quads);
      }else{
        const ham=perpToward(hip,knee,add(nrm(V(knee,ankle)),fwd,-0.4));
        const quad=[-ham[0],-ham[1]];
        belly(ctx,hip,knee,0.55,quad,2.6,11,4.4,M.quads);
        belly(ctx,hip,knee,0.55,ham,3,10,3.6,M.hamstrings);
      }
    });
    // shorts over the upper thigh
    capsulePath(ctx,hip,at(hip,knee,0.38),8.3,7.4);ctx.fillStyle=shortsGrad(ctx,hip,at(hip,knee,0.38),8.3);ctx.fill();
    // glute medius shows on the outer hip in the front view, over the shorts
    if(front&&M.glutes) belly(ctx,hip,knee,0.06,[mirror?-1:1,0],4.4,5.2,4.2,M.glutes);
    // shoe
    const heel=at(toe,ankle,1.3);
    limb(ctx,heel,toe,2.9,2.6,{light:"#8A919B",skin:BODY.shoe,shade:"#3E444C"});
    seg(at(heel,toe,0.05),at(heel,toe,0.98),1.3,BODY.sole);
  };
  const arm=(A,pal,mirror)=>{
    const [sh,el,hand]=A;
    // forearm
    limb(ctx,el,hand,4.0,2.7,pal);
    clipTo(ctx,()=>capsulePath(ctx,el,hand,4.0,2.7),()=>{ belly(ctx,el,hand,0.32,[0,0],0,7,2.9,M.forearms); });
    // upper arm with the shoulder cap
    limb(ctx,sh,el,6.2,4.2,pal);
    clipTo(ctx,()=>capsulePath(ctx,sh,el,6.2,4.2),()=>{
      const bendDir=add(nrm(V(el,hand)),front?[0,1]:fwd,0.35);
      const bi=perpToward(sh,el,bendDir), tri=[-bi[0],-bi[1]];
      if(front){
        belly(ctx,sh,el,0.58,[0,0],0,7.5,3.4,M.biceps||M.triceps);
      }else{
        belly(ctx,sh,el,0.6,bi,2.2,7.6,3.3,M.biceps);
        belly(ctx,sh,el,0.6,tri,2.2,8,3.3,M.triceps);
      }
      belly(ctx,sh,el,0.06,[0,0],0,7.6,6.4,M.delts);
    });
    if(spec.tube) dotAt(hand,3.4,BODY.handle);
    dotAt(hand,2.6,pal.skin);
  };
  const torso=()=>{
    const hip=S.hip, top=add(S.neck,up,-6);
    if(front){
      const p=[-td[1],td[0]], sw=15.5, hw=10.5, sTop=add(S.neck,up,-1);
      const path=()=>{ctx.beginPath();ctx.moveTo(sTop[0]+p[0]*sw,sTop[1]+p[1]*sw);ctx.lineTo(sTop[0]-p[0]*sw,sTop[1]-p[1]*sw);
        ctx.lineTo(hip[0]-p[0]*hw,hip[1]-p[1]*hw);ctx.lineTo(hip[0]+p[0]*hw,hip[1]+p[1]*hw);ctx.closePath();};
      path();
      const g=ctx.createLinearGradient(sTop[0]+p[0]*sw,sTop[1],sTop[0]-p[0]*sw,sTop[1]);
      g.addColorStop(0,NEAR.shade);g.addColorStop(0.3,NEAR.light);g.addColorStop(0.65,NEAR.skin);g.addColorStop(1,NEAR.shade);
      ctx.fillStyle=g;ctx.fill();
      belly.contour=true;
      clipTo(ctx,path,()=>{
        const c=(t,s,o)=>add(at(hip,sTop,t),p,s*o);
        const E=(pt,len,wid,st)=>belly(ctx,add(pt,[1,0],-1),add(pt,[1,0],1),0.5,[0,0],0,len,wid,st);
        E(c(0.8,1,6.4),7.2,5.2,M.chest);E(c(0.8,-1,6.4),7.2,5.2,M.chest);
        E(c(0.6,1,12),3.2,8.5,M.lats);E(c(0.6,-1,12),3.2,8.5,M.lats);
        E(c(0.98,1,7.5),4.6,2.6,M.upperback);E(c(0.98,-1,7.5),4.6,2.6,M.upperback);
        E(c(0.3,1,8.4),2.8,7.5,M.obliques);E(c(0.3,-1,8.4),2.8,7.5,M.obliques);
        E(c(0.38,1,0),4.2,11,M.abs);
        if(!M.abs){ctx.strokeStyle=BODY.line;ctx.lineWidth=0.6;[0.28,0.4,0.52].forEach(t=>{const a=c(t,1,3.5),b=c(t,-1,3.5);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();});}
      });
      belly.contour=false;
      // shorts waistband
      const w1=add(hip,up,6);ctx.fillStyle=BODY.shorts;ctx.beginPath();
      ctx.moveTo(w1[0]+p[0]*11,w1[1]+p[1]*11);ctx.lineTo(w1[0]-p[0]*11,w1[1]-p[1]*11);ctx.lineTo(hip[0]-p[0]*11.5,hip[1]-p[1]*11.5+2);ctx.lineTo(hip[0]+p[0]*11.5,hip[1]+p[1]*11.5+2);ctx.closePath();ctx.fill();
    }else{
      const path=()=>capsulePath(ctx,hip,top,9.2,11.2);
      limb(ctx,hip,top,9.2,11.2,NEAR);
      belly.contour=true;
      clipTo(ctx,path,()=>{
        const back=[-fwd[0],-fwd[1]];
        belly(ctx,hip,top,0.92,fwd,5.5,8.5,5.8,M.chest);
        belly(ctx,hip,top,0.45,fwd,6.4,12,4.2,M.abs);
        belly(ctx,hip,top,0.4,fwd,0,11,5,M.obliques);
        belly(ctx,hip,top,0.68,back,3.2,12.5,6,M.lats);
        belly(ctx,hip,top,1.0,back,5,8,5.5,M.upperback);
        belly(ctx,hip,top,0.28,back,5.5,7,3.8,M.lowerback);
        belly(ctx,hip,top,1.05,[0,0],0,6,6,M.delts);
      });
      belly.contour=false;
      // shorts and glutes
      capsulePath(ctx,add(hip,up,-1),add(hip,up,6),9.6,9.4);ctx.fillStyle=shortsGrad(ctx,add(hip,up,-1),add(hip,up,6),9.6);ctx.fill();
      if(M.glutes) belly(ctx,add(hip,up,-3),add(hip,up,3),0.5,[-fwd[0],-fwd[1]],4.6,5.6,4.6,M.glutes);
    }
    // neck
    limb(ctx,add(S.neck,up,-3),add(S.neck,up,6),3.4,3.2,NEAR);
  };
  const head=()=>{
    const c=S.head, r=SEG.head;
    const g=ctx.createRadialGradient(c[0]-r*0.4,c[1]-r*0.45,1,c[0],c[1],r);
    g.addColorStop(0,NEAR.light);g.addColorStop(0.55,NEAR.skin);g.addColorStop(1,NEAR.shade);
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(c[0],c[1],r,0,Math.PI*2);ctx.fill();
    const U=Math.atan2(td[1],td[0]);
    ctx.fillStyle=BODY.hair;ctx.beginPath();
    if(front){ctx.arc(c[0],c[1],r+0.3,U-1.05,U+1.05);ctx.closePath();}
    else{ctx.arc(c[0],c[1],r+0.3,U+0.25,U-1.75,true);ctx.closePath();}
    ctx.fill();
    if(!front){ const n=add(add(c,fwd,r*0.92),up,-1.2); dotAt(n,1.7,NEAR.skin); }
  };
  if(front){ leg(S.legF,S.footF,NEAR,true); leg(S.legN,S.footN,NEAR,false); torso(); head(); arm(S.armF,NEAR,true); arm(S.armN,NEAR,false); }
  else { leg(S.legF,S.footF,FAR,false); arm(S.armF,FAR,false); leg(S.legN,S.footN,NEAR,false); torso(); head(); arm(S.armN,NEAR,false); }
  ctx.restore();
}
function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
// cycle: pull (1 s), squeeze (0.4 s), slow return (2 s), pause (0.6 s)
function phase(ms){const T=4000,x=(ms%T)/T;if(x<.25)return ease(x/.25);if(x<.35)return 1;if(x<.85)return 1-ease((x-.35)/.5);return 0;}
const W=220,H=170;
function drawStage(ctx,spec,colors){
  // wall, floor and exercise mat
  ctx.fillStyle=colors.stage;ctx.fillRect(0,0,W,H);
  ctx.fillStyle=colors.floor;ctx.fillRect(0,157,W,H-157);
  ctx.fillStyle="#4F8A76";ctx.fillRect(28,154,164,4);
  if(spec.door!=null){
    const x=spec.door, w=24, left=Math.max(4,Math.min(W-w-4,x-w/2));
    ctx.fillStyle=colors.door;ctx.fillRect(left,8,w,149);
    ctx.strokeStyle=colors.doorEdge;ctx.lineWidth=1.5;ctx.strokeRect(left+0.75,8.75,w-1.5,147.5);
    ctx.fillStyle=colors.doorEdge;ctx.beginPath();ctx.arc(x<110?left+w-5:left+5,92,1.8,0,Math.PI*2);ctx.fill();
  }
  if(spec.stool){
    ctx.strokeStyle="#7A5A3C";ctx.lineCap="round";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(76,129);ctx.lineTo(114,129);ctx.stroke();
    ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(81,131);ctx.lineTo(79,156);ctx.moveTo(109,131);ctx.lineTo(111,156);ctx.stroke();
  }
}
function paintScene(cv,id,ms,reduced){
  const spec=POSES[id];if(!spec)return;
  const dpr=window.devicePixelRatio||1, cw=cv.clientWidth||W;
  if(cv.width!==Math.round(cw*dpr)){cv.width=Math.round(cw*dpr);cv.height=Math.round(cw*H/W*dpr);}
  const ctx=cv.getContext("2d");const k=cv.width/W;
  ctx.setTransform(k,0,0,k,0,0);
  const colors={accent:cssVar("--accent"),stage:cssVar("--stage"),floor:cssVar("--floor"),door:cssVar("--door"),doorEdge:cssVar("--door-edge")};
  ctx.clearRect(0,0,W,H);
  drawStage(ctx,spec,colors);
  if(reduced){drawFigure(ctx,spec,mix(spec.A,spec.B,1),colors,0.3,id);drawFigure(ctx,spec,mix(spec.A,spec.B,0),colors,1,id);return;}
  drawFigure(ctx,spec,mix(spec.A,spec.B,phase(ms)),colors,1,id);
}
