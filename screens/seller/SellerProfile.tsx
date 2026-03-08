import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, MapPin, Clock, CreditCard, Image as ImageIcon, Settings, LogOut, Save, ChevronRight, Repeat } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { kitchenAPI, KitchenApi, resolveMediaUrl } from '../../services/api';

const SellerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { logout, setUserRole } = useApp();
  const [kitchen, setKitchen] = useState<KitchenApi | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [galleryNotes, setGalleryNotes] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadKitchen = async () => {
      try {
        const data = await kitchenAPI.getMine();
        if (!isMounted) return;
        setKitchen(data);
        setName(data.name || '');
        setLocation(data.location || '');
        setDescription(data.description || '');
        setOperatingHours(data.operating_hours || '');
        setBankDetails(data.bank_details || '');
        setGalleryNotes(data.gallery_notes || '');
        setNotificationEnabled(Boolean(data.notification_enabled));
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      }
    };
    loadKitchen();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Cover Header */}
      <div className="relative h-48 overflow-hidden bg-zinc-900">
        <img src={coverPreview || resolveMediaUrl(kitchen?.cover_image) || 'https://picsum.photos/seed/seller-cover/800/400'} alt="" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white">
          <ChevronLeft size={24} />
        </button>
        <label className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-black uppercase cursor-pointer">
          <Camera size={16} />
          <span>Edit Cover</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setCoverFile(file);
              setCoverPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      <div className="px-5 -mt-10 relative z-10 space-y-8">
        {/* Profile Info Card */}
        <div className="bg-[#181818] border border-zinc-800 rounded-[40px] p-6 shadow-2xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-[30px] border-4 border-[#181818] overflow-hidden shadow-xl">
                <img src={logoPreview || resolveMediaUrl(kitchen?.logo) || 'https://picsum.photos/seed/seller-logo/200'} alt="" className="w-full h-full object-cover" />
              </div>
              <label className="absolute -bottom-1 -right-1 p-2 bg-orange-600 text-white rounded-xl shadow-lg cursor-pointer">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setLogoFile(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter">{kitchen?.name || 'Seller Kitchen'}</h2>
              <div className="flex items-center space-x-1 text-zinc-500 text-xs mt-1">
                <MapPin size={12} />
                <span>{location || 'Location not set'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1 mb-2 block">Kitchen Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 text-zinc-300"
                placeholder="Kitchen Name"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1 mb-2 block">Kitchen Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 text-zinc-300"
                placeholder="Kitchen Location"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1 mb-2 block">Kitchen Bio</label>
              <textarea 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 text-zinc-300 min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1 mb-2 block">Operating Hours</label>
              <input
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 text-zinc-300"
                placeholder="e.g. Mon - Sat, 9AM - 6PM"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1 mb-2 block">Bank Details</label>
              <input
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 text-zinc-300"
                placeholder="e.g. Bank Name • Account Number"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1 mb-2 block">Business Gallery Notes</label>
              <textarea
                value={galleryNotes}
                onChange={(e) => setGalleryNotes(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-orange-500 text-zinc-300 min-h-[80px]"
                placeholder="Describe gallery or paste image links (upload support next)."
              />
            </div>
            <label className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <span className="text-sm font-bold text-zinc-300">Notifications Enabled</span>
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
                className="h-4 w-4"
              />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>

        {/* Business Settings Sections */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Business Setup</h3>
          
          <div className="space-y-3">
            {[
              { icon: Clock, label: 'Operating Hours', value: operatingHours || 'Not configured yet' },
              { icon: MapPin, label: 'Kitchen Location', value: location || 'Not configured yet' },
              { icon: CreditCard, label: 'Bank Details', value: bankDetails || 'Not configured yet' },
              { icon: ImageIcon, label: 'Business Gallery', value: galleryNotes || 'Not configured yet' },
              { icon: Settings, label: 'Notification Settings', value: notificationEnabled ? 'Enabled' : 'Disabled' },
            ].map((item, idx) => (
              <div key={idx} className="w-full flex items-center justify-between p-5 bg-[#181818] border border-zinc-800 rounded-3xl opacity-90">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-zinc-900 rounded-xl text-zinc-500">
                    <item.icon size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white">{item.label}</span>
                    <span className="text-[10px] text-zinc-500 font-medium">{item.value}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Save & Sign Out */}
        <div className="flex flex-col space-y-4 pt-4 pb-10">
          <button
            onClick={() => {
              setUserRole('customer');
              navigate('/');
            }}
            className="w-full bg-orange-600/10 border border-orange-600/30 text-orange-400 py-4 rounded-[28px] font-bold text-sm flex items-center justify-center space-x-3 hover:bg-orange-600/20 transition-colors"
          >
            <Repeat size={18} />
            <span>Switch to Buyer Mode</span>
          </button>
          <button
            onClick={async () => {
              setError(null);
              setIsSaving(true);
              try {
                const updated = await kitchenAPI.updateMine({
                  name,
                  location,
                  description,
                  operating_hours: operatingHours,
                  bank_details: bankDetails,
                  gallery_notes: galleryNotes,
                  notification_enabled: notificationEnabled,
                  cover_image: coverFile,
                  logo: logoFile,
                });
                setKitchen(updated);
                setCoverFile(null);
                setLogoFile(null);
                setCoverPreview(null);
                setLogoPreview(null);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to save profile');
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
            className="w-full bg-white text-black py-5 rounded-[32px] font-black text-base flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
          
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-3 p-5 text-red-500/60 font-bold text-sm hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out From ChopNextDoor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
