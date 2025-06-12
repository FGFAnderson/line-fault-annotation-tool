"use client";
import React, { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        YT?: typeof YT;
        onYouTubeIframeAPIReady?: () => void;
    }
}

interface YouTubePlayerProps {
    href: string;
    width?: number;
    height?: number;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
    href,
    width = 1280,
    height = 720,
}) => {
    const playerRef = useRef<YT.Player | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [isAPIReady, setIsAPIReady] = useState(false);

    // Extract video ID from YouTube URL
    let videoId: string | null = null;
    try {
        const urlObj = new URL(href);
        if (urlObj.hostname === "youtu.be") {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes("youtube.com")) {
            videoId = urlObj.searchParams.get("v");
        }
    } catch {
        videoId = null;
    }

    // Load YouTube API
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setIsAPIReady(true);
            return;
        }

        if (!document.querySelector("script[src*='youtube.com/iframe_api']")) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            tag.async = true;

            window.onYouTubeIframeAPIReady = () => {
                setIsAPIReady(true);
            };

            document.head.appendChild(tag);
        }
    }, []);

    // Initialize player when API is ready
    useEffect(() => {
        if (
            !videoId ||
            !isAPIReady ||
            !containerRef.current ||
            playerRef.current
        ) {
            return;
        }

        playerRef.current = new window.YT!.Player(containerRef.current, {
            width,
            height,
            videoId,
            playerVars: {
                autoplay: 0,
                modestbranding: 1,
            },
            events: {
                onReady: (_event: YT.PlayerEvent) => {
                    setIsReady(true);
                },
                onError: (event: YT.OnErrorEvent) => {
                    console.error("YouTube player error:", event.data);
                },
            },
        });
    }, [videoId, width, height, isAPIReady]);

    if (!videoId) {
        return <div>Invalid YouTube URL</div>;
    }

    return <div ref={containerRef} />;
};
