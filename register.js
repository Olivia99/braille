const area=document.getElementById("registerArea")
let points=[]
function saveAndReturn(){
  localStorage.setItem("customDotPositions",JSON.stringify(points))
  const isDist=window.location.pathname.includes('/dist/')
  const target=isDist?'./index.html':'index.html'
  window.location.assign(target)
}
function handlePos(clientX,clientY){
  if(points.length>=6) return
  const rect=area.getBoundingClientRect()
  const xPct=((clientX-rect.left)/rect.width)*100
  const yPct=((clientY-rect.top)/rect.height)*100
  points.push({xPct,yPct})
  if(points.length===6){ saveAndReturn() }
}
area.addEventListener("touchstart",(ev)=>{
  ev.preventDefault()
  const t=ev.touches[0]
  if(t){ handlePos(t.clientX,t.clientY) }
},{passive:false})
area.addEventListener("mousedown",(ev)=>{
  handlePos(ev.clientX,ev.clientY)
})
