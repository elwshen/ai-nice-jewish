import { useEffect } from "react";

interface AvatarProps {
  audioUrl: string;
  id: string;
}

export const Avatar = (props: AvatarProps) => {
  const { audioUrl, id} = props;

  useEffect(() => {
    const audioPlayer = document.getElementById("audio");
    if (audioPlayer) {
      (audioPlayer as HTMLAudioElement).load();
      (audioPlayer as HTMLAudioElement).play();
    }
  }, [audioUrl]);

  const onAudioPlay = () => {
    const videoPlayer = document.getElementById("talk-video");
    if (videoPlayer) {
      (videoPlayer as HTMLVideoElement).play();
    }
  };

  const onAudioPause = () => {
    const videoPlayer = document.getElementById("talk-video");
    if (videoPlayer) {
      (videoPlayer as HTMLVideoElement).pause();
    }
  };

  return (
    <center id={id}>
      <video
        id="talk-video"
        height="150"
        loop={true}
        playsInline
        poster={"/assets/bubbie4.png"}
      >
        <source src="/assets/bubbie4.mp4" />
      </video>
      {audioUrl && (
        <audio autoPlay id="audio" onPlay={onAudioPlay} onPause={onAudioPause}>
          <source id="audio-src" src={audioUrl} type="audio/mpeg"></source>
        </audio>
      )}{" "}
    </center>
  );
};
