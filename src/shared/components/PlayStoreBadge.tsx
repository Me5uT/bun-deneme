import React from "react";

export const PlayStoreBadge: React.FC = () => {
  return (
    <div className="playstore-badge">
      <a href="https://play.google.com/store/apps/details?id=com.mirket.mobile.mfa&pcampaignid=web_share">
        <img src={"src/assets/images/googleplay.png"} alt={"googleplay.png"} />
      </a>
    </div>
  );
};
