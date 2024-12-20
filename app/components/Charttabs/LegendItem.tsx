import React from 'react';
import styles from './Charts.module.css';
import { LegendItemProps } from './types';

export const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => {
  return (
    <div className={styles.legendItem}>
      <div className={styles.legendColor} style={{ backgroundColor: color }} />
      <div className={styles.legendLabel}>{label}</div>
    </div>
  );
};