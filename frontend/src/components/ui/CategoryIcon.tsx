import React from "react";
import { getCategoryIcon } from "./categoryIcons";

interface CategoryIconProps {
  icon?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  className = "w-5 h-5",
}) => {
  const Icon = getCategoryIcon(icon);
  return <Icon className={className} />;
};
