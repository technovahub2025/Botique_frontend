import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ items, allowMultiple = false, defaultOpen = [] }) => {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = (index) => {
    if (allowMultiple) {
      setOpen((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpen((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="border-t border-gray-200">
      {items.map((item, index) => {
        const isOpen = open.includes(index);
        return (
          <div key={index}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <h3 className="font-heading text-lg text-charcoal">
                {item.title}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-charcoal transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="pb-4 text-gray-600 leading-relaxed">
                {typeof item.content === 'string'
                  ? <p>{item.content}</p>
                  : item.content}
              </div>
            )}
            <div className="border-b border-gray-100" />
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
