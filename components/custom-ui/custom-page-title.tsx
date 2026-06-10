import React from 'react';

type CustomPageTitleProps = {
  title: React.ReactNode;
};

const CustomPageTitle: React.FC<CustomPageTitleProps> = ({ title }) => {
  return <h1 className="text-2xl font-bold mb-4">{title}</h1>;
};

export default CustomPageTitle;
