import {Composition} from 'remotion';
import {CentralFront, DURATION} from './Video';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CentralFront"
      component={CentralFront}
      durationInFrames={DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
