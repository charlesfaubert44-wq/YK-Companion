interface PixelCardProps {
  children: React.ReactNode;
  borderColor?: 'white' | 'green' | 'blue' | 'purple' | 'pink';
  hover?: boolean;
  className?: string;
  icon?: string;
  title?: string;
}

export function PixelCard({ 
  children,
  borderColor = 'white',
  hover = false,
  className = '',
  icon,
  title,
}: PixelCardProps) {
  const borderColors = {
    white: 'border-pixel-white',
    green: 'border-aurora-green',
    blue: 'border-aurora-blue',
    purple: 'border-aurora-purple',
    pink: 'border-aurora-pink',
  };

  const hoverEffect = hover ? 'card-pixel-hover' : '';

  return (
    <div className={`card-pixel ${borderColors[borderColor]} ${hoverEffect} ${className} p-6 md:p-8`}>
      {icon && (
        <div className="text-6xl mb-4 animate-float">{icon}</div>
      )}
      {title && (
        <h3 className="font-pixel text-xl md:text-2xl text-pixel-white mb-4 text-pixel-shadow">
          {title}
        </h3>
      )}
      <div className="font-mono text-base md:text-lg text-gray-300">
        {children}
      </div>
    </div>
  );
}
