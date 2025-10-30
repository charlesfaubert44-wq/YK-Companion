interface PixelButtonProps {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  className = '',
}: PixelButtonProps) {
  const baseStyles =
    'font-pixel uppercase inline-block text-center transition-all duration-75 border-4';

  const variantStyles = {
    primary:
      'bg-aurora-green text-dark-900 border-pixel-white shadow-pixel-green hover:shadow-pixel-hover',
    secondary:
      'bg-aurora-blue text-pixel-white border-pixel-white shadow-pixel-blue hover:shadow-pixel-hover',
    accent:
      'bg-aurora-purple text-pixel-white border-pixel-white shadow-pixel-purple hover:shadow-pixel-hover',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm',
  };

  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
    hover:translate-x-[2px] hover:translate-y-[2px]
    active:translate-x-[4px] active:translate-y-[4px]
    active:shadow-none
  `;

  if (href) {
    return (
      <a href={href} className={combinedStyles}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedStyles}>
      {children}
    </button>
  );
}
