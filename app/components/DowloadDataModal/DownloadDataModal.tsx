
// import { useState } from "react";
// import Modal from "../../ui/Modal/Modal";
// import CsvIcon from "../../assets/icons/CsvIcon";
// import CloseIcon from "../../assets/icons/CloseIcon";
// import PngIcon from "../../assets/icons/PngIcon";
// import Button from "../../ui/Button/Button";

// import styles from "./DownloadDataModal.module.css";

// interface DownloadDataModalProps {
//   handleCloseModal: () => void;
//   handleDownloadClick: (
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
//     downloadOption: string,
//     includeOptions: { hiddenCharts: boolean; selectedTimeFrame: boolean }
//   ) => void;
// }

// const DownloadDataModal: React.FC<DownloadDataModalProps> = ({
//   handleCloseModal,
//   handleDownloadClick,
// }) => {
//   const [downloadOption, setDownloadOption] = useState("CSV");
//   const [includeOptions, setIncludeOptions] = useState({
//     hiddenCharts: false,
//     selectedTimeFrame: true,
//   });

//   const handleIncludeOptionsChange = (key: string, value: boolean) => {
//     setIncludeOptions({ ...includeOptions, [key]: value });
//   };

//   const handleButtonClick = (
//     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) => {
//     handleDownloadClick(e, downloadOption, includeOptions);
//   };

//   return (
//     <Modal handleCloseModal={handleCloseModal}>
//       <div style={{ width: 350 }}>
//         <div className={styles.modalHeader}>
//           <h2>Download Data</h2>
//           <CloseIcon onClick={handleCloseModal} />
//         </div>
//         <p className={styles.modalSubheading}>Choose file type to download</p>
//         <div className={styles.modalDownloadButtons}>
//           <div
//             // className={"downloadButton" + (downloadOption === "CSV" ? " active" : "")}
//             className={
//               downloadOption === "CSV" ? styles.downloadButtonActive : styles.downloadButtonNonactivep
//             }
//             onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//               e.stopPropagation();
//               setDownloadOption("CSV");
//             }}
//           >
//             <CsvIcon />
//             <div
//               className={
//                 downloadOption === "CSV" ? styles.downloadButtonActivep : styles.downloadButtonNonactivep
//               }
//             >
//               <p>CSV</p>
//             </div>
//           </div>
//           <div
//             className={
//               downloadOption === "PNG" ? styles.downloadButtonActive : styles.downloadButtonNonactivep
//             }
//             onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//               e.stopPropagation();
//               setDownloadOption("PNG");
//             }}
//           >
//             <PngIcon />
//             <div
//               className={
//                 downloadOption === "PNG" ? styles.downloadButtonActivep : styles.downloadButtonNonactivep
//               }
//             >
//               <p>PNG</p>
//             </div>
//           </div>
//         </div>
//         {downloadOption === "CSV" && (
//           <div className={styles.downloadCheckboxes}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={includeOptions.hiddenCharts}
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   handleIncludeOptionsChange("hiddenCharts", e.target.checked);
//                 }}
//               />
//               Include the hidden charts in the export
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={includeOptions.selectedTimeFrame}
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   handleIncludeOptionsChange(
//                     "selectedTimeFrame",
//                     e.target.checked
//                   );
//                 }}
//               />
//               Include only the selected timeframe
//             </label>
//           </div>
//         )}
//         <Button className="w-full p-2.5 rounded-full flex items-center justify-center cursor-pointer bg-[#1a375f] text-white mt-6 hover:opacity-90" handleClick={handleButtonClick}>
//           <p className="w-full text-center text-white">Download {downloadOption}</p>
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default DownloadDataModal;

import { useState } from "react";
import Modal from "../../ui/Modal/Modal";
import CsvIcon from "../../assets/icons/CsvIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import PngIcon from "../../assets/icons/PngIcon";
import Button from "../../ui/Button/Button";
import { Input, Label } from "reactstrap";
import { addUserToList, checkUserInList } from "../lib/apiService";
import styles from "./DownloadDataModal.module.css";
import { CreateErrorNotification } from "../Notifications/Notification";


interface DownloadDataModalProps {
  handleCloseModal: () => void;
  handleDownloadClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    downloadOption: string,
    includeOptions: { hiddenCharts: boolean; selectedTimeFrame: boolean }
  ) => void;
}

const DownloadDataModal: React.FC<DownloadDataModalProps> = ({
  handleCloseModal,
  handleDownloadClick,
}) => {
  const [downloadOption, setDownloadOption] = useState("CSV");
  const [includeOptions, setIncludeOptions] = useState({
    hiddenCharts: false,
    selectedTimeFrame: true,
  });
  const [verifyEmail, setVerifyEmail] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [organization, setOrganization] = useState("");
  const [initial, setInitial] = useState(true);
  const [unverified, setUnverified] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleIncludeOptionsChange = (key: string, value: boolean) => {
    setIncludeOptions({ ...includeOptions, [key]: value });
  };

  const handleUserVerification = async () => {
    try {
      // console.log("response1")
      const response = await checkUserInList({ email: verifyEmail });
      // console.log("response2")
      if (response.data.exists) {
        setVerified(true);
      } else {
        setUnverified(true);
      }
      setInitial(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await addUserToList({
        email: email,
        firstname: firstName,
        organization: organization,
      });
      if (response.data.status === "added") {
        setVerified(true);
      } else if (response.data.status === "exists") {
        CreateErrorNotification("User already exists!");
        setUnverified(false);
        setInitial(true);
      }
    } catch (error) {
      console.error(error);
    }
    setUnverified(false);
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (initial) {
      console.log("inside button")
      handleUserVerification();
    } else if (unverified) {
      handleAddUser();
    } else {
      handleDownloadClick(e, downloadOption, includeOptions);
      setVerified(false);
      setInitial(true);
    }
  };

  return (
    <Modal handleCloseModal={handleCloseModal}>
      <div style={{ width: 350 }}>
       
        {initial && (
          <div>
          <div className="font-bold flex justify-between">
            <h5>Confirm Details</h5>
            <CloseIcon onClick={handleCloseModal} />
            {/* <h5>Confirm Details</h5> */}
            </div>
            <label className="my-10 font-sans">Please enter your email id to download:</label>
            <Input className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              placeholder=""
              value={verifyEmail}
              onChange={(e) => setVerifyEmail(e.target.value)}
              required
            />
            <Button className="w-full p-2.5 rounded-full flex items-center justify-center cursor-pointer bg-[#1a375f] text-white mt-6 hover:opacity-90" handleClick={handleButtonClick}>
              <p className="w-full text-center text-white">Continue</p>
            </Button>
        
          </div>
        )}
        {unverified && (
          <>
          <div className='mb-6'>
            <p className={styles.modalSubheading}>Confirm details:</p>
            <div/>
            <Label className={styles.modalLabel}>Email ID* :</Label>
            <Input className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-2"
              type="text"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Label className={styles.modalLabel}>Name* :</Label>
            <Input
              className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-2"
              type="text"
              placeholder=""
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label className={styles.modalLabel}>Organization/Affiliation (Optional) :</label>
            <Input
              className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-2"
              type="text"
              placeholder=""
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
             <Input
            type="text"
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
          <div className="flex">
            <Input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="checkbox" />
            <Label className="text-primary font-inter ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" check>
              Subscribe to newsLetters from CEDA
            </Label>
          </div>

          <div>
            <Input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="checkbox" />
            <Label className="text-primary font-inter break-words ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-3" check>
              I have read the privacy policy and agree to the terms & conditions
            </Label>
          </div>
            <Button className="w-full p-2.5 rounded-full flex items-center justify-center cursor-pointer bg-[#1a375f] text-white mt-6 hover:opacity-90" handleClick={handleButtonClick}>
              <p className="w-full text-center text-white">Submit</p>
            </Button>
            </div>
          </>
        )}
        {verified && (
          <>
            <p className={styles.modalSubheading}>Choose file type to download</p>
            <div className={styles.modalDownloadButtons}>
              <div
                className={
                  downloadOption === "CSV" ? styles.downloadButtonActive : styles.downloadButtonNonactivep
                }
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  e.stopPropagation();
                  setDownloadOption("CSV");
                }}
              >
                <CsvIcon />
                <div
                  className={
                    downloadOption === "CSV" ? styles.downloadButtonActivep : styles.downloadButtonNonactivep
                  }
                >
                  <p>CSV</p>
                </div>
              </div>
              <div
                className={
                  downloadOption === "PNG" ? styles.downloadButtonActive : styles.downloadButtonNonactivep
                }
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  e.stopPropagation();
                  setDownloadOption("PNG");
                }}
              >
                <PngIcon />
                <div
                  className={
                    downloadOption === "PNG" ? styles.downloadButtonActivep : styles.downloadButtonNonactivep
                  }
                >
                  <p>PNG</p>
                </div>
              </div>
            </div>
            {downloadOption === "CSV" && (
              <div className={styles.downloadCheckboxes}>
                <label>
                  <input
                    type="checkbox"
                    checked={includeOptions.hiddenCharts}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleIncludeOptionsChange("hiddenCharts", e.target.checked);
                    }}
                  />
                  Include the hidden charts in the export
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={includeOptions.selectedTimeFrame}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleIncludeOptionsChange(
                        "selectedTimeFrame",
                        e.target.checked
                      );
                    }}
                  />
                  Include only the selected timeframe
                </label>
              </div>
            )}
            <Button className="w-full p-2.5 rounded-full flex items-center justify-center cursor-pointer bg-[#1a375f] text-white mt-6 hover:opacity-90" handleClick={handleButtonClick}>
              <p className="w-full text-center text-white">Download {downloadOption}</p>
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DownloadDataModal;
