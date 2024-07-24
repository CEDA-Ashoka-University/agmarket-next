// // eslint-disable-next-line react/prop-types

// function InfoIcon({ width = 14, height = 14, style, onClick }) {
//   return (
//     <svg
//       width={width}
//       height={height}
//       viewBox="0 0 16 16"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       style={style}
//       onClick={onClick}
//     >
//       <circle opacity="0.6" cx="8" cy="8" r="8" fill="#1A375F" />
//       <path
//         d="M6.75923 12L7.66832 6.54545H8.73011L7.82102 12H6.75923ZM8.42116 5.69318C8.23651 5.69318 8.08026 5.63163 7.95241 5.50852C7.82694 5.38305 7.76894 5.2339 7.77841 5.06108C7.78788 4.88589 7.86127 4.73674 7.99858 4.61364C8.13589 4.48816 8.29569 4.42543 8.47798 4.42543C8.66264 4.42543 8.81771 4.48816 8.94318 4.61364C9.06866 4.73674 9.12784 4.88589 9.12074 5.06108C9.11127 5.2339 9.03788 5.38305 8.90057 5.50852C8.76563 5.63163 8.60582 5.69318 8.42116 5.69318Z"
//         fill="white"
//       />
//     </svg>
//   );
// }

// export default InfoIcon;
import React from 'react';

interface InfoIconProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const InfoIcon: React.FC<InfoIconProps> = ({
  width = 14,
  height = 14,
  style,
  onClick
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      onClick={onClick}
    >
      <circle opacity="0.6" cx="8" cy="8" r="8" fill="#1A375F" />
      <path
        d="M6.75923 12L7.66832 6.54545H8.73011L7.82102 12H6.75923ZM8.42116 5.69318C8.23651 5.69318 8.08026 5.63163 7.95241 5.50852C7.82694 5.38305 7.76894 5.2339 7.77841 5.06108C7.78788 4.88589 7.86127 4.73674 7.99858 4.61364C8.13589 4.48816 8.29569 4.42543 8.47798 4.42543C8.66264 4.42543 8.81771 4.48816 8.94318 4.61364C9.06866 4.73674 9.12784 4.88589 9.12074 5.06108C9.11127 5.2339 9.03788 5.38305 8.90057 5.50852C8.76563 5.63163 8.60582 5.69318 8.42116 5.69318Z"
        fill="white"
      />
    </svg>
  );
};

export default InfoIcon;
