import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

type BuddyState = 'welcome' | 'thinking' | 'generating'

interface CodeBuddyAvatarProps {
  state: BuddyState
  className?: string
}

export default function CodeBuddyAvatar({ state, className = '' }: CodeBuddyAvatarProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Avatar circle */}
      <motion.div
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center shadow-lg"
        animate={state === 'thinking' ? { boxShadow: ['0 0 0 0 rgba(124,58,237,0.4)', '0 0 0 12px rgba(124,58,237,0)', '0 0 0 0 rgba(124,58,237,0.4)'] } : {}}
        transition={state === 'thinking' ? { repeat: Infinity, duration: 2 } : {}}
      >
        {/* Face */}
        <div className="relative">
          {/* Eyes */}
          <div className="flex gap-2.5 mb-1.5">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-white"
              animate={state === 'thinking' ? { scaleY: [1, 0.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            />
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-white"
              animate={state === 'thinking' ? { scaleY: [1, 0.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
            />
          </div>
          {/* Mouth */}
          <motion.div
            className="w-4 h-1 bg-white/80 rounded-full mx-auto"
            animate={state === 'generating' ? { width: ['16px', '12px', '16px'] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>

        {/* Sparkles around avatar when generating */}
        {state === 'generating' && (
          <>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
            <motion.div
              className="absolute -bottom-0.5 -left-1"
              animate={{ scale: [1, 0.7, 1], opacity: [0.8, 0.4, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.5 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Status label */}
      <div className="mt-2.5 text-center">
        <p className="text-sm font-semibold text-gray-800">CodeBuddy</p>
        <p className="text-[11px] text-gray-400">
          {state === 'welcome' && '你的 AI 学习向导'}
          {state === 'thinking' && '正在分析中...'}
          {state === 'generating' && '正在生成画像...'}
        </p>
      </div>

      {/* Thinking dots */}
      {state === 'thinking' && (
        <div className="flex gap-1 mt-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
