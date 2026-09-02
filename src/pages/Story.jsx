import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';

const Story = () => {
  return (
    <div className="bg-ivory">
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1587614296097-6f7c9a081b32?auto=format&fit=crop&w=1920&q=80")',
          }}
        ></div>
        <div className="relative container mx-auto px-4 lg:px-8 text-center text-ivory py-24">
          <p className="text-sm font-medium tracking-wid uppercase mb-4">Our Story</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The Art of Handweaving
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            At Loom & Luster, every thread tells a story. We honor centuries-old
            Indian handloom traditions while crafting garments for the modern connoisseur.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                title="Our Story"
                subtitle="The Beginning"
                align="left"
                goldAccent={false}
              />
              <div className="space-y-4 mt-6 text-gray-600 leading-relaxed">
                <p>
                  Loom & Luster was born from a deep appreciation for the timeless
                  craftsmanship of Indian handlooms. Founded by artisans and designers
                  who spent years traveling across India, we discovered master
                  craftspersons whose families had been weaving for generations.
                </p>
                <p>
                  We collaborate directly with these artisans to bring you ethically-made,
                  sustainably-sourced luxury fashion. Each piece is a celebration of
                  traditional techniques — jamdani, banarasi, kalamkari, and bandhani —
                  reimagined for contemporary elegance.
                </p>
                <p>
                  Every garment in our collection is a testament to the dedication,
                  patience, and skill of the craftspeople who bring it to life. We
                  believe that true luxury lies not in haste, but in the careful
                  attention to detail that only handcrafted pieces can offer.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <img
                  src="https://images.unsplash.com/photo-1587614296097-6f7c9a081b32?auto=format&fit=crop&w=800&q=80"
                  alt="Artisan weaving on traditional loom"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.src = 'https://placehold.co/800x1000/f8f4ec/999?text=Our+Story';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <SectionHeading
                title="The Art of Handweaving"
                subtitle="Ancient Craft, Modern Relevance"
                align="left"
                goldAccent={false}
              />
              <div className="space-y-4 mt-6 text-gray-600 leading-relaxed">
                <p>
                  Handweaving is among humanity's oldest crafts, with techniques passed
                  down through oral tradition and hands-on apprenticeship. In India alone,
                  over 2.5 million weavers continue this ancestral practice using
                  traditional pit looms, frame looms, and hand-operated jennies.
                </p>
                <p>
                  Each weave tells a story of region and heritage — the intricate
                  jamdani of Banaras, the resist-dyed bandhani of Gujarat, the
                  hand-block-printed kalamkari of Andhra Pradesh. These textiles carry
                  cultural signatures unique to their places of origin.
                </p>
                <p>
                  The process is deliberate and unhurried. A single saree can take
                  anywhere from 3 days to several months to complete, depending on the
                  complexity of the design. This slow craftsmanship is what makes each
                  piece truly special and irreplaceable.
                </p>
              </div>
            </div>
            <div className="lg:order-1 relative">
              <div className="aspect-square overflow-hidden bg-ivory">
                <img
                  src="https://placehold.co/800x800/f8f4ec/999?text=Handweaving+Craft"
                  alt="Close-up of handwoven textile"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeading
              title="Crafted With Purpose"
              subtitle="Our Philosophy"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-heading font-bold text-burgundy">1</span>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Quality Materials</h3>
              <p className="text-sm text-gray-600">
                We source only the finest natural fibers — silk, cotton, linen —
                directly from sustainable suppliers across India.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-heading font-bold text-burgundy">2</span>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Master Artisans</h3>
              <p className="text-sm text-gray-600">
                We partner with artisans who have spent decades mastering their craft,
                ensuring every piece meets the highest standards of quality.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-heading font-bold text-burgundy">3</span>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Timeless Design</h3>
              <p className="text-sm text-gray-600">
                We create garments that transcend seasonal trends, designed to be
                cherished for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl mx-auto text-center">
          <SectionHeading
            title="Our Philosophy"
            subtitle="Tradition Meets Modernity"
          />
          <div className="mt-8 text-gray-600 leading-relaxed space-y-4">
            <p className="text-lg">
              Loom & Luster believes that the future of luxury fashion lies in the
              respectful revival of traditional crafts. We bridge the gap between
              centuries-old handweaving techniques and contemporary design sensibilities.
            </p>
            <p className="text-lg">
              Every piece in our collection is crafted with intention — honoring the
              artisan's skill while serving the modern wearer's desire for authenticity,
              quality, and timeless beauty. We are not just a clothing brand; we are
              custodians of cultural heritage, weaving stories that connect the past
              to the future.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-charcoal text-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl text-ivory mb-4">
            Experience the Craftsmanship
          </h2>
          <p className="text-gray-300 mb-8">
            Discover our curated collection of handwoven sarees, each piece a
            testament to traditional Indian craftsmanship.
          </p>
          <Link to="/shop">
            <button className="bg-gold text-charcoal font-medium px-8 py-4 rounded-md hover:bg-gold/90 transition-all flex items-center gap-2 mx-auto">
              Explore the Collection
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Story;
