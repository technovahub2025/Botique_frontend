const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '', ...props }) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-charcoal text-ivory hover:bg-deep-brown focus:ring-charcoal',
    secondary:
      'bg-transparent border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory focus:ring-charcoal',
    gold:
      'bg-gold text-charcoal hover:bg-gold/90 focus:ring-gold',
    outline:
      'border border-gold text-gold hover:bg-gold hover:text-charcoal focus:ring-gold',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-2 text-base',
  };

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
