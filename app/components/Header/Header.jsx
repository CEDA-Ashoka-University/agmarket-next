import CedaHeaderIcon from '../../assets/icons/CedaHeaderIcon';
import CloseIcon from "../../assets/icons/CloseIcon";
import EcometerIcon from "../../assets/icons/EcometerIcon";
import styles from "./Header.module.css";

export default function Header({ title = null, description = null }) {
  const titleString = (title ? title + " | " : "") + "CEDA EcoMeter";
  const descString = description ? description : "Handpicked indicators for the Indian Economy, explore our wide range.";

  return (
    <div className={styles.headerContainer}>
      <meta name="google-site-verification" content="-A-s2rbOu735U-yyBf6HKSHZQson1kOPAmhuM8vFzcY" />
      <a href="#">
        <CedaHeaderIcon width={250} height={85} className={styles.CedaHeaderIcon} />
      </a>
      <div className={styles.ecometerHeadingContainer}>
        <EcometerIcon />
        <div className={styles.ecometerHeadingh1}>
          <h1>Agri-Market Data</h1>
          <p className={styles.ecometerHeadingp}>India’s agriculturual market unveiled through data</p>
        </div>
      </div>
      <a href={process.env.VITE_ECOMETER_CLOSE_LINK}>
        <CloseIcon className={styles.CloseIcon} />
      </a>
    </div>
  );
}
