import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ level = 2, className = '', children, ...props }) => {
  const Component = `h${level}` as any;
  
  const baseClasses = 'font-bold tracking-tight text-slate-900 dark:text-white';
  
  const sizeClasses = {
    1: 'text-4xl sm:text-5xl lg:text-6xl',
    2: 'text-3xl sm:text-4xl',
    3: 'text-2xl sm:text-3xl',
    4: 'text-xl sm:text-2xl',
    5: 'text-lg sm:text-xl',
    6: 'text-base sm:text-lg',
  };

  return (
    <Component className={`${baseClasses} ${sizeClasses[level]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
