export const profiles = [
  {
    id: 1,
    name: "みく",
    age: 24,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20(2).jpg-jK1pDmDj80DZuySOYuVP4eObvCkrkD.png",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=60",
    ],
    bio: "カフェ巡り好き ☕️ 休日は写真を撮ることが趣味です 📸",
    location: "東京",
    interests: ["カフェ", "フォト", "アート", "ヨガ"],
    isLikedByThem: false
  },
  {
    id: 2,
    name: "サクラ",
    age: 27,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20(3).jpg-nlUWwOkbC1icA4cnOQpFF7rt3H8Zhl.png",
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=60",
    ],
    bio: "おいしいもの食べ歩き🍜 旅行が大好き✈️",
    location: "大阪",
    interests: ["グルメ", "トラベル", "ファッション"],
    isLikedByThem: false
  },
  {
    id: 3,
    name: "あやか",
    age: 25,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20(4).jpg-NJiHqT9PKuqM1862o35K1QBQxAFGDX.png",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&auto=format&fit=crop&q=60",
    ],
    bio: "音楽とダンスが好き 🎵 カフェでまったり本読むのも好き 📚",
    location: "京都",
    interests: ["ミュージック", "ダンス", "カフェ"],
    isLikedByThem: false
  },
  {
    id: 4,
    name: "🐱",
    age: 23,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20(5).jpg-2P7nI0p8LIz2vU6iqEexnh1Vf72lYu.png",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&auto=format&fit=crop&q=60",
    ],
    bio: "スイーツ作り🧁 ときどきヨガ🧘‍♀️ パン屋さん巡り🥖",
    location: "",
    interests: ["ベーキング", "ヨガ", "カフェ", "スイーツ"],
    isLikedByThem: true
  },
  {
    id: 5,
    name: "はるか",
    age: 26,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20(6).jpg-pZv4SYffQDeWWG9KbzKc0sedDDDoNk.png",
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=60",
    ],
    bio: "植物と暮らす🌿 お気に入りのカフェで読書📚",
    location: "京都",
    interests: ["プランツ", "読書", "カフェ", "インテリア"],
    isLikedByThem: false
  }
] as const;

export type Profile = typeof profiles[number];

