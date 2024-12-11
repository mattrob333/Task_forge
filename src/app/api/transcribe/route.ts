import { NextResponse } from 'next/server'
import { createClient } from '@deepgram/sdk'

export async function POST(req: Request): Promise<Response> {
    const formData = await req.formData()
    const audio = formData.get('audio') as Blob

    if (!audio) {
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    if (!process.env.VITE_DEEPGRAM_API_KEY) {
        console.error('DEEPGRAM_API_KEY is not set')
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const deepgram = createClient(process.env.VITE_DEEPGRAM_API_KEY)

    try {
        const arrayBuffer = await audio.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { result, error } = await deepgram.listen.prerecorded.transcribeFile({
            buffer,
            mimetype: 'audio/webm',
        }, {
            smart_format: true,
            model: 'nova-2',
            language: 'en-US'
        })

        if (error) {
            console.error('Deepgram transcription error:', error)
            return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
        }

        const transcription = result?.results?.channels[0]?.alternatives[0]?.transcript || ''

        return NextResponse.json({ transcription: transcription.trim() })
    } catch (error) {
        console.error('Error in transcription process:', error)
        return NextResponse.json({ error: 'Error in transcription process' }, { status: 500 })
    }
}
