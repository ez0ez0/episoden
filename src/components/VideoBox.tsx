import React, { useEffect, useState, useRef } from "react";

type VideoBoxPropsType = { videoLabel: string; videoRef: React.RefObject<HTMLVideoElement> };
function VideoBox({ videoLabel, videoRef }: VideoBoxPropsType) {
    return (
        <div style={{ width: "50%" }}>
            <p style={{ fontSize: "14px", borderRadius: "10px 10px 0 0", padding: "8px 15px", backgroundColor: "green", color: "white" }}>{videoLabel}</p>
            <div style={{ border: "5px green solid", borderRadius: "0 0 10px 10px" }}>
                <video ref={videoRef} style={{ objectFit: "fill", display: "block", margin: "0 auto", width: "96%", padding: "2% 0" }} />
            </div>
        </div>
    );
}

export default VideoBox;
