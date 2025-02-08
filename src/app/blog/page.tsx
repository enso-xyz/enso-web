"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/ui/header"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: string
  title: string
  subtitle: string
  category: string
  date: string
  readTime: string
  preview: string
  href: string
  featured?: boolean
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
}

const posts: BlogPost[] = [
  {
    id: "1",
    title: "in the space between messages",
    subtitle: "exploring the ambient intelligence of conversation",
    category: "philosophy",
    date: "feb 2024",
    readTime: "8 min",
    preview: "how ai can enhance rather than replace human connection, creating spaces for meaning to emerge naturally",
    href: "/blog/space-between-messages",
    featured: true
  },
  {
    id: "2",
    title: "the architecture of context",
    subtitle: "building a second brain for conversation",
    category: "technology",
    date: "feb 2024", 
    readTime: "12 min",
    preview: "a deep dive into how we're creating an ai system that understands the subtle layers of human communication",
    href: "/blog/architecture-of-context",
    featured: true
  },
  {
    id: "3",
    title: "design as intelligence",
    subtitle: "the visual language of ambient ai",
    category: "design",
    date: "jan 2024",
    readTime: "6 min",
    preview: "exploring how visual design can make artificial intelligence feel natural and ambient rather than intrusive",
    href: "/blog/design-as-intelligence"
  },
  {
    id: "4",
    title: "embedding conversations",
    subtitle: "technical deep dive into our semantic core",
    category: "engineering",
    date: "feb 2024",
    readTime: "15 min",
    preview: "an in-depth exploration of how we use advanced embedding techniques to create a semantic understanding of conversations",
    href: "/blog/embedding-conversations"
  },
  {
    id: "5",
    title: "the future of digital memory",
    subtitle: "why context is the new content",
    category: "research",
    date: "feb 2024",
    readTime: "10 min",
    preview: "examining how ambient intelligence is transforming the way we think about digital memory and knowledge preservation",
    href: "/blog/future-digital-memory"
  },
  {
    id: "6",
    title: "identity in the age of ai",
    subtitle: "preserving humanity in digital spaces",
    category: "philosophy",
    date: "jan 2024",
    readTime: "7 min",
    preview: "exploring how we maintain authentic human connection while leveraging artificial intelligence in communication",
    href: "/blog/identity-ai-age"
  },
  {
    id: "7",
    title: "vector search at scale",
    subtitle: "building a performant semantic engine",
    category: "engineering",
    date: "jan 2024",
    readTime: "20 min",
    preview: "technical deep dive into our vector search implementation, optimization techniques, and scaling strategies",
    href: "/blog/vector-search-scale"
  },
  {
    id: "8",
    title: "the psychology of ambient ux",
    subtitle: "designing for subconscious interaction",
    category: "design",
    date: "jan 2024",
    readTime: "9 min",
    preview: "how we're using psychological principles to create interfaces that feel natural and intuitive",
    href: "/blog/ambient-ux-psychology"
  },
  {
    id: "9",
    title: "cross-platform context",
    subtitle: "unifying digital conversation",
    category: "product",
    date: "feb 2024",
    readTime: "8 min",
    preview: "how we're bridging the gap between different communication platforms while preserving context and meaning",
    href: "/blog/cross-platform-context"
  },
  {
    id: "10",
    title: "privacy by design",
    subtitle: "building trust in the age of ai",
    category: "security",
    date: "feb 2024",
    readTime: "11 min",
    preview: "our approach to maintaining privacy and security while leveraging advanced ai capabilities",
    href: "/blog/privacy-by-design"
  },
  {
    id: "11",
    title: "the art of suggestion",
    subtitle: "making ai feel ambient",
    category: "product",
    date: "jan 2024",
    readTime: "7 min",
    preview: "exploring how we make ai suggestions feel natural and non-intrusive in conversation flows",
    href: "/blog/art-of-suggestion"
  },
  {
    id: "12",
    title: "knowledge graphs in practice",
    subtitle: "modeling conversation context",
    category: "engineering",
    date: "jan 2024",
    readTime: "16 min",
    preview: "technical exploration of how we use knowledge graphs to model and understand conversation context",
    href: "/blog/knowledge-graphs-practice"
  }
]

// Get unique categories from posts
const categories = Array.from(new Set(posts.map(post => post.category)))

// Get more organic content size variation
const getContentSize = (post: BlogPost, index: number) => {
  // Engineering posts get more space
  if (post.category === 'engineering') {
    return 'large'
  }
  // Philosophy and research posts get medium-large space
  if (post.category === 'philosophy' || post.category === 'research') {
    return 'medium-large'
  }
  // Every fifth post gets medium size for visual interest
  if (index % 5 === 2) {
    return 'medium'
  }
  // Every seventh post gets small size
  if (index % 7 === 3) {
    return 'small'
  }
  // Others get regular size
  return 'regular'
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const featuredPosts = posts.filter(post => post.featured)
  const otherPosts = posts.filter(post => !post.featured)
    .filter(post => selectedCategory === 'all' || post.category === selectedCategory)

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--black-pure)]">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-8 md:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-white/90 leading-tight">
              compiled notes from the team
            </h1>
            <p className="mt-8 text-xl text-white/60 font-extralight leading-relaxed">
              exploring the intersection of artificial intelligence, human connection, and the future of communication
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts Row */}
      <section className="px-8 md:px-12 lg:px-16 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-xl font-light text-white/80 mb-8">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial="initial"
                animate="animate"
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={post.href} className="block group">
                  <article className="relative h-full p-8 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm hover:bg-white/5 transition-colors">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between text-sm text-white/40 mb-8">
                        <span>{post.category}</span>
                        <div className="flex items-center gap-4">
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-light text-white/80 mb-3 group-hover:text-white/90 transition-colors">
                        {post.title}
                      </h2>
                      
                      <h3 className="text-lg text-white/60 mb-6">
                        {post.subtitle}
                      </h3>
                      
                      <p className="text-white/40 font-light mb-8 flex-grow">
                        {post.preview}
                      </p>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-8 md:px-12 lg:px-16 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center gap-0 py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-3 py-1 text-sm font-light rounded-lg transition-colors whitespace-nowrap",
                selectedCategory === 'all' ? "text-white/90" : "text-white/40 hover:text-white/60"
              )}
            >
              all
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1 text-sm font-light rounded-lg transition-colors whitespace-nowrap",
                  selectedCategory === category ? "text-white/90" : "text-white/40 hover:text-white/60"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid - More Organic Heights */}
      <section className="px-8 md:px-12 lg:px-16 pb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherPosts.map((post, index) => {
              const size = getContentSize(post, index)
              return (
                <motion.div
                  key={post.id}
                  initial="initial"
                  animate="animate"
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "group",
                    size === 'large' && "md:col-span-2 lg:col-span-1",
                    size === 'medium-large' && index % 2 === 0 && "md:col-span-2 lg:col-span-1"
                  )}
                >
                  <Link href={post.href} className="block h-full">
                    <article 
                      className={cn(
                        "relative rounded-2xl border border-white/5",
                        "bg-white/2 backdrop-blur-sm hover:bg-white/5 transition-colors h-full"
                      )}
                    >
                      <div className={cn(
                        "flex flex-col",
                        size === 'large' && "p-7",
                        size === 'medium-large' && "p-6",
                        size === 'medium' && "p-5",
                        size === 'small' && "p-4",
                        size === 'regular' && "p-5"
                      )}>
                        <div className="flex items-center justify-between text-sm text-white/40 mb-3">
                          <span>{post.category}</span>
                          <span>{post.readTime}</span>
                        </div>
                        
                        <h2 className={cn(
                          "font-light text-white/80 group-hover:text-white/90 transition-colors",
                          size === 'large' && "text-2xl mb-4",
                          size === 'medium-large' && "text-xl mb-3",
                          size === 'medium' && "text-lg mb-3",
                          size === 'small' && "text-base mb-2",
                          size === 'regular' && "text-lg mb-2"
                        )}>
                          {post.title}
                        </h2>

                        {(size === 'large' || size === 'medium-large') && (
                          <h3 className={cn(
                            "text-white/60 mb-4",
                            size === 'large' && "text-lg",
                            size === 'medium-large' && "text-base"
                          )}>
                            {post.subtitle}
                          </h3>
                        )}
                        
                        <p className={cn(
                          "text-white/40 font-light",
                          size === 'large' && "text-base line-clamp-4",
                          size === 'medium-large' && "text-base line-clamp-3",
                          size === 'medium' && "text-sm line-clamp-3",
                          size === 'small' && "text-sm line-clamp-2",
                          size === 'regular' && "text-sm line-clamp-2"
                        )}>
                          {post.preview}
                        </p>

                        {/* Visual variation for larger cards */}
                        {(size === 'large' || size === 'medium-large') && (
                          <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
                        )}
                      </div>
                    </article>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 py-32">
          <div className="flex flex-col md:flex-row items-start justify-between gap-16">
            <div className="flex-1">
              <h3 className="text-3xl font-light text-white/80 mb-4">
                join our newsletter
              </h3>
              <p className="text-lg text-white/60 font-light max-w-lg">
                receive monthly insights on ambient intelligence, the future of communication, and the evolution of ai
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="flex gap-6">
                <input 
                  type="email" 
                  placeholder="email address" 
                  className="w-full md:w-80 bg-transparent border-b-2 border-white/20 py-3 text-xl text-white/60 placeholder:text-white/40 focus:outline-none focus:border-white/40"
                />
                <button className="text-xl text-white/60 hover:text-white/80 transition-colors flex items-center gap-3">
                  join
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 