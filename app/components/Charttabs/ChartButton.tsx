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