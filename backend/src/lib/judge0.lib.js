export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }
    return languageMap[language.toUpperCase()];
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const pollBatchResults = async (tokens) => {
    while(true){
        const {data} = axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        })
        const results = data.submissions

        const isAllDone= results.every(
            (res)=>res.status.id !==1 && res.status.id !==2 // 1-> In Queue, 2-> Processing
        )

        if(isAllDone) return results
        await sleep(1000);
    }
}

export const submitBatch= async (submissions)=>{
    const {data} =axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })
    console.log('submission Result', data)
    
    return data //[{token},{token},{token}]
}