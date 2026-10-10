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
 "woodchop":{v:"front",tube:{pt:[30,22]},door:30,nomirror:true,A:{h:[110,96],t:-172,al:[-150,-150],ll:[10,0]},B:{h:[110,96],t:174,al:[35,40],ll:[10,0]}},
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
function drawFigure(ctx,spec,P,W,H,colors,ghost){
  const S=solve(spec,P);
  const line=(pts,w,c)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();};
  const ink=ghost?colors.line:colors.ink, far=ghost?colors.line:colors.muted;
  // tube first (behind body)
  if(!ghost&&spec.tube){
    ctx.save();ctx.setLineDash([]);
    const hands=[S.armN[2],S.armF[2]];
    const tubeLine=(a,b)=>{const len=Math.hypot(b[0]-a[0],b[1]-a[1]);ctx.lineWidth=Math.max(1.3,3.2-len/60);ctx.strokeStyle=colors.accent;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
    const t=spec.tube;
    if(t.pt){hands.forEach(h=>tubeLine(h,t.pt));ctx.fillStyle=colors.accent;ctx.beginPath();ctx.arc(t.pt[0],t.pt[1],3,0,7);ctx.fill();}
    else if(t==="feet"){tubeLine(S.armN[2],S.footN[1]);tubeLine(S.armF[2],S.footF[1]);}
    else if(t==="feetX"){tubeLine(S.armN[2],S.footF[1]);tubeLine(S.armF[2],S.footN[1]);}
    else if(t==="foot1"){hands.forEach(h=>tubeLine(h,S.footN[1]));}
    else if(t==="foot2"){hands.forEach(h=>tubeLine(h,S.footF[1]));}
    else if(t==="hands"){tubeLine(S.armN[2],S.armF[2]);}
    else if(t==="back"){tubeLine(S.armN[2],S.neck);tubeLine(S.neck,S.armF[2]);}
    else if(t==="hips"){tubeLine(S.armN[2],S.hip);}
    else if(t==="neck"){tubeLine(S.footN[1],S.neck);}
    ctx.restore();
  }
  ctx.lineCap="round";ctx.lineJoin="round";
  line(S.legF,5,far);line(S.footF,4,far);
  line(S.armF,4.5,far);
  line([S.hip,S.neck],7,ink);
  line(S.legN,5.5,ink);line(S.footN,4.5,ink);
  ctx.fillStyle=colors.bg;ctx.strokeStyle=ink;ctx.lineWidth=3;ctx.beginPath();ctx.arc(S.head[0],S.head[1],SEG.head,0,7);ctx.fill();ctx.stroke();
  line(S.armN,5,ink);
  if(!ghost&&spec.tube){ctx.fillStyle=colors.accent;[S.armN[2],S.armF[2]].forEach(h=>{ctx.beginPath();ctx.arc(h[0],h[1],2.6,0,7);ctx.fill();});}
}
function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
// cycle: pull (1 s), squeeze (0.4 s), slow return (2 s), pause (0.6 s)
function phase(ms){const T=4000,x=(ms%T)/T;if(x<.25)return ease(x/.25);if(x<.35)return 1;if(x<.85)return 1-ease((x-.35)/.5);return 0;}
const W=220,H=170;
function paintScene(cv,id,ms,reduced){
  const spec=POSES[id];if(!spec)return;
  const dpr=window.devicePixelRatio||1, cw=cv.clientWidth||W;
  if(cv.width!==Math.round(cw*dpr)){cv.width=Math.round(cw*dpr);cv.height=Math.round(cw*H/W*dpr);}
  const ctx=cv.getContext("2d");const k=cv.width/W;
  ctx.setTransform(k,0,0,k,0,0);
  const colors={ink:cssVar("--ink"),muted:cssVar("--muted"),line:cssVar("--line"),accent:cssVar("--accent"),bg:cssVar("--surface")};
  ctx.clearRect(0,0,W,H);
  // floor and door
  ctx.strokeStyle=colors.line;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(8,157);ctx.lineTo(W-8,157);ctx.stroke();
  if(spec.door!=null){ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(spec.door,6);ctx.lineTo(spec.door,157);ctx.stroke();}
  if(spec.stool){ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(78,128);ctx.lineTo(112,128);ctx.moveTo(82,128);ctx.lineTo(82,157);ctx.moveTo(108,128);ctx.lineTo(108,157);ctx.stroke();}
  if(reduced){drawFigure(ctx,spec,mix(spec.A,spec.B,1),W,H,colors,true);drawFigure(ctx,spec,mix(spec.A,spec.B,0),W,H,colors,false);return;}
  drawFigure(ctx,spec,mix(spec.A,spec.B,phase(ms)),W,H,colors,false);
}
