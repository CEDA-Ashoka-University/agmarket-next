import React from 'react';
import styles from './Charts.module.css';
import { ChartButtonProps } from './types';


export const ChartButton: React.FC<ChartButtonProps> = ({ icon, text, onClick }) => {
  return (
    <div className={styles.chartButton} onClick={onClick}>
      <div className={styles.chartButtonContent}>
        <img loading="lazy" src={icon} alt="" className={styles.chartButtonIcon} />
        <div className={styles.chartButtonText}>{text}</div>
      </div>
    </div>
  );
};

// import { ReactNode } from "react";
// import styles from './Charts.module.css';

// interface ChartButtonProps {
//   icon: ReactNode;
//   text: string;
//   onClick: () => void;
// }

// export const ChartButton: React.FC<ChartButtonProps> = ({ icon, text, onClick }) => {
//   return (
//     <button className={styles.chartButton}
//       onClick={onClick}
//       // className="flex items-center space-x-2 p-2 border rounded"
//     >
//       <div className={styles.chartButtonContent}>      {icon}
//       <span >{text}</span>
//       </div>

//     </button>
//   );
// };

// export default ChartButton;
