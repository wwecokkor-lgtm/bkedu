
import React, { useRef, useEffect, useState } from 'react';
import type { User } from './types';

interface VideoPlayerProps {
    src: string;
    user: User | null;
    onProgress: (progress: number) => void;
    onComplete: () => void;
    initialProgress: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, user, onProgress, onComplete, initialProgress }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [playbackRate, setPlaybackRate] = useState(1.0);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.duration > 0) {
                const progress = (video.currentTime / video.duration) * 100;
                onProgress(progress);
                
                if (progress >= 95) {
                    onComplete();
                }
            }
        };

        const handleLoadedMetadata = () => {
            if (initialProgress > 0 && video.duration > 0) {
                video.currentTime = (initialProgress / 100) * video.duration;
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [src, initialProgress, onProgress, onComplete]);
    
    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    return (
        <div className="relative w-full h-full bg-black">
            <video ref={videoRef} className="w-full h-full" controls controlsList="nodownload">
                {/* Mock video source */}
                <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <span className="text-white/10 text-lg md:text-2xl font-bold transform -rotate-15 select-none">
                    {user?.email} - {currentTime}
                </span>
            </div>

            {/* Playback Speed Control */}
            <div className="absolute bottom-4 right-20 pointer-events-auto">
                <select 
                    value={playbackRate} 
                    onChange={e => setPlaybackRate(parseFloat(e.target.value))}
                    className="bg-black/50 text-white text-xs rounded px-2 py-1 focus:outline-none"
                >
                    <option value="0.5">0.5x</option>
                    <option value="1.0">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2.0">2x</option>
                </select>
            </div>
        </div>
    );
};

export default VideoPlayer;
