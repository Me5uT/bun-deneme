import React from "react";

export const AppStoreBadge: React.FC = () => {
  return (
    <div className="appstore-badge">
      <a href="https://apps.apple.com/tr/app/mirket-mobile/id6467443578">
        <img
          src={"/assets/images/appstore.png"}
          alt="Download on the App Store"
        />
      </a>
    </div>
  );
};
