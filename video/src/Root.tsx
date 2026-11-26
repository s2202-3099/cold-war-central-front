import {Composition} from 'remotion';
import {PartVideo, durationOf} from './Video';

const PARTS: [string, string][] = [['Part1', 'part1'], ['Part2', 'part2'], ['Part3', 'part3'], ['CentralFront', 'single']];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {PARTS.map(([id, part]) => (
        <Composition key={id} id={id} component={PartVideo} defaultProps={{part}} durationInFrames={durationOf(part)} fps={30} width={1920} height={1080} />
      ))}
    </>
  );
};
