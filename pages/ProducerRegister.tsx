import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Upload, User, MapPin, Phone, Palette, ArrowRight, Check } from 'lucide-react';
import { CATEGORIES } from '../constants';

const ProducerRegister: React.FC = () => {
  const { login, t, language } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    artType: '',
    photo: '',
  });

  // Multi-select state
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [otherType, setOtherType] = useState('');

  // Localized extra options
  const extraOptions: Record<string, { en: string; hi: string; mr: string }> = {
    pottery: { en: "Pottery", hi: "मिट्टी के बर्तन", mr: "कुंभारकाम" },
    weaving: { en: "Weaving", hi: "बुनाई", mr: "विणकाम" },
    jewelry: { en: "Jewelry", hi: "आभूषण", mr: "दागिने" },
    woodCarving: { en: "Wood Carving", hi: "नक्काशी", mr: "काष्ठकला" },
    metalWork: { en: "Metal Work", hi: "धातु शिल्प", mr: "धातूकाम" },
    terracotta: { en: "Terracotta", hi: "टेराकोटा", mr: "टेराकोटा" }
  };

  // Combined options from categories + local extras, translated to current language
  const ART_OPTIONS = useMemo(() => [
    ...CATEGORIES.map(c => c.label[language]),
    ...Object.values(extraOptions).map(opt => opt[language])
  ], [language]);

  // Sync selected types + other type to formData.artType
  useEffect(() => {
    const allTypes = [...selectedTypes];
    if (otherType.trim()) {
      allTypes.push(otherType.trim());
    }
    setFormData(prev => ({ ...prev, artType: allTypes.join(', ') }));
  }, [selectedTypes, otherType]);

  const toggleArtType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, photo: url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.contact || !formData.artType) {
      alert("Please fill in all required fields");
      return;
    }

    // Register user and log them in
    login('producer', {
      name: formData.name,
      location: formData.address,
      contact: formData.contact,
      artType: formData.artType,
      avatar: formData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop', // Default avatar
      shopName: `${formData.name}'s ${formData.artType.split(',')[0]} Studio` // Use first art type for shop name
    });

    navigate('/producer');
  };

  return (
    <div className="min-h-screen bg-tribal-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-tribal-100 overflow-hidden">
        <div className="bg-tribal-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]"></div>
          <h2 className="text-3xl font-bold relative z-10">{t('artisanRegTitle')}</h2>
          <p className="text-tribal-100 relative z-10 mt-2">{t('artisanRegSub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
            </div>

            {/* Address */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('addressLabel')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                  rows={3}
                  placeholder="Village, District, State"
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactLabel')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Art Type (Multi-Select) */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('artTypeLabel')} (Select Multiple)</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {ART_OPTIONS.map((type) => {
                  const isSelected = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleArtType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-tribal-600 text-white border-tribal-600 shadow-sm' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-tribal-300 hover:bg-tribal-50'
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                      {type}
                    </button>
                  );
                })}
              </div>

              {/* Custom Art Type Input */}
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={otherType}
                  onChange={e => setOtherType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none text-sm"
                  placeholder="Other (specify here...)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {formData.artType || 'None'}
              </p>
            </div>

            {/* Photo Upload */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('photoLabel')}</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
                <div className="space-y-1 text-center">
                  {formData.photo ? (
                    <div className="relative">
                      <img src={formData.photo} alt="Preview" className="h-32 w-32 mx-auto object-cover rounded-full border-4 border-white shadow-md" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, photo: ''})}
                        className="absolute top-0 right-1/3 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="photo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-tribal-600 hover:text-tribal-500 focus-within:outline-none">
                          <span>{t('uploadPhoto')}</span>
                          <input id="photo-upload" name="photo-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700 transition-colors shadow-lg shadow-tribal-500/30 flex items-center justify-center gap-2"
            >
              {t('registerLogin')} <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProducerRegister;