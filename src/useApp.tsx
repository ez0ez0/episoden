import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import PeerStateEnum from "./enum/PeerStateEnum";

export type UseAppType = {
    peerId: string;
    remotePeerId: string;
    handleRemotePeerId: (value: string) => void;
    peerState: PeerStateEnum;
    handlePeerState: (value: PeerStateEnum) => void;
    handleClickDestroyButton: () => void;
    remoteVideoRef: React.RefObject<HTMLVideoElement>;
    currentUserVideoRef: React.RefObject<HTMLVideoElement>;
    callRemotePeer: (value: string) => void;
};
export default function useApp(): UseAppType {
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [peerState, setPeerState] = useState<PeerStateEnum>(PeerStateEnum.OPEN);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const currentUserVideoRef = useRef<HTMLVideoElement>(null);
    const peerInstance = useRef<null | Peer>(null);

    const handleRemotePeerId = (value: string) => {
        setRemotePeerId(value);
    };

    const handlePeerState = (value: PeerStateEnum) => {
        setPeerState(value);
    };

    const setVideoRef = (videoRef: React.RefObject<HTMLVideoElement>, mediaStream: MediaStream) => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = mediaStream;
        videoRef.current.oncanplaythrough = () => videoRef.current?.play();
    };

    async function getMediaStream() {
        try {
            return await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        } catch (err) {
            alert("can't get media");
        }
    }

    const callRemotePeer = (remotePeerId: string) => {
        const dataConnection = peerInstance.current?.connect(remotePeerId);
        dataConnection?.on("open", function () {
            console.log("My peer ID is: " + peerId);
        });
        dataConnection?.on("data", data => {
            dataConnection?.send(data);
        });

        getMediaStream().then(mediaStream => {
            const call = mediaStream ? peerInstance.current?.call(remotePeerId, mediaStream) : null;
            if (call) {
                call.on("stream", remoteStream => {
                    setVideoRef(remoteVideoRef, remoteStream);
                });
            }
        });
    };

    const handleClickDestroyButton = () => {
        peerInstance.current?.destroy();
        handlePeerState(PeerStateEnum.DESTROY);
    };

    useEffect(() => {
        if (peerState === PeerStateEnum.OPEN) {
            const peer = new Peer();
            peerInstance.current = peer;

            peer.on("open", id => {
                console.log("My peer ID is: " + id);
                setPeerId(id);
            });

            getMediaStream().then(mediaStream => {
                if (mediaStream) setVideoRef(currentUserVideoRef, mediaStream);
            });

            peer.on("connection", function (connect) {
                console.log("data", connect);
                setRemotePeerId(connect.peer);
                connect.on("open", function () {
                    setTimeout(function () {
                        connect.close();
                    }, 500);
                });
            });

            peer.on("close", () => {
                alert("this peer and all of its connections can no longer be used 😈");
            });

            peer.on("call", call => {
                getMediaStream().then(mediaStream => {
                    call.on("stream", remoteStream => {
                        setVideoRef(remoteVideoRef, remoteStream);
                    });
                    call.answer(mediaStream);
                });
            });

            setPeerState(PeerStateEnum.CLOSE);
        }
    }, [peerState]);

    return {
        peerId,
        peerState,
        remotePeerId,
        handleRemotePeerId,
        handleClickDestroyButton,
        callRemotePeer,
        handlePeerState,
        remoteVideoRef,
        currentUserVideoRef,
    };
}
