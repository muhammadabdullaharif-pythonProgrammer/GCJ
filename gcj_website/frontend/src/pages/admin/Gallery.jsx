import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Trash2 } from 'lucide-react';

function PlaceholderCard() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-56" />;
}

export default function Gallery() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('CAMPUS');

  const [feedback, setFeedback] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;
      setItems([
        { id: 1, category: 'CAMPUS', caption: 'Main clocktower', image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85' },
        { id: 2, category: 'LABS', caption: 'AI lab', image_url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=85' },
        { id: 3, category: 'SPORTS', caption: 'Sports gala', image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=85' },
      ]);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = items.filter((x) => x.category === category);

  const onUpload = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    await new Promise((r) => setTimeout(r, 700));

    const url = URL.createObjectURL(file);

    setItems((prev) => [
      { id: Date.now(), category, caption: file.name.replace(/\.[^/.]+$/, ''), image_url: url },
      ...prev,
    ]);

    setUploading(false);
    setFeedback({ type: 'success', message: 'Image uploaded (demo).' });
    e.target.value = '';
  };

  const del = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setFeedback({ type: 'success', message: 'Image deleted (demo).' });
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
          <h2 className="text-white font-extrabold text-xl">Gallery Manager</h2>
          <p className="text-theme-muted text-sm">Upload/delete gallery images (demo).</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <h3 className="text-white font-extrabold">Upload</h3>

            {feedback && (
              <div
                className={`mt-4 p-4 rounded-xl border text-xs ${
                  feedback.type === 'success'
                    ? 'bg-green-500/10 text-green-300 border-green-500/20'
                    : 'bg-red-500/10 text-red-300 border-red-500/20'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold cursor-pointer"
              >
                {['CAMPUS', 'LABS', 'ACADEMICS', 'SPORTS', 'EVENTS'].map((c) => (
                  <option key={c} value={c} className="bg-theme-footer">
                    {c}
                  </option>
                ))}
              </select>

              <label className="cursor-pointer block">
                <div className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-brand-gold" />
                    <span className="text-xs font-extrabold text-theme-text">
                      {uploading ? 'Uploading...' : 'Choose image'}
                    </span>
                  </div>
                  <span className="text-xs text-theme-muted">PNG/JPG</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <h3 className="text-white font-extrabold">{category} Images</h3>
              <div className="text-theme-muted text-xs">
                Total: <span className="font-extrabold text-theme-text">{filtered.length}</span>
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <PlaceholderCard />
                  <PlaceholderCard />
                  <PlaceholderCard />
                </div>
              ) : filtered.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((x) => (
                    <div key={x.id} className="relative rounded-3xl overflow-hidden border border-theme-border/60 bg-theme-primary-light/10">
                      <img src={x.image_url} alt={x.caption} className="w-full h-56 object-cover" />
                      <div className="p-3">
                        <div className="text-xs font-extrabold text-theme-text line-clamp-1">{x.caption}</div>
                        <div className="text-[10px] text-theme-muted uppercase tracking-widest mt-1">{x.category}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => del(x.id)}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 cursor-pointer"
                        aria-label="Delete image"
                      >
                        <Trash2 className="w-4 h-4 text-red-200" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-theme-muted text-sm">No images in this category.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

