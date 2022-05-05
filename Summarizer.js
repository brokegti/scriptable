// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: text-width;
// share-sheet-inputs: plain-text;

const punctuation = [",","!","?",".","'",'"',"/",]

const fillers = "the,is,a,an,of,is,end,then,than,are".split(",")


function cleaner(text){  
  return text  
    .replace(".","").replace(",", "")
    .replace("!", "").replace("?", "")

}    
      
function getTable(text){
  scores = {}
  const clean = cleaner(text)
  words = clean.split(" ").filter(item=>item)

  words.forEach( word => {
    let w = word.toLowerCase()
    if(!scores[w] && !fillers.includes(w)){
      scores[w] = 1
    } else {
      scores[w]+=1
    }
  
  })
      
  let max = 0
  Object.keys(scores).forEach(k=>{
    if(scores[k] > max) {
      max = scores[k]
    }
  })
  
  Object.keys(scores)
    .forEach( k => scores[k] = (scores[k]/max))  
  return scores
}




function scoreSentences( text ){  
  const freqs = getTable(text)

  const formatted = text  
    .replace("?",".")
    .replace("!", ".")
    
  const sentences = formatted.split(".")
  scored = {}
  sentences.forEach(sent=>{
    score = 0
    words = cleaner(sent)
      .split(" ").filter(i=>i)
    


    words.forEach(word=>{
      w = word.toLowerCase()
      if(!freqs[w]) return 
      score += freqs[w]
  })
  scored[sent] = score
  
})

  
  const sorted = Object.keys(scored)
    .map(k=>[k,scored[k]])
    .sort((a,b)=>b[1]-a[1])
  
  let result = ""
  count = 0
  while( count < Math.max(sorted.length * 0.3 , 1)){    
  result+= sorted[count][0] +" [ " + sorted[count][1].toFixed(3) + "]. "
  count += 1


}
      
  return result   
}

function main(){
const text = args.plainTexts[0]
summary = scoreSentences(text)
console.log(summary)
Script.setShortcutOutput(summary)
return summary

}

main()

Script.complete()
