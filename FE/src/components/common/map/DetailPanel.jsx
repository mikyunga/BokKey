'use client';

import { motion } from 'framer-motion';
// 아래 두 파일이 같은 폴더에 있어야 합니다.
import ChildDetailPanel from './ChildDetailPanel';
import SeniorDetailPanel from './SeniorDetailPanel';

export default function DetailPanel(props) {
  // MapPage에서 보내준 mode, place, onClose 등을 받습니다.
  const { place, mode, onClose } = props;

  // 디버깅용 로그: F12 개발자 도구 콘솔에서 확인 가능
  // console.log('현재 모드:', mode, '선택된 장소:', place?.name);

  if (!place) return null;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, x: -10, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* ⭐ 여기가 핵심입니다! mode가 'child'가 아니면 Senior를 보여줍니다. */}
      {mode === 'child' ? (
        <ChildDetailPanel {...props} onClose={onClose} />
      ) : (
        <SeniorDetailPanel {...props} onClose={onClose} />
      )}
    </motion.div>
  );
}
