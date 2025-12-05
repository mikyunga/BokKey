import { useEffect, useState } from 'react';
import ChildDetailPanel from './ChildDetailPanel';
import SeniorDetailPanel from './SeniorDetailPanel';

export default function DetailPanel(props) {
  const { place, mode, onClose } = props;
  const [isExiting, setIsExiting] = useState(false);

  // onClose 호출 시 먼저 exit 애니메이션 시작
  const handleClose = () => {
    setIsExiting(true);
    // 애니메이션 재생 후 실제 언마운트
    setTimeout(() => {
      onClose();
    }, 220); // match exit animation duration
  };

  // place가 바뀌면 isExiting 리셋
  useEffect(() => {
    setIsExiting(false);
  }, [place]);

  if (!place) return null;

  return (
    <div
      className={`
        h-full overflow-visible transform transition-all
        ${
          isExiting
            ? 'opacity-0 -translate-x-1 scale-[0.99] duration-220 ease-in'
            : 'opacity-100 translate-x-0 scale-100 duration-300 ease-out'
        }
      `}
    >
      {mode === 'child' ? (
        <ChildDetailPanel {...props} onClose={handleClose} />
      ) : (
        <SeniorDetailPanel {...props} onClose={handleClose} />
      )}
    </div>
  );
}
