import type { ReactNode } from "react";


interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-dark-bg-card p-6 rounded-lg shadow-xl text-text-light ${className}`}>
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-3 mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default Card;