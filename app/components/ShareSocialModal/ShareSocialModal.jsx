'use client';
import React, { useEffect, useState } from 'react';
import { FacebookShareButton, LinkedinShareButton, RedditShareButton, TwitterShareButton, WhatsappShareButton,
  FacebookIcon, RedditIcon, LinkedinIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import PropTypes from 'prop-types';
import "./ShareSocialModal.css";
import Modal from "../../ui/Modal/Modal";
import CloseIcon from "../../assets/icons/CloseIcon";

const title = "Centre for Economic Data & Analysis: India's Economy simplified through charts";

const ShareSocialModal = ({ handleCloseModal, handleDownloadClick }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  return (
    <Modal handleCloseModal={handleCloseModal}>
      <div className="shareSocialModal" style={{ width: 350 }}>
        <div className="modalHeader">
          <h2>Share Chart</h2>
          <CloseIcon onClick={handleCloseModal} />
        </div>
        <div className='ShareSocialIcon'>
          <FacebookShareButton url={url} title={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <RedditShareButton url={url} title={title}>
            <RedditIcon size={32} round />
          </RedditShareButton>
          <LinkedinShareButton url={url} title={title}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      </div>
    </Modal>
  );
};

ShareSocialModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  handleDownloadClick: PropTypes.func // Not required, but defined to avoid TypeScript error
};

export default ShareSocialModal;
