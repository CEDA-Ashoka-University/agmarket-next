
import * as React from 'react';
// import { ActionButtonProps } from '../PriceTable/Types';

export interface ActionButtonProps {
  icon: string;
  label: string;
  onClick?: () => void; // Optional onClick handler
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => {
  return (
    <div
      className="flex flex-col justify-center self-stretch px-3 py-2.5 my-auto text-center bg-white rounded-lg border border-solid border-blue-950 min-h-[32px] cursor-pointer"
      onClick={onClick} // Attach the onClick handler
    >
      <div className="flex gap-2 items-center">
        <img
          loading="lazy"
          src={icon}
          className="object-contain shrink-0 self-stretch my-auto w-3.5 rounded-sm aspect-[1.08]"
          alt=""
        />
        <div className="self-stretch my-auto">{label}</div>
      </div>
    </div>
  );
};
