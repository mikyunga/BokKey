'use client';

import { motion } from 'framer-motion';

// ⭐ 두 파일이 같은 폴더(src/components/common/map/)에 있는지 꼭 확인해주세요!
import ChildDetailPanel from './ChildDetailPanel';
import SeniorDetailPanel from './SeniorDetailPanel';

export default function DetailPanel(props) {
  const { place, mode, onClose } = props;

  // 디버깅용 (확인 후 삭제해도 됨)
  console.log('DetailPanel 렌더링 - 모드:', mode, '장소:', place?.name);

  if (!place) return null;

  return (
    <motion.div className="h-full">
      {/* 🔴 핵심: mode가 'senior'이면 SeniorDetailPanel, 아니면 ChildDetailPanel */}
      {mode === 'senior' ? (
        <SeniorDetailPanel {...props} onClose={onClose} />
      ) : (
        <ChildDetailPanel {...props} onClose={onClose} />
      )}
    </motion.div>
  );
}
