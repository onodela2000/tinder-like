'use client'

import { useState, useRef, useEffect } from 'react'
import { animated, useSpring, useTransition } from '@react-spring/web'
import { Heart, X, Sparkles } from 'lucide-react'
import { profiles, type Profile } from '@/components/types'

export default function SwipeCard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showMatch, setShowMatch] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null); // Added matchedProfile state
  const dragStartX = useRef(0)
  const currentX = useRef(0)
  const touchStartX = useRef(0)
  const touchStartTime = useRef(0)

  const [style, api] = useSpring(() => ({
    x: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
    config: {
      friction: 18,
      tension: 280
    }
  }))

  // Progress bar animation
  const [progressStyle, progressApi] = useSpring(() => ({
    width: '0%',
    config: { duration: 5000 }
  }))

  // Match animation
  const matchTransition = useTransition(showMatch, {
    from: { opacity: 0, scale: 0.8 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.8 },
    config: {
      tension: 300,
      friction: 20
    }
  })

  const [sparkleStyle, sparkleApi] = useSpring(() => ({
    scale: 1,
    rotate: '0deg',
    config: {
      tension: 300,
      friction: 10
    }
  }))

  // Add preloaded images Set ref
  const preloadedImagesRef = useRef(new Set<string>())

  useEffect(() => {
    if (currentIndex >= profiles.length) return
    
    progressApi.start({ width: '100%' })
    const timer = setTimeout(() => {
      handleNextImage()
    }, 5000)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex, currentIndex])

  useEffect(() => {
    if (showMatch) {
      const interval = setInterval(() => {
        sparkleApi.start({
          scale: 1.2,
          rotate: '15deg',
          onRest: () => {
            sparkleApi.start({
              scale: 1,
              rotate: '0deg'
            })
          }
        })
      }, 1000)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMatch])

  const handleNextImage = () => {
    if (currentIndex >= profiles.length) return

    const profile = profiles[currentIndex]
    if (currentImageIndex < profile.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
      progressApi.set({ width: '0%' })
    }
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
      progressApi.set({ width: '0%' })
    }
  }

  const handleImageNavigation = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) return

    const clientX = 'touches' in e
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX
    const screenWidth = window.innerWidth

    if (clientX < screenWidth / 2) {
      handlePrevImage()
    } else {
      handleNextImage()
    }
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e
      ? e.touches[0].clientX
      : (e as React.MouseEvent).clientX

    setIsDragging(true)
    dragStartX.current = clientX
    touchStartX.current = clientX
    touchStartTime.current = Date.now()
    currentX.current = 0
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return

    const clientX = 'touches' in e
      ? e.touches[0].clientX
      : (e as React.MouseEvent).clientX

    const deltaX = clientX - dragStartX.current
    currentX.current = deltaX

    api.start({
      x: deltaX,
      rotation: deltaX / 15,
      scale: 1.05,
      immediate: true
    })
  }

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(false)
    const threshold = 100
    const touchEndX = 'changedTouches' in e
      ? e.changedTouches[0].clientX
      : (e as React.MouseEvent).clientX
    const touchDuration = Date.now() - touchStartTime.current
    const touchDistance = touchEndX - touchStartX.current

    // Quick tap for image navigation
    if (Math.abs(touchDistance) < 10 && touchDuration < 200) {
      handleImageNavigation(e)
      return
    }

    if (Math.abs(currentX.current) > threshold) {
      const direction = currentX.current > 0 ? 1 : -1
      api.start({
        x: direction * window.innerWidth,
        rotation: direction * 45,
        opacity: 0,
        config: { friction: 40, tension: 180 }
      })

      // Check for match when swiping right
      if (direction > 0 && profiles[currentIndex].isLikedByThem) {
        setMatchedProfile(profiles[currentIndex]);
        setShowMatch(true);
        setTimeout(() => {
          setCurrentIndex(index => index + 1)
          setCurrentImageIndex(0)
          api.start({ x: 0, rotation: 0, scale: 1, opacity: 1, immediate: true })
        }, 2000) // Give time for match animation
      } else {
        setTimeout(() => {
          setCurrentIndex(index => index + 1)
          setCurrentImageIndex(0)
          api.start({ x: 0, rotation: 0, scale: 1, opacity: 1, immediate: true })
        }, 300)
      }
    } else {
      api.start({ 
        x: 0, 
        rotation: 0, 
        scale: 1,
        config: { friction: 15, tension: 250 }
      })
    }
  }

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleTouchEnd({ clientX: dragStartX.current } as React.MouseEvent)
      }
    }

    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  const preloadImages = (imageUrls: string[] | undefined) => {
    if (!imageUrls) return
    imageUrls.forEach(url => {
      if (!preloadedImagesRef.current.has(url)) {
        const img = new Image()
        img.src = url
        preloadedImagesRef.current.add(url)
      }
    })
  }

  useEffect(() => {
    if (currentIndex < profiles.length - 1) {
      const nextProfile = profiles[currentIndex + 1]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      preloadImages(nextProfile?.images as string[])
    }
  }, [currentIndex])

  useEffect(() => {
    const profile = profiles[currentIndex]
    if (profile && currentImageIndex < profile.images.length - 1) {
      const nextImage = profile.images[currentImageIndex + 1]
      preloadImages([nextImage])
    }
  }, [currentImageIndex, currentIndex])

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-rose-50 to-slate-50">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full blur-3xl opacity-20" />
        <div className="relative bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="mb-6 bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-full inline-block">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <p className="text-slate-600 text-lg mb-6">
            プロフィールをすべて見終わりました！
            <span className="block text-sm mt-1 text-slate-500">また後でチェックしてみてください</span>
          </p>
          <div className="w-24 h-1 mb-6 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-full mx-auto" />
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="text-slate-500 text-sm">
              アプリ開発のご依頼はこちら！
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://x.com/onodera_itlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://onomato.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/onodera_itlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }

  const profile = profiles[currentIndex]

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (isLoading) return; // Added loading check
    setIsLoading(true); // Set loading to true

    const dir = direction === 'left' ? -1 : 1
    api.start({
      x: dir * window.innerWidth,
      rotation: dir * 45,
      opacity: 0,
      config: { friction: 40, tension: 180 }
    })

    // Check for match when swiping right
    if (direction === 'right' && profiles[currentIndex].isLikedByThem) {
      setMatchedProfile(profiles[currentIndex]);
      setShowMatch(true);
      setTimeout(() => {
        setCurrentIndex(index => index + 1);
        setCurrentImageIndex(0);
        api.start({ x: 0, rotation: 0, scale: 1, opacity: 1, immediate: true });
        setIsLoading(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setCurrentIndex(index => index + 1)
        setCurrentImageIndex(0)
        api.start({ x: 0, rotation: 0, scale: 1, opacity: 1, immediate: true })
        setIsLoading(false) // Set loading to false after animation
      }, 300)
    }
  }

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-between p-4 pb-8 bg-gradient-to-b from-rose-50 to-slate-50 select-none">
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="relative w-[320px] h-[480px] md:w-[360px] md:h-[540px]">
          <animated.div
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: style.x.to((x) => `translateX(${x}px) rotate(${style.rotation.get()}deg) scale(${style.scale.get()})`),
              opacity: style.opacity
            }}
            className="absolute w-full h-full bg-white rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing touch-none overflow-hidden"
          >
            <div className="relative w-full h-full">
              {/* Progress bars */}
              <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2 pointer-events-none select-none">
                {profile.images.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    {idx === currentImageIndex && (
                      <animated.div
                        className="h-full bg-white"
                        style={progressStyle}
                      />
                    )}
                    {idx < currentImageIndex && (
                      <div className="h-full w-full bg-white" />
                    )}
                  </div>
                ))}
              </div>

              <img
                src={profile.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${profile.name}'s photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable="false"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none select-none">
                <div className="flex items-baseline gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{profile.name}</h2>
                  <span className="text-xl text-white/90">{profile.age}</span>
                </div>
                <p className="text-white/90 mb-3 flex items-center gap-1">
                  📍 {profile.location}
                </p>
                <p className="text-lg mb-4 text-white/80">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 pointer-events-none">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <animated.div
                style={{
                  opacity: style.x.to(x => (x < -20 ? 1 : 0))
                }}
                className="absolute top-6 left-6 bg-rose-500/90 backdrop-blur-sm text-white p-4 rounded-full transform -rotate-12 shadow-lg pointer-events-none select-none"
              >
                <X className="w-8 h-8 stroke-[2.5]" />
              </animated.div>
              <animated.div
                style={{
                  opacity: style.x.to(x => (x > 20 ? 1 : 0))
                }}
                className="absolute top-6 right-6 bg-emerald-500/90 backdrop-blur-sm text-white p-4 rounded-full transform rotate-12 shadow-lg pointer-events-none select-none"
              >
                <Heart className="w-8 h-8 stroke-[2.5] fill-white" />
              </animated.div>
            </div>
          </animated.div>
        </div>
      </div>

      {/* Match overlay */}
      {matchTransition((style, show) =>
        show && (
          <animated.div
            style={style}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50"
            onClick={() => setShowMatch(false)}
          >
            <div className="text-center p-8 max-w-md w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10">
              <animated.div
                style={sparkleStyle}
                className="inline-block mb-6 bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-full"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </animated.div>
              <h2 className="text-4xl font-bold text-white mb-4">マッチング！</h2>
              <p className="text-xl text-white/80 mb-8">
                {matchedProfile?.name}さんとマッチングしました！
              </p>

              {/* Profile Images */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full blur-xl opacity-50" />
                  <img
                    src={matchedProfile?.images[0] || "/placeholder.svg"}
                    alt={matchedProfile?.name}
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl relative z-10"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full blur-xl opacity-50" />
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20(7).jpg-VyyV4yj5DnxbqrafEbxiWaeYKjlTR5.png"
                    alt="Your profile"
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl relative z-10"
                  />
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMatch(false)
                }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                続けてスワイプ
              </button>
            </div>
          </animated.div>
        )
      )}

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => handleButtonSwipe('left')}
          disabled={isLoading} // Added disabled state
          className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none" // Added disabled styles
          aria-label="Dislike"
        >
          <X className="w-8 h-8 stroke-[2.5]" />
        </button>
        <button
          onClick={() => handleButtonSwipe('right')}
          disabled={isLoading} // Added disabled state
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none" // Added disabled styles
          aria-label="Like"
        >
          <Heart className="w-8 h-8 stroke-[2.5] fill-white" />
        </button>
      </div>
    </div>
  )
}

