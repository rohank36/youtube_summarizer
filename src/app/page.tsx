'use client'
import React, {useState} from "react";


export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");

  const handleSubmit = async (e:any) =>{
    e.preventDefault();
    console.log(url);

    try{
      const res = await fetch(`/api/summary?video_id=${url}`)
      const data = await res.json();
      if (res.ok){
        setTranscript(data.transcript);
        console.log(data.transcript);
      }
      
    }catch(error){
      console.error("Error fetching transcript:", error);
    }

  }
  return (
    <main>
      <div className="flex-col justify-center items-center min-h-screen">
        <form className="flex gap-4 w-1/2" onSubmit={handleSubmit}>
          <label>Paste youtube url: </label>
          <input type="text" id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full"/>
          <button>Summarize</button>
        </form>
      </div>
    </main>
  );
}
