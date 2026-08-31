import { useState, useEffect } from 'react';
import { Save, Image, FileText, LayoutGrid, Tag, Mail, Plus, Trash2, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUrl';

const SECTIONS = [
  {
    id: 'hero',
    name: 'Hero Banner',
    icon: Image,
    fields: [
      { key: 'heading', label: 'Global Hero Heading (fallback)', type: 'text', placeholder: 'Welcome to Loom & Luster' },
      { key: 'description', label: 'Global Hero Description (fallback)', type: 'textarea', placeholder: 'Discover premium handcrafted clothing' },
      { key: 'ctaText', label: 'Global CTA Button Text (fallback)', type: 'text', placeholder: 'Shop Now' },
      { key: 'ctaLink', label: 'Global CTA Button Link (fallback)', type: 'text', placeholder: '/shop' },
    ],
    customRender: 'hero-slides',
  },
  {
    id: 'featured_collection',
    name: 'Featured Collection',
    icon: LayoutGrid,
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Featured Collection' },
      { key: 'collectionId', label: 'Collection ID', type: 'text', placeholder: 'Select collection' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Curated selection' },
    ],
  },
  {
    id: 'new_arrivals',
    name: 'New Arrivals',
    icon: Tag,
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'New Arrivals' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Just in' },
      { key: 'limit', label: 'Number of Products', type: 'number', placeholder: '8' },
    ],
  },
  {
    id: 'shop_the_look',
    name: 'Shop The Look',
    icon: Image,
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Shop The Look' },
      { key: 'images', label: 'Look Images (comma separated URLs)', type: 'text', placeholder: 'https://... , https://...' },
      { key: 'description', label: 'Description', type: 'text', placeholder: 'Style inspiration' },
    ],
  },
  {
    id: 'editorial',
    name: 'Editorial Section',
    icon: FileText,
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'The Art of Handweaving' },
      { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Editorial content...' },
      { key: 'imageUrl', label: 'Image URL', type: 'text', placeholder: 'https://...' },
      { key: 'linkUrl', label: 'Link URL', type: 'text', placeholder: '/story' },
    ],
  },
  {
    id: 'trending',
    name: 'Trending Products',
    icon: LayoutGrid,
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Trending Now' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Most popular pieces' },
      { key: 'limit', label: 'Number of Products', type: 'number', placeholder: '8' },
    ],
  },
  {
    id: 'craftsmanship',
    name: 'Craftsmanship',
    icon: Image,
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Our Craftsmanship' },
      { key: 'description', label: 'Description', type: 'text', placeholder: 'Handcrafted with care' },
      { key: 'imageUrl', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    ],
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    icon: Mail,
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Join Our Newsletter' },
      { key: 'description', label: 'Description', type: 'text', placeholder: 'Subscribe for updates' },
      { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Subscribe' },
    ],
  },
];

const HeroSlidesEditor = ({ data, onChange, globalDefaults }) => {
  const [expandedSlides, setExpandedSlides] = useState({});
  const [uploadingIdx, setUploadingIdx] = useState(null);

  const slides = Array.isArray(data.heroImages) ? data.heroImages : [];

  const updateSlide = (slideIndex, field, value) => {
    onChange('heroImages', (prev) => {
      const current = Array.isArray(prev) ? prev : [];
      const newSlides = [...current];
      if (!newSlides[slideIndex] || typeof newSlides[slideIndex] !== 'object') {
        newSlides[slideIndex] = {};
      }
      newSlides[slideIndex] = { ...newSlides[slideIndex], [field]: value };
      return newSlides;
    });
  };

  const uploadImage = async (slideIndex, file) => {
    setUploadingIdx(slideIndex);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await adminApi.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url || '';
      updateSlide(slideIndex, 'imageUrl', url);
    } catch (e) {
      console.error('Upload failed:', e);
    } finally {
      setUploadingIdx(null);
    }
  };

  const toggleExpand = (idx) => {
    setExpandedSlides((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addSlide = () => {
    onChange('heroImages', (prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          imageUrl: '',
          smallLabel: '',
          heading: data.heading || globalDefaults.heading || '',
          description: data.description || globalDefaults.description || '',
          buttonText: data.ctaText || globalDefaults.ctaText || '',
          buttonLink: data.ctaLink || globalDefaults.ctaLink || '/shop',
          isActive: true,
          enabled: true,
          order: current.length + 1,
        },
      ];
    });
    setExpandedSlides((prev) => ({ ...prev, [slides.length]: true }));
  };

  const removeSlide = (idx) => {
    onChange('heroImages', (prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return current
        .map((s, i) => (i === idx ? null : s))
        .filter(Boolean)
        .map((s, i) => ({ ...s, order: i + 1 }));
    });
    setExpandedSlides((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  const moveSlide = (from, to) => {
    onChange('heroImages', (prev) => {
      const current = Array.isArray(prev) ? prev : [];
      if (to < 0 || to >= current.length) return prev;
      const newSlides = [...current];
      const [removed] = newSlides.splice(from, 1);
      newSlides.splice(to, 0, removed);
      newSlides.forEach((s, i) => {
        s.order = i + 1;
      });
      return newSlides;
    });
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Hero Slides
      </label>
      <div className="space-y-4">
        {slides.map((slide, idx) => {
          const isObj = slide && typeof slide === 'object';
          const imageUrl = isObj ? (slide.imageUrl || slide.image || '') : slide;
          const smallLabel = isObj ? (slide.smallLabel || '') : '';
          const heading = isObj ? (slide.heading || '') : '';
          const description = isObj ? (slide.description || '') : '';
          const buttonText = isObj ? (slide.buttonText || '') : '';
          const buttonLink = isObj ? (slide.buttonLink || '') : '';
          const isActive = isObj ? (slide.isActive !== undefined ? slide.isActive : slide.enabled !== false) : true;
          const enabled = isActive;
          const order = isObj ? (slide.order || idx + 1) : idx + 1;
          const isOpen = expandedSlides[idx] || false;

          return (
            <div
              key={slide.id || idx}
              className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                enabled ? 'border-gold/30' : 'opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-700">Slide {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => toggleExpand(idx)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveSlide(idx, idx - 1)}
                    disabled={idx === 0}
                    className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(idx, idx + 1)}
                    disabled={idx === slides.length - 1}
                    className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                    aria-label="Remove slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => updateSlide(idx, 'imageUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingIdx === idx}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) await uploadImage(idx, file);
                        e.target.value = '';
                      }}
                      className="w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-gray-300 file:bg-white file:text-charcoal file:hover:bg-gray-50"
                    />
                    {uploadingIdx === idx && <span className="text-xs text-gray-500">Uploading…</span>}
                    <p className="text-xs text-gray-400 mt-1">
                      Upload an image file to set it as this slide. The uploaded image keeps its original aspect
                      ratio on the homepage.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Small Label / Eyebrow
                    </label>
                    <input
                      type="text"
                      value={smallLabel}
                      onChange={(e) => updateSlide(idx, 'smallLabel', e.target.value)}
                      placeholder="HANDCRAFTED HERITAGE"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={heading}
                      onChange={(e) => updateSlide(idx, 'heading', e.target.value)}
                      placeholder="Slide heading"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => updateSlide(idx, 'description', e.target.value)}
                      placeholder="Slide description"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                    />
                  </div>

                   <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        CTA Text
                      </label>
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => updateSlide(idx, 'buttonText', e.target.value)}
                        placeholder="Shop Now"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        CTA Link
                      </label>
                      <input
                        type="text"
                        value={buttonLink}
                        onChange={(e) => updateSlide(idx, 'buttonLink', e.target.value)}
                        placeholder="/shop"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={order}
                        onChange={(e) => updateSlide(idx, 'order', Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => {
                            updateSlide(idx, 'isActive', e.target.checked);
                            updateSlide(idx, 'enabled', e.target.checked);
                          }}
                          className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded"
                        />
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {imageUrl && (isOpen || enabled) && (
                <div className="mt-3">
                  <img
                    src={getImageUrl(imageUrl)}
                    alt={`Slide ${idx + 1} preview`}
                     className="w-full h-32 object-contain object-center border border-gray-200 rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={addSlide}
          className="text-sm text-gold hover:text-burgundy font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          + Add Hero Slide
        </button>
      </div>
    </div>
  );
};

const Homepage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await adminApi.get('/homepage');
        if (res.data.success && res.data.sections) {
          setSections(res.data.sections);
        }
      } catch (err) {
        console.error('Failed to fetch homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  const getSectionData = (id) => {
    const section = sections.find((s) => s.key === id);
    return section?.data || {};
  };

  const isSectionEnabled = (id) => {
    const section = sections.find((s) => s.key === id);
    return section ? section.enabled : true;
  };

  const updateField = (sectionId, fieldKey, value) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key === sectionId) {
          const currentData = s.data || {};
          const nextValue = typeof value === 'function' ? value(currentData[fieldKey]) : value;
          return { ...s, data: { ...currentData, [fieldKey]: nextValue } };
        }
        return s;
      })
    );
  };

  const toggleSection = (sectionId) => {
    setSections((prev) =>
      prev.map((s) =>
        s.key === sectionId ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const ensureAllSections = () => {
    const existingIds = sections.map((s) => s.key);
    const missing = SECTIONS.filter((s) => !existingIds.includes(s.id));
    if (missing.length > 0) {
      const newSections = [
        ...sections,
        ...missing.map((s) => ({
          key: s.id,
          enabled: true,
          data: {},
        })),
      ];
      setSections(newSections);
      return newSections;
    }
    return sections;
  };

  const handleSave = async () => {
    const allSections = ensureAllSections();
    const heroSection = allSections.find((s) => s.key === 'hero');
    console.log(
      '[Admin] before save heroImages:',
      heroSection?.data?.heroImages?.map((s) => s.imageUrl)
    );
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await adminApi.put('/homepage', { sections: allSections });
      if (res.data.success) {
        setSections(res.data.sections);
        setSuccess('Homepage updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading homepage config...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Homepage Content Management</h1>
        <div className="flex gap-3">
          {error && <span className="text-sm text-red-600">{error}</span>}
          {success && <span className="text-sm text-green-600">{success}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-charcoal text-ivory px-4 py-2 rounded-md font-medium hover:bg-deep-brown flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const enabled = isSectionEnabled(section.id);
          const data = getSectionData(section.id);

          return (
            <div
              key={section.id}
              className={`bg-white rounded-lg border border-gray-200 p-6 ${
                !enabled ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-charcoal" />
                  <h2 className="text-lg font-semibold">{section.name}</h2>
                </div>
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.customRender === 'hero-slides' ? (
                  <HeroSlidesEditor
                    data={data}
                    onChange={(field, value) => updateField(section.id, field, value)}
                    globalDefaults={{
                      heading: data.heading || 'Welcome to Loom & Luster',
                      description: data.description || '',
                      ctaText: data.ctaText || 'Shop Now',
                      ctaLink: data.ctaLink || '/shop',
                    }}
                  />
                ) : null}

                {section.fields.map((field) => {
                  if (section.customRender === 'hero-slides' && ['heroImages'].includes(field.key)) {
                    return null;
                  }

                  const rawValue = data[field.key];

                  if (field.type === 'array') {
                    const arrValue = Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : [];

                    return (
                      <div key={field.key} className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <div className="space-y-2">
                          {arrValue.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item || ''}
                                onChange={(e) => {
                                  const newArr = [...arrValue];
                                  newArr[idx] = e.target.value;
                                  updateField(section.id, field.key, newArr);
                                }}
                                placeholder={field.placeholder}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  updateField(
                                    section.id,
                                    field.key,
                                    arrValue.filter((_, i) => i !== idx)
                                  );
                                }}
                                className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => updateField(section.id, field.key, [...arrValue, ''])}
                            className="text-sm text-gold hover:text-burgundy"
                          >
                            + Add Another Image
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const value = rawValue ?? '';
                  const commonProps = {
                    value: field.type === 'number' ? (value || '') : value,
                    onChange: (e) =>
                      updateField(
                        section.id,
                        field.key,
                        field.type === 'number'
                          ? Number(e.target.value)
                          : e.target.value
                      ),
                    className:
                      'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-sm',
                  };

                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          {...commonProps}
                          rows={3}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          {...commonProps}
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Homepage;
