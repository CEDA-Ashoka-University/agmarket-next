import React from 'react';
import styles from './Charts.module.css';
import { DateRangeProps } from './types';

export const DateRangeSelector: React.FC<DateRangeProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className={styles.dateRange}>
      <div className={styles.dateSelector}>
        <div className={styles.dateSelectorContent}>
          <div>{startDate}</div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/614129ff70f2d10f9291ce48782d0393a28c1b833eb48d46b8769717b1dde551?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc" alt="" className={styles.calendarIcon} />
        </div>
      </div>
      <div className={styles.dateSeparator}>-</div>
      <div className={styles.dateSelector}>
        <div className={styles.dateSelectorContent}>
          <div>{endDate}</div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/d94e01d0829bf35dcfd48d88705cf13138a6d2df13c885d9f1c720c364c06689?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc" alt="" className={styles.calendarIcon} />
        </div>
      </div>
    </div>
  );
};