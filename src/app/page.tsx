'use client'
import React, {useState} from "react";


export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadTime, setLoadTime] = useState<number>(0);

  const handleSubmit = async (e:any) =>{
    e.preventDefault();
    setLoadTime(0)
    setSummary("")
    setLoading(true)
    const startTime = new Date().getTime();
    const transcript = await getTranscript(url);
    await getSummary(transcript);
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
    setLoadTime(elapsedTime);
    setLoading(false)
  }

  const getTranscript = async (url:string) => {
    try{
      const res = await fetch(`/api/summary?video_id=${url}`)
      const data = await res.json();
      if (res.ok){
        console.log("Transcript fetched successfully");
        return data.transcript;
      }else{
        return null;
      }
      
    }catch(error){
      console.error("Error fetching transcript:", error);
      return null;
    }
  }

  const getSummary = async (transcript:string) => {
    try{

      if(!transcript){
        console.error("Cannot get summary because no transcript was found");
        return;
      }

      const res = await fetch(`/api/gpt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      if(res.ok){
        const data = await res.json();
        setSummary(data.summary);
        console.log("Summary fetched successfully");
      }
    }catch(error){
      console.error("Error fetching summary:", error);
    }
  }

  return (
    <main  className="">
      <div className="flex flex-col items-center min-h-screen w-full pt-8">
        
        <h1 className="mb-16 font-bold text-4xl text-slate-500">Summarize any YouTube video 💻</h1>
        
        <form className="flex gap-4 w-3/4 h-12" onSubmit={handleSubmit}>
          <input 
            className="border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600" 
            placeholder="Paste youtube video url here..." 
            type="text" 
            id="url" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}/>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 rounded-lg p-2 text-white font-bold hover:bg-sky-400 transition duration-300 ease-in-out"
            >Summarize
          </button>
        </form>
        
        <div className="mt-10 my-10 px-10 py-2 border-2 rounded-lg mx-auto w-3/4 max-w-4xl h-96 overflow-auto">
          <div className="flex justify-center items-center">
            {loading && <span className="loading loading-spinner loading-lg text-blue-500 mt-36"></span>}
          </div>
          <div>
            {!loading && summary && (
              <div className="whitespace-pre-wrap">
                <p>{summary}</p>
              </div>
            )}
          </div>
        </div>

        <div>
            {!loading && summary && (
              <div>
                <p className="font-bold text-slate-500">Summary generated in: {loadTime.toFixed(2)} seconds</p>
              </div>
            )}
        </div>
      
      </div>
    </main>
  );
}
