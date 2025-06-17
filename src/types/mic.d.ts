declare module 'mic' {
  import { Stream } from 'stream';

  interface MicConfig {
    rate?: string;
    channels?: string;
    debug?: boolean;
    exitOnSilence?: number;
    device?: string;
    endian?: 'little' | 'big';
    bitwidth?: string;
    encoding?: string;
    fileType?: string;
  }

  interface Mic {
    start: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    getAudioStream: () => Stream;
  }

  function mic(config: MicConfig): Mic;
  
  export = mic;
} 