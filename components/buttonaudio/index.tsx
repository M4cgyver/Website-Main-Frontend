"use client";

import { useRef } from 'react';

interface ButtonAudioProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string;
}

const ButtonAudio = ({ src, ...props }: ButtonAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0.25;
      audioRef.current.play();
    }
  };

  return (
    <>
      <button {...props} onClick={handleClick} />
      <audio ref={audioRef} src={src} preload="auto"/>
    </>
  );
};

export default ButtonAudio;
