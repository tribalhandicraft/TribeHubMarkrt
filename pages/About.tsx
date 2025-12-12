import React from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const About: React.FC = () => {
  const { t, user } = useStore();

  const team = [
    {
      name: "Sarah Jenkins",
      roleKey: "roleOperations",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      email: "sarah.j@tribalheritage.com",
      phone: "+91 98765 00001",
      address: "Mumbai, Maharashtra",
      bio: "Expert in supply chain management with 10 years working with rural artisans."
    },
    {
      name: "Amit Patel",
      roleKey: "roleTech",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      email: "amit.p@tribalheritage.com",
      phone: "+91 98765 00002",
      address: "Bangalore, Karnataka",
      bio: "Tech enthusiast passionate about bringing digital equity to remote areas."
    },
    {
      name: "Priya Singh",
      roleKey: "roleCommunity",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      email: "priya.s@tribalheritage.com",
      phone: "+91 98765 00003",
      address: "New Delhi, Delhi",
      bio: "Social worker dedicated to tribal welfare and cultural preservation."
    },
    {
       name: "Rahul Verma",
       roleKey: "roleMarketing",
       image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
       email: "rahul.v@tribalheritage.com",
       phone: "+91 98765 00004",
       address: "Pune, Maharashtra",
       bio: "Digital marketing specialist focusing on ethical brands."
    }
  ];

  // Logic to hide contact details for Producer and Customer roles
  const hideContactDetails = user?.role === 'producer' || user?.role === 'customer';

  return (
    <div className="min-h-screen bg-tribal-50">
      {/* Header */}
      <div className="bg-tribal-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]"></div>
        <h1 className="text-4xl md:text-5xl font-bold relative z-10 font-serif mb-4">{t('aboutUs')}</h1>
        <p className="text-tribal-100 max-w-2xl mx-auto relative z-10 text-lg">
          {t('aboutHeaderSub')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Owner Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-2xl shadow-sm border border-tribal-100 p-8 md:p-12">
           <div className="w-full md:w-1/3 flex flex-col items-center text-center">
              <div className="w-48 h-48 rounded-full border-4 border-tribal-200 overflow-hidden mb-6 relative">
                 <img 
                   src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" 
                   alt="Founder" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Rajiv Menon</h2>
              <p className="text-tribal-600 font-medium">{t('founderRole')}</p>
           </div>
           <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold text-tribal-800 mb-6 font-serif">{t('founderMessage')}</h3>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>"{t('founderBio1')}"</p>
                <p>"{t('founderBio2')}"</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4">
                 <div className="text-tribal-500 font-script text-3xl opacity-80" style={{ fontFamily: 'cursive' }}>Rajiv Menon</div>
              </div>
           </div>
        </div>

        {/* Team Section */}
        <div>
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('ourTeam')}</h2>
             <div className="w-16 h-1 bg-tribal-500 mx-auto rounded-full"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-tribal-50 group flex flex-col">
                   <div className="h-64 overflow-hidden relative">
                     <div className="absolute inset-0 bg-tribal-900/0 group-hover:bg-tribal-900/20 transition-colors z-10"></div>
                     <img src={member.image} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                   </div>
                   <div className="p-6 flex flex-col flex-1">
                     <div className="mb-4 text-center">
                        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                        <p className="text-tribal-600 font-medium text-sm">{t(member.roleKey)}</p>
                     </div>
                     
                     <p className="text-gray-600 text-sm mb-6 italic text-center leading-relaxed">"{member.bio}"</p>

                     {!hideContactDetails && (
                        <div className="mt-auto space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-600 animate-fade-in">
                            <div className="flex items-center gap-2.5">
                              <Mail size={15} className="text-tribal-500 shrink-0"/> 
                              <span className="truncate" title={member.email}>{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Phone size={15} className="text-tribal-500 shrink-0"/> 
                              <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <MapPin size={15} className="text-tribal-500 shrink-0"/> 
                              <span className="truncate" title={member.address}>{member.address}</span>
                            </div>
                        </div>
                     )}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Contact & Socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-tribal-100">
               <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('contactUs')}</h3>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="bg-tribal-100 p-3 rounded-lg text-tribal-600">
                        <Mail size={24} />
                     </div>
                     <div>
                        <p className="font-semibold text-gray-800">{t('emailLabel')}</p>
                        <a href="mailto:hello@tribalheritage.com" className="text-gray-600 hover:text-tribal-600">hello@tribalheritage.com</a>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="bg-tribal-100 p-3 rounded-lg text-tribal-600">
                        <Phone size={24} />
                     </div>
                     <div>
                        <p className="font-semibold text-gray-800">{t('callLabel')}</p>
                        <p className="text-gray-600">+91 98765 43210</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="bg-tribal-100 p-3 rounded-lg text-tribal-600">
                        <MapPin size={24} />
                     </div>
                     <div>
                        <p className="font-semibold text-gray-800">{t('visitLabel')}</p>
                        <p className="text-gray-600">123 Heritage Lane, Arts District,<br/>New Delhi, India 110001</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Social Media */}
            <div className="bg-tribal-600 rounded-xl p-8 shadow-sm text-white flex flex-col justify-center text-center">
               <h3 className="text-2xl font-bold mb-6">{t('followUs')}</h3>
               <p className="text-tribal-100 mb-8">{t('socialText')}</p>
               
               <div className="flex justify-center gap-4">
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors backdrop-blur-sm">
                    <Facebook size={28} />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors backdrop-blur-sm">
                    <Instagram size={28} />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors backdrop-blur-sm">
                    <Twitter size={28} />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors backdrop-blur-sm">
                    <Linkedin size={28} />
                  </a>
               </div>
               
               <div className="mt-10 pt-8 border-t border-white/20">
                  <p className="text-sm text-tribal-200">{t('copyright')}</p>
               </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;