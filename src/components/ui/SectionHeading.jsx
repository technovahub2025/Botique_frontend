const SectionHeading = ({ title, subtitle, align = 'center', goldAccent = true }) => {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`mb-4 ${alignment}`}>
      {subtitle && (
        <p className="text-sm font-medium text-burgundy uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      <h2 className={`font-heading text-3xl md:text-4xl text-charcoal ${alignment}`}>
        {title}
      </h2>
      {goldAccent && align === 'center' && (
        <div className="gold-underline mx-auto mt-4"></div>
      )}
    </div>
  );
};

export default SectionHeading;
