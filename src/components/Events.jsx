import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  MessageCircle,
  MapPin,
  User,
  Trash2,
  ImagePlus,
  PlusCircle,
  ShieldAlert,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';

function getPostImages(post) {
  if (post.images && Array.isArray(post.images) && post.images.length > 0) return post.images;
  if (post.imageUrl) return [post.imageUrl];
  return [];
}

function MediaCarousel({ urls, t, isMobile }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const len = urls.length;

  useEffect(() => {
    setIndex(0);
  }, [urls.join('|')]);

  const go = useCallback(
    (delta) => {
      if (len <= 1) return;
      setIndex((i) => (i + delta + len) % len);
    },
    [len]
  );

  if (!len) return null;

  return (
    <div
      style={{ position: 'relative', width: '100%', background: '#0f172a', touchAction: len > 1 ? 'pan-y' : 'auto' }}
      onTouchStart={(e) => {
        if (len <= 1) return;
        touchStartX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (len <= 1 || touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (dx > 56) go(-1);
        else if (dx < -56) go(1);
      }}
    >
      <img
        src={urls[index]}
        alt=""
        style={{
          width: '100%',
          display: 'block',
          maxHeight: isMobile ? 'min(72vh, 520px)' : '560px',
          objectFit: 'cover'
        }}
        onError={(e) => {
          e.target.src = '/favicon.svg';
        }}
      />

      {len > 1 && (
        <>
          <button
            type="button"
            aria-label={t('events.carouselPrev')}
            onClick={() => go(-1)}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            <ChevronLeft size={22} color="#0f172a" />
          </button>
          <button
            type="button"
            aria-label={t('events.carouselNext')}
            onClick={() => go(1)}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            <ChevronRight size={22} color="#0f172a" />
          </button>
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              zIndex: 2
            }}
          >
            {urls.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1} / ${len}`}
                onClick={() => setIndex(i)}
                style={{
                  width: i === index ? 18 : 7,
                  height: 7,
                  borderRadius: 999,
                  border: 'none',
                  padding: 0,
                  background: i === index ? '#fff' : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  transition: 'width 0.2s ease'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Events() {
  const { t } = useLanguage();
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const onR = () => setWinW(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  const isMobile = winW < 768;

  const marthaCaption =
    'Martha Mamora, Farm Application Manager for Aquaculture (APAC/ISC) at ADISSEO, visits Kakinada and Bhimavaram often for on-the-ground aquaculture reporting across Andhra Pradesh. As part of her rounds she trains Confier staff on disease patterns, field diagnostics, and practical remedies—so teams can support farmers with clearer, faster guidance.';

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Martha Mamora',
      role: 'Farm Application Manager • Aquaculture APAC/ISC • ADISSEO',
      location: 'Kakinada & Bhimavaram, Andhra Pradesh',
      timeAgo: 'Featured',
      images: ['/live/martha-field-team.png', '/live/martha-field-microscope.png'],
      caption: marthaCaption,
      likes: 142,
      isLiked: false,
      comments: [
        { id: 101, author: 'Confier Field', text: 'Thank you for the hands-on microscopy session and disease walkthrough.' }
      ]
    },
    {
      id: 2,
      author: 'Khuong Duy Nguyen',
      role: 'Business Development Manager • Aqua Health & Farm Care • APAC/ISC • ADISSEO',
      location: 'CIPL team & shrimp farms, Andhra Pradesh',
      timeAgo: 'Featured',
      images: ['/live/khuong-field-cipl.png', '/live/khuong-training-adisseo.png'],
      caption:
        'Technology training & field visit: Mr. Duy visited the CIPL team to share valuable insights and provide training on the latest technologies in shrimp culture. As part of his visit, he also accompanied the CIPL team to various shrimp farms, offering practical guidance and field-level observations.',
      likes: 124,
      isLiked: false,
      comments: [
        { id: 201, author: 'Confier Field', text: 'Thank you for the ADISSEO sessions and the time on farm with our team.' },
        { id: 202, author: 'CIPL Aqua', text: 'Clear takeaways on intensive farming controls and nursery-stage focus.' }
      ]
    }
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPost, setNewPost] = useState({ imageUrls: [], imageFiles: [], caption: '', location: '' });
  const [fileInputKey, setFileInputKey] = useState(0);
  const [commentInputs, setCommentInputs] = useState({});

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      })
    );
  };

  const handleShare = async (post) => {
    const url =
      typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#events` : '';
    const title = `${t('events.confierLive')} — ${post.author}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: post.caption.slice(0, 220),
          url
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert(t('events.linkCopied'));
      } else {
        alert(t('events.shareFallback'));
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          alert(t('events.linkCopied'));
        } else {
          alert(t('events.shareFallback'));
        }
      } catch {
        alert(t('events.shareFallback'));
      }
    }
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!text || text.trim() === '') return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, { id: Date.now(), author: isAdmin ? 'Confier Admin' : 'Guest', text: text.trim() }]
          };
        }
        return p;
      })
    );
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, comments: p.comments.filter((c) => c.id !== commentId) };
        }
        return p;
      })
    );
  };

  const handleDeletePost = (postId) => {
    if (window.confirm(t('events.confirmDelete'))) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.imageUrls?.length || !newPost.caption?.trim()) {
      alert(t('events.alertNeedImages'));
      return;
    }

    const createdPost = {
      id: Date.now(),
      author: 'Confier Admin',
      role: 'Official updates',
      location: newPost.location?.trim() || 'Confier HQ',
      timeAgo: 'Just now',
      images: [...newPost.imageUrls],
      caption: newPost.caption.trim(),
      likes: 0,
      isLiked: false,
      comments: []
    };

    setPosts((prev) => [createdPost, ...prev]);
    setNewPost({ imageUrls: [], imageFiles: [], caption: '', location: '' });
    setFileInputKey((k) => k + 1);
    setShowAddPost(false);
  };

  const feedMax = 'min(560px, 100%)';

  return (
    <section
      id="events"
      style={{
        background: 'linear-gradient(180deg, #eef6f8 0%, #f9fcfd 100%)',
        padding: isMobile ? '48px 12px' : '88px 20px',
        minHeight: '100vh'
      }}
    >
      <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.75rem' : '2.25rem' }}>
          <span
            style={{
              color: 'var(--clr-teal-dark, #005f73)',
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              fontSize: '0.78rem',
              background: 'rgba(0, 95, 115, 0.08)',
              padding: '7px 14px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '0.65rem'
            }}
          >
            {t('events.tag')}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? '1.85rem' : '2.35rem',
              color: '#0c4a5e',
              lineHeight: 1.12,
              margin: 0,
              fontWeight: 700
            }}
          >
            {t('events.latestHeading')}
          </h2>
          <p style={{ margin: '0.6rem auto 0', color: '#64748b', fontSize: '0.95rem', maxWidth: '42ch' }}>
            {t('events.desc')}
          </p>

          <button
            type="button"
            onClick={() => setIsAdmin(!isAdmin)}
            style={{
              marginTop: '1.1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: isAdmin ? '#FEF2F2' : '#fff',
              border: isAdmin ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
              color: isAdmin ? '#DC2626' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <ShieldAlert size={16} />
            {isAdmin ? t('events.adminOn') : t('events.adminOff')}
          </button>
        </div>

        {isAdmin && (
          <div
            style={{
              background: 'rgba(255,255,255,0.96)',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              maxWidth: feedMax,
              margin: '0 auto 1.75rem',
              boxShadow: '0 8px 30px rgba(0,95,115,0.06)'
            }}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowAddPost(!showAddPost)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowAddPost(!showAddPost);
                }
              }}
              style={{
                padding: '1rem 1.25rem',
                background: '#f8fafc',
                borderBottom: '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                <PlusCircle size={18} /> {t('events.createPost')}
              </strong>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{showAddPost ? t('events.hide') : t('events.expand')}</span>
            </div>

            {showAddPost && (
              <form onSubmit={handleCreatePost} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    {t('events.uploadImages')}
                  </label>
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (!files.length) return;
                      Promise.all(
                        files.map(
                          (file) =>
                            new Promise((resolve, reject) => {
                              const reader = new FileReader();
                              reader.onload = () => resolve(String(reader.result));
                              reader.onerror = reject;
                              reader.readAsDataURL(file);
                            })
                        )
                      ).then((dataUrls) => {
                        setNewPost((prev) => ({
                          ...prev,
                          imageUrls: dataUrls,
                          imageFiles: files
                        }));
                      });
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                  {newPost.imageUrls.length > 0 && (
                    <p style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px' }}>
                      {t('events.photoCount').replace('{n}', String(newPost.imageUrls.length))}
                    </p>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    {t('events.location')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('events.locationPh')}
                    value={newPost.location}
                    onChange={(ev) => setNewPost({ ...newPost, location: ev.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    {t('events.caption')}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t('events.captionPh')}
                    required
                    value={newPost.caption}
                    onChange={(ev) => setNewPost({ ...newPost, caption: ev.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #005f73, #0a9396)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {t('events.postCta')}
                </button>
              </form>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', alignItems: 'center' }}>
          {posts.map((post) => {
            const urls = getPostImages(post);
            return (
              <article
                key={post.id}
                style={{
                  width: '100%',
                  maxWidth: feedMax,
                  background: '#fff',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
                  overflow: 'hidden'
                }}
              >
                {/* Top: Confier Live + verified, location, time */}
                <header style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px', minWidth: 0 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '14px',
                          background: 'linear-gradient(145deg, #0a9396, #005f73)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <User size={22} color="#fff" strokeWidth={1.75} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexWrap: 'wrap',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            color: '#0f172a'
                          }}
                        >
                          <span>{t('events.confierLive')}</span>
                          <BadgeCheck size={18} color="#0a9396" aria-hidden style={{ flexShrink: 0 }} />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', lineHeight: 1.35 }}>
                          {post.location && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} />
                              {post.location}
                            </span>
                          )}
                          {post.location && post.timeAgo && <span> · </span>}
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 6 }}
                        title={t('events.deletePost')}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </header>

                <MediaCarousel urls={urls} t={t} isMobile={isMobile} />

                {/* Author line + caption */}
                <div style={{ padding: '12px 16px 4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{post.author}</span>
                    <BadgeCheck size={16} color="#0a9396" aria-hidden />
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{post.role}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.94rem', color: '#1e293b', lineHeight: 1.55 }}>
                    {post.caption}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ padding: '8px 12px 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      color: post.isLiked ? '#e11d48' : '#0f172a',
                      borderRadius: '12px'
                    }}
                    aria-pressed={post.isLiked}
                  >
                    <Heart size={24} fill={post.isLiked ? '#fb7185' : 'none'} />
                  </button>
                  <span style={{ padding: '8px', color: '#0f172a' }} aria-hidden>
                    <MessageCircle size={24} />
                  </span>
                  <button
                    type="button"
                    onClick={() => handleShare(post)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      color: '#0f172a',
                      borderRadius: '12px'
                    }}
                    aria-label={t('events.share')}
                  >
                    <Share2 size={22} />
                  </button>
                </div>

                <div style={{ padding: '0 16px 10px', fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {post.likes.toLocaleString()} {t('events.likes')}
                </div>

                {/* Comments */}
                <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', lineHeight: 1.45 }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', marginRight: '6px' }}>{comment.author}</span>
                          <span style={{ color: '#334155' }}>{comment.text}</span>
                        </div>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}
                            title={t('events.deleteComment')}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{t('events.noComments')}</div>
                  )}
                </div>

                <footer style={{ padding: '10px 12px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder={t('events.commentPh')}
                    value={commentInputs[post.id] || ''}
                    onChange={(ev) => setCommentInputs({ ...commentInputs, [post.id]: ev.target.value })}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter') handleAddComment(post.id);
                    }}
                    style={{
                      flex: 1,
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '0.9rem',
                      background: '#f8fafc',
                      padding: '10px 12px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: commentInputs[post.id]?.trim() ? '#005f73' : '#cbd5e1',
                      fontWeight: 700,
                      cursor: commentInputs[post.id]?.trim() ? 'pointer' : 'default',
                      fontSize: '0.88rem',
                      padding: '8px 4px'
                    }}
                  >
                    {t('events.post')}
                  </button>
                </footer>
              </article>
            );
          })}

          {posts.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                color: '#64748b',
                background: '#fff',
                borderRadius: '18px',
                border: '1px dashed #cbd5e1',
                maxWidth: feedMax,
                width: '100%'
              }}
            >
              <ImagePlus size={44} style={{ margin: '0 auto 0.75rem', opacity: 0.45 }} />
              <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a', fontSize: '1.1rem' }}>{t('events.emptyTitle')}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('events.emptyHint')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
