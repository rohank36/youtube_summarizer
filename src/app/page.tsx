'use client'
import React, {useState} from "react";


export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e:any) =>{
    e.preventDefault();
    setLoading(true)
    const transcript = await getTranscript(url);
    await getSummary(transcript);
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
    <main>
      <div className="flex-col justify-center items-center min-h-screen">
        
        <form className="flex gap-4 w-1/2" onSubmit={handleSubmit}>
          <label>Paste youtube url: </label>
          <input type="text" id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full"/>
          <button type="submit" disabled={loading}>Summarize</button>
        </form>
        
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            summary && (
              <div>
                <p>{summary}</p>
              </div>
            )
          )}
        </div>
      
      </div>
    </main>
  );
}
