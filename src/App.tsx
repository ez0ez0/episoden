import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import VideoBox from "./components/VideoBox";
import "./App.css";
import Button from "./components/Button";
import PeerStateEnum from "./enum/PeerStateEnum";
import useApp from "./useApp";

const handleCopy = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        alert("Content copied to clipboard");
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
};

function App() {
    const {
        peerId,
        remotePeerId,
        handleRemotePeerId,
        peerState,
        handlePeerState,
        handleClickDestroyButton,
        remoteVideoRef,
        currentUserVideoRef,
        callRemotePeer,
    } = useApp();

    return (
        <div className="App" style={{ margin: "30px" }}>
            <div className="textBox">
                <h1 style={{ marginBottom: "20px" }}>WebRTC</h1>
                <div>
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>My ID : </span>
                    <span style={{ fontWeight: "normal" }}>{peerId}</span>
                    <Button
                        sx={{ marginLeft: "12px", fontSize: "12px", padding: "5px", marginBottom: "10px" }}
                        handleClick={() => handleCopy(peerId)}
                        buttonText="copy ✓"
                    />
                </div>
            </div>
            <div className="inputWrapper" style={{ marginBottom: "10px" }}>
                <input type="text" value={remotePeerId} onChange={e => handleRemotePeerId(e.target.value)} />
                <Button sx={{ marginLeft: "4px" }} handleClick={() => callRemotePeer(remotePeerId)} buttonText="Call 🤚" />
            </div>
            <div className="buttonWrapper" style={{ marginBottom: "10px" }}>
                <Button
                    handleClick={() => {
                        window.open("http://localhost:3000", "_blank");
                    }}
                    buttonText="New User 🌱"
                />
                <Button handleClick={handleClickDestroyButton} buttonText="Destroy 🤯" />
                <Button
                    handleClick={() => {
                        if (peerState === PeerStateEnum.DESTROY) {
                            handlePeerState(PeerStateEnum.OPEN);
                            alert(" connection is open 🧚‍♀️");
                        } else {
                            alert(" connection is already open 🧚‍♀️");
                        }
                    }}
                    buttonText="Reopen 😀"
                />
            </div>
            {peerState === PeerStateEnum.DESTROY ? (
                <div
                    className="videoWrapper"
                    style={{
                        width: "100%",
                        height: "300px",
                        textAlign: "center",
                        backgroundColor: "#53655380",
                        fontSize: "54px",
                        lineHeight: "300px",
                        color: "white",
                        borderRadius: "10px",
                    }}
                >
                    🤯 Destroyed. Click Reopen Button! 🤯
                </div>
            ) : (
                <div className="videoWrapper" style={{ display: "flex", gap: "20px" }}>
                    <VideoBox videoLabel={`😎 Host -- ${peerId}`} videoRef={currentUserVideoRef} />
                    <VideoBox videoLabel={`🥸 Guest -- ${remotePeerId}`} videoRef={remoteVideoRef} />
                </div>
            )}
        </div>
    );
}

export default App;
