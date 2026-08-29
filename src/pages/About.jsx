const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-heading font-bold mb-6 text-center">Our Story</h1>

      <div className="max-w-3xl mx-auto prose prose-lg">
        <p className="text-center text-gray-600 leading-relaxed">
          Loom & Luster was born from a deep appreciation for the timeless craftsmanship
          of Indian handlooms. We collaborate directly with master artisans across India
          to bring you ethically-made, sustainably-sourced luxury fashion.
        </p>

        <h2 className="font-heading font-semibold mt-8">Our Mission</h2>
        <p>
          We are committed to preserving traditional weaving techniques while creating
          garments that celebrate both heritage and modern elegance. Every piece in our
          collection tells a story of skill, patience, and artistry passed down through
          generations of craftspeople.
        </p>

        <h2 className="font-heading font-semibold mt-8">Our Values</h2>
        <ul>
          <li><strong>Craftsmanship:</strong> Every piece is made with meticulous attention to detail.</li>
          <li><strong>Ethics:</strong> We ensure fair wages and safe working conditions for all artisans.</li>
          <li><strong>Sustainability:</strong> We use natural fibers and eco-friendly processes wherever possible.</li>
          <li><strong>Authenticity:</strong> We work directly with artisan cooperatives to bring you genuine handloom pieces.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
