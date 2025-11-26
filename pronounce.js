window.PRONOUNCE_MAP={
  b:"bo",p:"po",m:"mo",f:"fo",d:"de",t:"te",n:"ne",l:"le",
  g:"ge",k:"ke",h:"he",j:"ji",q:"qi",x:"xi",
  zh:"zhi",ch:"chi",sh:"shi",r:"ri",z:"zi",c:"ci",s:"si",
  y:"yi",w:"wu",
  a:"a",o:"o",e:"e",i:"yi",u:"wu","ü":"yu",
  ai:"ai",ei:"ei",ao:"ao",ou:"ou",an:"an",ang:"ang",en:"en",eng:"eng",
  iu:"you",ie:"ye","üe":"yue",er:"er",in:"yin",un:"wen","ün":"yun",ing:"ying",ong:"yong",
  ia:"ya",iao:"yao",ian:"yan",iang:"yang",iong:"yong",
  ua:"wa",uai:"wai",uan:"wan",uang:"wang",ue:"yue",ui:"wei",uo:"wo"
}
window.pronounceText=function(label){
  return window.PRONOUNCE_MAP[label]||label
}
