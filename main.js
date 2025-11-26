const initials=Object.keys(window.PINYIN_DOTS||{}).map(k=>({id:"shengmu-"+k,label:k,kind:"声母",dots:window.PINYIN_DOTS[k]}))
const vowels=Object.keys(window.PINYIN_VOWELS||{}).map(k=>({id:"yunmu-"+k,label:k,kind:"韵母",dots:window.PINYIN_VOWELS[k]}))
const items=[...initials,...vowels]
let index=0
let userDots=[false,false,false,false,false,false]
let playing=false
let correct=0
let attempts=0
const playBtn=document.getElementById("playBtn")
const submitBtn=document.getElementById("submitBtn")
const resetBtn=document.getElementById("resetBtn")
const nextBtn=document.getElementById("nextBtn")
const hintBtn=document.getElementById("hintBtn")
const bottomSubmitBtn=document.getElementById("bottomSubmitBtn")
const registerBtn=document.getElementById("registerBtn")
const itemLabel=document.getElementById("itemLabel")
const correctCount=document.getElementById("correctCount")
const attemptCount=document.getElementById("attemptCount")
const message=document.getElementById("message")
const dots=Array.from(document.querySelectorAll(".dot"))
const pad=document.querySelector(".pad")
const autoSpeakToggle=document.getElementById("autoSpeakToggle")
let autoSpeak=autoSpeakToggle?autoSpeakToggle.checked:false
const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"")
if(isMobile){
  autoSpeak=false
  if(autoSpeakToggle) autoSpeakToggle.checked=false
}
function clearPad(){
  userDots=[false,false,false,false,false,false]
  dots.forEach((btn)=>{
    btn.classList.remove("active")
    btn.setAttribute("aria-pressed","false")
    const names=["1","2","3","4","5","6"]
    const i=Number(btn.dataset.index)
    btn.setAttribute("aria-label",`点位${names[i]} 未选`)
  })
}
function updatePad(){
  dots.forEach((btn)=>{
    const i=Number(btn.dataset.index)
    const active=userDots[i]
    btn.classList.toggle("active",active)
    btn.setAttribute("aria-pressed",active?"true":"false")
    const names=["1","2","3","4","5","6"]
    const name=names[i]
    btn.setAttribute("aria-label",`点位${name} ${active?"已选":"未选"}`)
  })
}
function setControlsEnabled(e){
  playBtn.disabled=!e
  submitBtn.disabled=!e
  resetBtn.disabled=!e
  nextBtn.disabled=!e
}
function speak(text){
  playing=true
  setControlsEnabled(false)
  const localBase='audio/'
  let triedTone=false
  const buildSrc=(lbl,tone)=>{
    const base=(lbl||'').replace(/ü/g,'v')+(tone?'1':'')
    return localBase+base+'.mp3'
  }
  const audio=new Audio()
  audio.src=buildSrc(text,false)
  audio.onended=()=>{playing=false;setControlsEnabled(true)}
  audio.onerror=()=>{
    if(!triedTone){
      triedTone=true
      audio.src=buildSrc(text,true)
      audio.load()
      audio.play().catch(()=>{ audio.onerror&&audio.onerror() })
      return
    }
    if("speechSynthesis" in window){
      const u=new SpeechSynthesisUtterance(window.pronounceText(text))
      u.lang="zh-CN"
      const voices=window.speechSynthesis.getVoices()
      const zh=voices.find(v=>/zh|中文|Chinese/i.test(v.lang||v.name))
      if(zh) u.voice=zh
      u.onend=()=>{playing=false;setControlsEnabled(true)}
      u.onerror=()=>{playing=false;setControlsEnabled(true)}
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }else{
      playing=false;setControlsEnabled(true)
    }
  }
  audio.play().catch(()=>{
    audio.onerror&&audio.onerror()
  })
}
function speakHint(){
  const it=items[index]
  const names=["一","二","三","四","五","六"]
  const words=[]
  for(let i=0;i<6;i++){ if(it.dots[i]) words.push(names[i]) }
  const text=words.join(" ")
  if(!text){ return }
  if("speechSynthesis" in window){
    const u=new SpeechSynthesisUtterance(text)
    u.lang="zh-CN"
    const voices=window.speechSynthesis.getVoices()
    const zh=voices.find(v=>/zh|中文|Chinese/i.test(v.lang||v.name))
    if(zh) u.voice=zh
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }
}
function loadItem(){
  const it=items[index]
  itemLabel.textContent=it.label
  clearPad()
  message.textContent=""
  if(autoSpeak){
    speak(it.label)
  }
}
function applyCustomPositions(){
  try{
    const raw=localStorage.getItem("customDotPositions")
    if(!raw) return
    const pos=JSON.parse(raw)
    if(!Array.isArray(pos)||pos.length!==6) return
    if(pad){ pad.classList.add("pad--custom") }
    dots.forEach(btn=>{
      const di=Number(btn.dataset.index)
      const p=pos[di]
      if(!p) return
      btn.style.position="absolute"
      btn.style.left=`${p.xPct}%`
      btn.style.top=`${p.yPct}%`
      btn.style.transform="translate(-50%,-50%)"
    })
  }catch{}
}
function compare(a,b){
  for(let i=0;i<6;i++){if(a[i]!==b[i]) return false}
  return true
}
function onSubmit(){
  const it=items[index]
  attempts+=1
  const ok=compare(userDots,it.dots)
  if(ok){
    correct+=1
    message.textContent="正确，即将进入下一题"
    message.style.color="#1a7f37"
    setTimeout(()=>{ onNext() },800)
  }else{
    message.textContent="错误"
    message.style.color="#cf222e"
    clearPad()
  }
  correctCount.textContent=String(correct)
  attemptCount.textContent=String(attempts)
}
function onReset(){
  clearPad()
  message.textContent=""
}
function onNext(){
  index=(index+1)%items.length
  loadItem()
}
dots.forEach(btn=>{
  const toggle=()=>{
    const i=Number(btn.dataset.index)
    userDots[i]=!userDots[i]
    updatePad()
  }
  const hasTouch='ontouchstart' in window
  if(hasTouch){
    btn.addEventListener("touchstart",(ev)=>{ev.preventDefault();toggle()},{passive:false})
  }else{
    btn.addEventListener("click",toggle)
  }
})
playBtn.addEventListener("click",()=>{speak(items[index].label)})
submitBtn.addEventListener("click",onSubmit)
resetBtn.addEventListener("click",onReset)
nextBtn.addEventListener("click",onNext)
hintBtn&&hintBtn.addEventListener("click",speakHint)
bottomSubmitBtn&&bottomSubmitBtn.addEventListener("click",onSubmit)
 registerBtn&&registerBtn.addEventListener("click",(ev)=>{
  ev.preventDefault()
  ev.stopPropagation()
  const isDist=window.location.pathname.includes('/dist/')
  const target=isDist?'./register.html':'register.html'
  window.location.assign(target)
})
autoSpeakToggle&&autoSpeakToggle.addEventListener("change",()=>{autoSpeak=autoSpeakToggle.checked})
applyCustomPositions()
loadItem()
