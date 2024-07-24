// /* eslint-disable react/prop-types */
// import styles from "./Button.module.css";

// function Button({ className, children, handleClick, style }) {
//   console.log(className)
//   return (
//     <div
//       className={`button-container ${className}`}
//       onClick={e => handleClick(e)}
//       style={style}
//     >
//       {children}
//     </div>
//   );
// }

// export default Button;

/* eslint-disable react/prop-types */
import React from "react";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // Corrected event type to HTMLButtonElement
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  handleClick,
  style,
}) => {
  const baseClasses =
    "px-5 py-2 border border-solid border-primary rounded-full flex items-center justify-center gap-2 cursor-pointer";
  const hoverClasses = "hover:bg-backgroundHover";
  const ctaClasses = "bg-primary";
  const disabledClasses = "opacity-30";

  // Determine if the button has the 'cta' class
  const isCta = className.includes("cta");
  // console.log("iscta", isCta)
  return (
    <button
      className={`${baseClasses} ${hoverClasses} ${isCta ? ctaClasses : ""} ${
        className.includes("disabled") ? disabledClasses : ""
      } ${className}`}
      onClick={handleClick} // Using onClick directly on button element
      style={style}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Check if the child is a 'p' element
          if (child.type === "p") {
            // Create a new props object with className
            const newProps = {
              ...(child.props || {}),
              className: `${
                child.props?.className ?? ""
              } ${isCta ? "text-white" : "text-primary"}`,
            };
            // Clone the paragraph element and assign the new props
            return React.cloneElement(child, newProps);
          }
          return child;
        }
        return child;
      })}
    </button>
  );
};

export default Button;
