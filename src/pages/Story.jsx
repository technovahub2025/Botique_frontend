import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Story = () => {
  return (
    <div className="bg-ivory min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="font-heading text-3xl text-center mb-8 text-charcoal">Our Story</h1>

        <p className="text-gray-600 text-center leading-relaxed mb-12">
          Loom & Luster was born from a deep appreciation for the timeless craftsmanship
          of Indian handlooms. We bring together traditional artistry and contemporary
          elegance to create pieces that are made to be cherished.
        </p>

        <div className="mb-12">
          <h2 className="font-heading text-xl text-charcoal mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We are committed to preserving traditional weaving techniques while creating
            garments that celebrate both heritage and modern elegance. Every piece in our
            collection reflects the skill, patience, and artistry of Indian craftsmanship.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl text-charcoal mb-3">Our Values</h2>
          <ul className="space-y-2 text-gray-600">
            <li><strong>Craftsmanship:</strong> Every piece is made with meticulous attention to detail.</li>
            <li><strong>Authenticity:</strong> We celebrate genuine Indian handloom traditions and craftsmanship.</li>
            <li><strong>Timelessness:</strong> Our designs combine traditional character with modern elegance.</li>
          </ul>
        </div>

        <div className="text-center mt-16">
          <Link to="/shop">
            <button className="inline-flex items-center gap-2 bg-charcoal text-ivory px-8 py-3 rounded-md font-medium hover:bg-deep-brown transition-colors">
              Explore the Collection
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Story;
