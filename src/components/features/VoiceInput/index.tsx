import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function VoiceInput({ onTranscription }: { onTranscription: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        setIsProcessing(true);
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        // Here you would typically send the blob to your speech-to-text service
        // For now, we'll simulate a response
        setTimeout(() => {
          onTranscription("Sample transcribed text");
          setIsProcessing(false);
        }, 1000);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Failed to access microphone');
      console.error('Error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Voice Input</h3>
          <p className="text-sm text-muted-foreground">
            Speak your task details
          </p>
        </div>
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      </div>
    </Card>
  );
}