// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: text-width;
// share-sheet-inputs: plain-text;
const REDUCE_TO = 0.3
const punctuation = [",","!","?",".","'",'"',"/",]
const fillers = "the,is,a,an,of,is,end,then,than,are".split(",")

//text cleaning function to clear out punctuation and fillers
const cleaner_splitter = (text)=>{
  return text
    .split("")//clear out punctuation
    .filter(char=>!punctuation.includes(char))
    .join("")
    .toLowerCase()
    .split(" ") //remove fillers
    .filter(wrd => wrd && !fillers.includes(wrd));
}

const cleaner = (text) => text.replace(".","").replace(",", "").replace("!", "").replace("?", "").toLowerCase()
//remove excess whitespace
const de_ = str => str.split(" ").join(" ")

/*
* @param text the text to be analyzed
* @returns an object that maps words to their normalized frequency in given text
*/
const getTable = (text) => {
  let scores = {}
  let unscored = cleaner_splitter(text)
  unscored.forEach( w => {
    if(!scores[w] && !fillers.includes(w)){
      scores[w] = 1;
    } else {
      scores[w]+=1;
  }});
  
  
  const words = Object.keys(scores);
  //find max frequency-word
  let max = 0;
  let max_word = ""
  words.forEach( w => {
    if(scores[w] > max) {
      max = scores[w];
      max_word=w;
    }
  });
  
  //normalize word frequency (Fnorm = Fwrd/Fmax)
  words.forEach( wrd => scores[wrd] = (scores[wrd]/max))  
  return scores , { word:max_word, frequency:max }
}

/*
* @param text the text to summarize
* @returns a summary of the text
*/
const summarize = ( text ) => {  
  const freqs , { word , frequency } = getTable(text) 
  //ensure all sentences end with "."
  const formatted = text  
    .replace("?",".")
    .replace("!", ".")    
  const sentences = formatted.split(".")
  scored = {}
  //score sentences 
  sentences.forEach( sent => {
    score = 0
    let words = cleaner(sent.toLowerCase()).split(" ").filter(i=>i);
    words.forEach( w => {
      if(!freqs[w]) return 
      score += freqs[w]
    });//end word scoring
    scored[sent] = score
  });//scoring done

  
  //sort the scored sentences ( highest score first ) 
  const sorted = Object.keys(scored)
    .map(k=>[k,scored[k]])
    .sort((a,b)=>b[1]-a[1]);

  let result = "" , scoredResult = "";
 
  //create result string [min 1 sentence]
  const n = Math.max(sorted.length * REDUCE_TO , 1);  
  for( let i = 0; i < n; i++){
    let [sentence , score] = sorted[i]; 
      scoredResult += `${de_(sentence)} | [${score.toFixed(3)}\n`
      result += `${de_(sentence)}` 
  }
  
  return`===Scored===\n${de_(scoredResult)}\n\n===Summary===\n${de_(result)}\n\nThe most frequent word in the text was ${word} [${frequency}]`
  
}

const main() => {
  const text = args.plainTexts[0]
  const summary = summarize(text)
  Script.setShortcutOutput(summary)
  return summary
}

main();
Script.complete()
