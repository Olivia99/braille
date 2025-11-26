const area=document.getElementById("registerArea")
let points=[]
let holdTimer=null
let holding=false
function saveAndReturn(){
  localStorage.setItem("customDotPositions",JSON.stringify(points))
  const isDist=window.location.pathname.includes('/dist/')
  const target=isDist?'/dist/index.html':'/index.html'
  window.location.assign(target)
}
function handlePos(clientX,clientY){
  if(points.length>=6) return
  const rect=area.getBoundingClientRect()
  const xPct=((clientX-rect.left)/rect.width)*100
  const yPct=((clientY-rect.top)/rect.height)*100
  points.push({xPct,yPct})
}
function startHold(){
  if(points.length!==6 || holding) return
  holding=true
  holdTimer=setTimeout(()=>{ saveAndReturn() },3000)
}
function cancelHold(){
  holding=false
  if(holdTimer){ clearTimeout(holdTimer); holdTimer=null }
}
area.addEventListener("touchstart",(ev)=>{
  const t=ev.touches[0]
  if(t){ handlePos(t.clientX,t.clientY) }
  if(points.length===6){ startHold() }
},{passive:true})
area.addEventListener("touchend",()=>{ cancelHold() })
area.addEventListener("mousedown",(ev)=>{
  handlePos(ev.clientX,ev.clientY)
  if(points.length===6){ startHold() }
})
area.addEventListener("mouseup",()=>{ cancelHold() })
