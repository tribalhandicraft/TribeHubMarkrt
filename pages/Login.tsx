import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { UserCircle, Briefcase, ShieldCheck, UserPlus, Smartphone, KeyRound, ArrowLeft, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { login, t, artisans } = useStore();
  const navigate = useNavigate();

  // State for Producer OTP flow
  const [step, setStep] = useState<'role' | 'mobile' | 'otp'>('role');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'producer') {
      setStep('mobile');
    } else {
      login(role);
      navigate('/');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert(t('invalidMobile'));
      return;
    }

    // Check if the mobile number is registered
    const isRegistered = artisans.some(artisan => artisan.contact === mobile);
    
    if (!isRegistered) {
      alert("Mobile number not registered. Please register first or use a demo number (e.g. 9876543210).");
      return;
    }

    // Simulate sending OTP
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockOtp);
    setStep('otp');
    // In a real app, this would trigger an SMS API
    alert(`${t('otpSentMsg')} ${mobile}: ${mockOtp}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      // Find the specific artisan to log in
      const existingArtisan = artisans.find(a => a.contact === mobile);
      
      if (existingArtisan) {
        // Login with the found user data
        login('producer', existingArtisan);
        navigate('/producer');
      } else {
        alert("User record not found.");
      }
    } else {
      alert(t('invalidOtp'));
    }
  };

  return (
    <div className="min-h-screen bg-tribal-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-tribal-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Decorative Side */}
        <div className="md:w-2/5 bg-tribal-600 p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/woven.png')]"></div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">{t('welcomeBack')}</h2>
          <p className="opacity-90 relative z-10">{t('signInSub')}</p>
        </div>

        {/* Content Side */}
        <div className="md:w-3/5 p-8 md:p-12">
          
          {step === 'role' && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-8">{t('chooseRole')}</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleRoleSelect('customer')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <UserCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('customerRole')}</h4>
                    <p className="text-sm text-gray-500">{t('customerDesc')}</p>
                  </div>
                </button>

                <div className="relative">
                    <button 
                    onClick={() => handleRoleSelect('producer')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
                    >
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">{t('producerRole')}</h4>
                        <p className="text-sm text-gray-500">{t('producerDesc')}</p>
                    </div>
                    </button>
                    <Link to="/register-producer" className="absolute -bottom-6 right-2 text-xs font-semibold text-tribal-600 hover:text-tribal-800 flex items-center gap-1">
                        {t('registerLink')} <UserPlus size={12}/>
                    </Link>
                </div>
                
                <div className="pt-4"></div>

                <button 
                  onClick={() => handleRoleSelect('admin')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('adminRole')}</h4>
                    <p className="text-sm text-gray-500">{t('adminDesc')}</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {step === 'mobile' && (
            <div className="animate-fade-in">
               <button 
                 onClick={() => setStep('role')} 
                 className="flex items-center gap-1 text-sm text-gray-500 hover:text-tribal-600 mb-6"
               >
                 <ArrowLeft size={16} /> {t('backToRoles')}
               </button>
               
               <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('producerRole')}</h3>
               <p className="text-gray-500 mb-6">Enter your registered mobile number.</p>

               <form onSubmit={handleSendOtp} className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('mobileNum')}</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="tel" 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none text-lg tracking-wide"
                        placeholder="e.g. 9876543210"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Try demo numbers: 9876543210, 9876543211</p>
                 </div>
                 <button 
                   type="submit"
                   className="w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700 transition-colors shadow-lg shadow-tribal-500/30 flex items-center justify-center gap-2"
                 >
                   {t('sendOtp')} <ArrowRight size={20} />
                 </button>
               </form>
            </div>
          )}

          {step === 'otp' && (
             <div className="animate-fade-in">
               <button 
                 onClick={() => setStep('mobile')} 
                 className="flex items-center gap-1 text-sm text-gray-500 hover:text-tribal-600 mb-6"
               >
                 <ArrowLeft size={16} /> Change Mobile Number
               </button>
               
               <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('enterOtp')}</h3>
               <p className="text-gray-500 mb-6">{t('otpSentMsg')} <span className="font-bold text-gray-800">+91 {mobile}</span></p>

               <form onSubmit={handleVerifyOtp} className="space-y-6">
                 <div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none text-lg tracking-widest"
                        placeholder="XXXX"
                        autoFocus
                      />
                    </div>
                 </div>
                 <button 
                   type="submit"
                   className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                 >
                   {t('verifyLogin')} <ArrowRight size={20} />
                 </button>
                 
                 <div className="text-center">
                   <button 
                     type="button" 
                     onClick={handleSendOtp}
                     className="text-sm text-tribal-600 font-medium hover:underline"
                   >
                     Resend OTP
                   </button>
                 </div>
               </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;