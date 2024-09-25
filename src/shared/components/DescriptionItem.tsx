import React from 'react';
interface DescriptionItemProps {
  title?: string;
  content: React.ReactNode;
}
export const DescriptionItem: React.FC<DescriptionItemProps> = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    {title && <p className="site-description-item-profile-p-label">{title}:</p>}
    {content}
  </div>
);
