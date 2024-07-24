// "use client";
// /* eslint-disable react/prop-types */
// import RightArrowIcon from "../../assets/icons/RightArrowIcon";
// import styles from "./HoverableDropdown.module.css";
// import NavigationButton from "../../components/NavigationButton/NavigationButton";
// import { useRouter } from "next/navigation";

// export default function HoverableDropdown({
//   heading,
//   options,
//   activeOption,
//   // handleOptionClick,
// }) {
//   const router = useRouter();
//   function handleClick(slug) {
//     router.push(`/${slug}`);
//   }
//   console.log("inside hoverable dropdown,active option", activeOption.slug);
//   // console.log('options',options)
//   return (
//     <div className={styles.hoverableDropdown}>
//       <div className={styles.hoverableDropdownBtn}>
//         <p>{heading}</p>
//         <RightArrowIcon />
//       </div>
//       <div className={styles.hoverableDropdownContent}>
//         {options.map((opt, index) => {
//           return (
//             <>
//               <p
//                 key={index}
//                 slug={opt.slug}
//                 className={`${
//                   styles[opt.slug === activeOption.slug ? "active" : null]
//                 }`}
//                 onClick={() => {
//                   // console.log('Slug:', opt.slug);
//                   handleClick(opt.slug);
//                 }}
//               >
//                 {opt.title}
//               </p>
//               {/* <NavigationButton slug={opt.slug} /> */}
//             </>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // export default HoverableDropdown;
"use client";
/* eslint-disable react/prop-types */
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import styles from "./HoverableDropdown.module.css";
import NavigationButton from "../../components/NavigationButton/NavigationButton";
import { useRouter } from "next/navigation";

export default function HoverableDropdown({
  heading,
  options,
  activeOption,
  // handleOptionClick,
}) {
  const router = useRouter();
  function handleClick(slug) {
    router.push(`/${slug}`);
  }
  // console.log("inside hoverable dropdown, active option", activeOption.slug);
  // console.log('options', options);
  return (
    <div className={styles.hoverableDropdown}>
      <div className={styles.hoverableDropdownBtn}>
        <p>{heading}</p>
        <RightArrowIcon />
      </div>
      <div className={styles.hoverableDropdownContent}>
        {options.map((opt) => {
          return (
            <p
              key={opt.slug} // Assuming opt.slug is unique
              slug={opt.slug}
              className={`${
                styles[opt.slug === activeOption.slug ? "active" : null]
              }`}
              onClick={() => {
                // console.log('Slug:', opt.slug);
                handleClick(opt.slug);
              }}
            >
              {opt.title}
            </p>
          );
        })}
      </div>
    </div>
  );
}

// export default HoverableDropdown;
