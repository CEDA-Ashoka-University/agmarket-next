import React from 'react';
import styles from './Charts.module.css';
import { ChartFilterButtonProps } from './types';

export const ChartFilterButton: React.FC<ChartFilterButtonProps> = ({ text, isActive, onClick }) => {
  return (
    <div 
      className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {text}
    </div>
  );
};