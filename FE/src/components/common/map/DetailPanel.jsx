import ChildDetailPanel from './ChildDetailPanel';
import SeniorDetailPanel from './SeniorDetailPanel';

export default function DetailPanel(props) {
  const { place, mode } = props;

  if (!place) return null;

  return (
    <div className="h-full overflow-visible">
      {mode === 'child' ? <ChildDetailPanel {...props} /> : <SeniorDetailPanel {...props} />}
    </div>
  );
}
