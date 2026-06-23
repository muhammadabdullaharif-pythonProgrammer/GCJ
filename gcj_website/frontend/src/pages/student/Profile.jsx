import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Phone, School } from 'lucide-react';

function SkeletonBar() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-xl h-10 w-full" />;
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: 'Muhammad Abdullah',
    email: 'student@gcj.edu.pk',
    phone: '+92 300 1234567',
    roll_no: 'GCJ-31045',
    department: 'Computer Science & IT',
    photo_url: '',
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const previewUrl = useMemo(() => profile.photo_url, [profile.photo_url]);

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, photo_url: url }));
  };

  const save = async () => {
    await new Promise((r) => setTimeout(r, 600));
    // demo save
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
      >
        <div className="space-y-2">
          <h2 className="text-white font-extrabold text-xl">Profile</h2>
          <p className="text-theme-muted text-sm">View/edit profile and upload photo.</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            {loading ? (
              <>
                <SkeletonBar />
                <div className="animate-pulse bg-theme-primary-light/30 rounded-full h-28 w-28 mt-4" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-white font-extrabold">Student Photo</div>
                    <div className="text-theme-muted text-sm mt-1">Upload a profile picture.</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={previewUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                      alt="Profile"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border border-theme-border/60 object-cover"
                    />
                    <label className="absolute bottom-1 right-1 p-2 rounded-xl bg-theme-primary text-white border border-theme-primary/30 cursor-pointer">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
                    </label>
                  </div>

                  <div>
                    <div className="text-white font-extrabold text-sm">{profile.name}</div>
                    <div className="text-theme-muted text-xs mt-1">{profile.roll_no}</div>
                    <div className="text-theme-muted text-xs mt-2">{profile.department}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-brand-gold" /> Name
                </label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-gold" /> Email
                </label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-gold" /> Phone
                </label>
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light flex items-center gap-2">
                  <School className="w-3.5 h-3.5 text-brand-gold" /> Department
                </label>
                <input
                  value={profile.department}
                  onChange={(e) => setProfile((p) => ({ ...p, department: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Roll No</label>
                <input
                  value={profile.roll_no}
                  readOnly
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-muted outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3 flex-col sm:flex-row">
              <button
                type="button"
                onClick={save}
                className="w-full sm:w-auto py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-md cursor-pointer inline-flex items-center justify-center"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfile({
                    name: 'Muhammad Abdullah',
                    email: 'student@gcj.edu.pk',
                    phone: '+92 300 1234567',
                    roll_no: 'GCJ-31045',
                    department: 'Computer Science & IT',
                    photo_url: '',
                  });
                }}
                className="w-full sm:w-auto py-3 rounded-xl bg-theme-primary-light/10 hover:bg-theme-primary-light/20 text-theme-text text-xs font-extrabold uppercase tracking-wider border border-theme-border/60 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

