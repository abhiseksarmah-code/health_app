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
/* outfit colours are fixed (they are clothes, not UI); far-side limbs use the darker shade */
const OUTFIT={
  near:{skin:"#C98B5F",shirt:"#1E8A9E",shorts:"#3D5275",shoe:"#2E3138",sole:"#F2F2EE"},
  far:{skin:"#A8714B",shirt:"#16697A",shorts:"#2F405D",shoe:"#24262C",sole:"#D9D9D4"},
  hair:"#2B1D15",handle:"#26282D"
};
function at(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
function drawFigure(ctx,spec,P,colors,alpha){
  const S=solve(spec,P), front=spec.v==="front";
  ctx.save();ctx.globalAlpha=alpha==null?1:alpha;ctx.lineCap="round";ctx.lineJoin="round";
  const seg=(a,b,w,c,cap)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap=cap||"round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.lineCap="round";};
  const dot=(p,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(p[0],p[1],r,0,Math.PI*2);ctx.fill();};
  const td=dir(P.t), fwd=[-td[1],td[0]];
  // tube first, so the body and hands sit on top of it
  if(spec.tube){
    const tubeLine=(a,b)=>{const len=Math.hypot(b[0]-a[0],b[1]-a[1]);seg(a,b,Math.max(1.6,3.6-len/55),colors.accent);};
    const t=spec.tube, hN=S.armN[2], hF=S.armF[2];
    if(t.pt){tubeLine(hF,t.pt);tubeLine(hN,t.pt);dot(t.pt,3.4,OUTFIT.handle);}
    else if(t==="feet"){tubeLine(hN,S.footN[1]);tubeLine(hF,S.footF[1]);}
    else if(t==="feetX"){tubeLine(hN,S.footF[1]);tubeLine(hF,S.footN[1]);}
    else if(t==="foot1"){tubeLine(hN,S.footN[1]);tubeLine(hF,S.footN[1]);}
    else if(t==="foot2"){tubeLine(hN,S.footF[1]);tubeLine(hF,S.footF[1]);}
    else if(t==="hands"){tubeLine(hN,hF);}
    else if(t==="back"){tubeLine(hN,S.neck);tubeLine(S.neck,hF);}
    else if(t==="hips"){tubeLine(hN,S.hip);}
    else if(t==="neck"){tubeLine(S.footN[1],S.neck);}
  }
  const leg=(L,F,c)=>{
    const [hip,knee,ankle]=L;
    seg(at(hip,knee,0.5),knee,8,c.skin); seg(knee,ankle,7,c.skin);
    seg(hip,at(hip,knee,0.6),11,c.shorts);
    const toe=F[1], heel=at(toe,ankle,1.25);
    seg(heel,toe,6.5,c.shoe); seg(at(heel,toe,0.1),at(heel,toe,0.95),2,c.sole,"butt");
  };
  const arm=(A,c,handle)=>{
    const [sh,el,hand]=A;
    seg(sh,el,6.5,c.skin); seg(el,hand,5.8,c.skin);
    seg(sh,at(sh,el,0.42),9.5,c.shirt);
    if(handle&&spec.tube) dot(hand,4,OUTFIT.handle);
    dot(hand,3.1,c.skin);
  };
  const torso=()=>{
    if(front){
      const p=[-td[1],td[0]], sw=13, hw=9;
      const top=at(S.neck,S.hip,0.04), bot=S.hip;
      ctx.fillStyle=OUTFIT.near.shirt;ctx.beginPath();
      ctx.moveTo(top[0]+p[0]*sw,top[1]+p[1]*sw);ctx.lineTo(top[0]-p[0]*sw,top[1]-p[1]*sw);
      ctx.lineTo(bot[0]-p[0]*hw,bot[1]-p[1]*hw);ctx.lineTo(bot[0]+p[0]*hw,bot[1]+p[1]*hw);ctx.closePath();ctx.fill();
      seg([bot[0]-p[0]*8,bot[1]-p[1]*8],[bot[0]+p[0]*8,bot[1]+p[1]*8],7,OUTFIT.near.shorts);
    }else{
      dot(S.hip,6.5,OUTFIT.near.shorts);
      seg(at(S.hip,S.neck,0.12),at(S.hip,S.neck,0.97),15,OUTFIT.near.shirt);
      seg(S.hip,at(S.hip,S.neck,0.14),13,OUTFIT.near.shorts,"butt");
    }
    seg(S.neck,at(S.neck,S.head,0.55),5,OUTFIT.near.skin);
  };
  const head=()=>{
    const c=S.head, r=SEG.head;
    dot(c,r,OUTFIT.near.skin);
    const U=Math.atan2(td[1],td[0]);
    ctx.fillStyle=OUTFIT.hair;ctx.beginPath();
    if(front){ctx.arc(c[0],c[1],r+0.6,U-Math.PI*0.48,U+Math.PI*0.48);ctx.closePath();}
    else{ctx.moveTo(c[0],c[1]);ctx.arc(c[0],c[1],r+0.6,U+0.55,U-2.35,true);ctx.closePath();}
    ctx.fill();
    if(!front){ // ear and a hint of the face direction
      const e=[c[0]-fwd[0]*1.5,c[1]-fwd[1]*1.5]; dot(e,2,OUTFIT.far.skin);
    }
  };
  if(front){ leg(S.legF,S.footF,OUTFIT.near); leg(S.legN,S.footN,OUTFIT.near); torso(); head(); arm(S.armF,OUTFIT.near,true); arm(S.armN,OUTFIT.near,true); }
  else { leg(S.legF,S.footF,OUTFIT.far); arm(S.armF,OUTFIT.far,true); leg(S.legN,S.footN,OUTFIT.near); torso(); head(); arm(S.armN,OUTFIT.near,true); }
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
  if(reduced){drawFigure(ctx,spec,mix(spec.A,spec.B,1),colors,0.3);drawFigure(ctx,spec,mix(spec.A,spec.B,0),colors,1);return;}
  drawFigure(ctx,spec,mix(spec.A,spec.B,phase(ms)),colors,1);
}
