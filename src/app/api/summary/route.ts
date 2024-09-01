import { YoutubeTranscript } from 'youtube-transcript';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest){
    try{
        const { searchParams } = new URL(req.url);
        const video_id = searchParams.get('video_id');
        if(!video_id){
            return NextResponse.json({ error: 'Missing video_id parameter' }, { status: 400 });
        }
        const transcript = await YoutubeTranscript.fetchTranscript(video_id);
        const ts_text = transcript.map((item:any) => item.text).join(" ");
        return NextResponse.json({ transcript: ts_text, status: 200 });
    }catch(error){  
        console.error("Error fetching transcript:", error);
        return NextResponse.json({ error: error, status: 500 })
    }
}

function extractVideoId(url:string){
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}