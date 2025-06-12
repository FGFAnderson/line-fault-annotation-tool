"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { YouTubePlayer } from "@/components/YoutubePlayer";
import Box from "@mui/material/Box";

export default function Home() {
    return (
        <div className={styles.page}>
            <Box sx={{ pt: 50 }}>
                <YouTubePlayer
                    href="https://www.youtube.com/watch?v=FYfTHfOpF74&t=2021s"
                    height={720}
                    width={1280}
                ></YouTubePlayer>
            </Box>
        </div>
    );
}
