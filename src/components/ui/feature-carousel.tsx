"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react"
import Image, { type StaticImageData } from "next/image"
import clsx from "clsx"
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "framer-motion"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"

type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>
  "--y": MotionValue<string>
}

interface CardProps {
  title: string
  description: string
  bgClass?: string
}

interface ImageSet {
  step1dark1?: StaticImageData | string
  step1dark2?: StaticImageData | string
  step1light1: StaticImageData | string
  step1light2: StaticImageData | string
  step2dark1?: StaticImageData | string
  step2dark2?: StaticImageData | string
  step2light1: StaticImageData | string
  step2light2: StaticImageData | string
  step3dark?: StaticImageData | string
  step3light: StaticImageData | string
  step4light: StaticImageData | string
  step5light: StaticImageData | string
  step6light: StaticImageData | string
  step7light: StaticImageData | string
  alt: string
}

export interface ComponentProps extends CardProps {
  step1img1Class?: string
  step2img1Class?: string
  step3imgClass?: string
  step4imgClass?: string
  step5imgClass?: string
  step6imgClass?: string
  step7imgClass?: string
  image: ImageSet
  features: readonly Step[]
}

interface StepImageProps {
  src: StaticImageData | string
  alt: string
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
}

export interface Step {
  id: string
  name: string
  title: string
  description: string
  image: string
}

const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
} as const

type AnimationPreset = keyof typeof ANIMATION_PRESETS

interface AnimatedStepImageProps extends StepImageProps {
  preset?: AnimationPreset
  delay?: number
  onAnimationComplete?: () => void
}

function useNumberCycler(
  totalSteps: number = 7,
  interval: number = 4000
) {
  const [currentNumber, setCurrentNumber] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const setupTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setCurrentNumber((prev) => (prev + 1) % totalSteps)
      setupTimer()
    }, interval)
  }, [interval, totalSteps])

  const increment = useCallback(() => {
    setCurrentNumber((prev) => (prev + 1) % totalSteps)
    setupTimer()
  }, [totalSteps, setupTimer])

  useEffect(() => {
    setupTimer()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [setupTimer])

  return {
    currentNumber,
    increment,
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const userAgent = navigator.userAgent
    const isSmall = window.matchMedia("(max-width: 768px)").matches
    const isMobileUserAgent = Boolean(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.exec(
        userAgent
      )
    )
    const isDev = process.env.NODE_ENV !== "production"
    if (isDev) {
      setIsMobile(isSmall || isMobileUserAgent)
    } else {
      setIsMobile(isSmall && isMobileUserAgent)
    }
  }, [])
  return isMobile
}

function IconCheck({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

const stepVariants: Variants = {
  inactive: {
    scale: 0.8,
    opacity: 0.5,
  },
  active: {
    scale: 1,
    opacity: 1,
  },
}

const StepImage = forwardRef<
  HTMLImageElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StepImageProps & { [key: string]: any }
>(
  (
    { src, alt, className, style, width = 1200, height = 630, ...props },
    ref
  ) => {
    return (
      <Image
        ref={ref}
        alt={alt}
        className={className}
        src={src}
        width={width}
        height={height}
        style={{
          position: "absolute",
          userSelect: "none",
          maxWidth: "unset",
          ...style,
        }}
        {...props}
      />
    )
  }
)
StepImage.displayName = "StepImage"

const MotionStepImage = motion(StepImage)

const AnimatedStepImage = ({
  preset = "fadeInScale",
  delay = 0,
  onAnimationComplete,
  ...props
}: AnimatedStepImageProps) => {
  const presetConfig = ANIMATION_PRESETS[preset]
  return (
    <MotionStepImage
      {...props}
      {...presetConfig}
      transition={{
        ...presetConfig.transition,
        delay,
      }}
      onAnimationComplete={onAnimationComplete}
    />
  )
}

function FeatureCard({
  bgClass,
  children,
  step,
  features,
}: CardProps & {
  children: React.ReactNode
  step: number
  features: readonly Step[]
}) {
  const [mounted, setMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const isMobile = useIsMobile()

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      className="animated-cards relative w-full rounded-[16px]"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": useMotionTemplate`${mouseX}px`,
          "--y": useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <div
        className={clsx(
          "group relative w-full overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-b from-emerald-900/90 to-green-800 transition duration-300 dark:from-emerald-950/90 dark:to-emerald-800/90",
          "md:hover:border-transparent",
          bgClass
        )}
      >
                <div className="px-8 py-16 min-h-[600px] w-full flex flex-col md:px-12 md:py-20">
          {/* Navigation badges en haut du contenu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <Steps current={step} onChange={() => {}} steps={features} />
          </motion.div>
          
          <div className="flex flex-col justify-between flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className="flex flex-col gap-4 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <motion.h2
                  className="text-2xl font-bold tracking-tight text-white md:text-3xl leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  {features[step]?.title}
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <p className="text-sm leading-relaxed text-neutral-300 dark:text-zinc-400">
                    <Balancer>{features[step]?.description}</Balancer>
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          
            {/* Container for the image */}
            <div className="flex-1 relative">
              {mounted ? children : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Steps({
  steps: stepData,
  current,
  onChange,
}: {
  steps: readonly Step[]
  current: number
  onChange: (index: number) => void
}) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4">
      <ol
        className="flex w-full flex-wrap items-start justify-start gap-2 sm:justify-center md:w-10/12 md:divide-y-0"
        role="list"
      >
        {stepData.map((step, stepIdx) => {
          const isCompleted = current > stepIdx
          const isCurrent = current === stepIdx
          const isFuture = !isCompleted && !isCurrent

          return (
            <motion.li
              key={`${step.name}-${stepIdx}`}
              initial="inactive"
              animate={isCurrent ? "active" : "inactive"}
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative z-50 rounded-full px-3 py-1 transition-all duration-300 ease-in-out md:flex",
                isCompleted ? "bg-green-500/20" : "bg-green-500/10"
              )}
            >
              <div
                className={cn(
                  "group flex w-full cursor-pointer items-center focus:outline-none focus-visible:ring-2",
                  (isFuture || isCurrent) && "pointer-events-none"
                )}
                onClick={() => onChange(stepIdx)}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <motion.span
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                    }}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full duration-300",
                      isCompleted &&
                        "bg-green-400 text-white dark:bg-green-400",
                      isCurrent &&
                        "bg-green-300/80 text-neutral-400 dark:bg-green-500/50",
                      isFuture && "bg-green-300/10 dark:bg-green-500/20"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <IconCheck className="h-3 w-3 stroke-white stroke-[3] text-white dark:stroke-black" />
                      </motion.div>
                    ) : (
                      <span
                        className={cn(
                          "text-xs",
                          !isCurrent && "text-green-200"
                        )}
                      >
                        {stepIdx + 1}
                      </span>
                    )}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={clsx(
                      "text-sm font-medium duration-300",
                      isCompleted && "text-muted-foreground",
                      isCurrent && "text-green-300 dark:text-green-400",
                      isFuture && "text-neutral-500"
                    )}
                  >
                    {step.name}
                  </motion.span>
                </span>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

const defaultClasses = {
  step1img1:
    "pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500 dark:border-stone-700/50 rounded-2xl",
  step1img2:
    "pointer-events-none w-[60%] border border-stone-100/10 dark:border-stone-700/50 transition-all duration-500 overflow-hidden rounded-2xl",
  step2img1:
    "pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500 dark:border-stone-700 rounded-2xl overflow-hidden",
  step2img2:
    "pointer-events-none w-[40%] border border-stone-100/10 dark:border-stone-700 transition-all duration-500 rounded-2xl overflow-hidden",
  step3img:
    "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-2xl transition-all duration-500 overflow-hidden",
  step4img:
    "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-2xl transition-all duration-500 overflow-hidden",
  step5img:
    "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-2xl transition-all duration-500 overflow-hidden",
  step6img:
    "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-2xl transition-all duration-500 overflow-hidden",
  step7img:
    "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-2xl transition-all duration-500 overflow-hidden",
} as const


export const Component = ({
  image,
  features,
  step1img1Class = defaultClasses.step1img1,
  step2img1Class = defaultClasses.step2img1,
  step3imgClass = defaultClasses.step3img,
  step4imgClass = defaultClasses.step4img,
  step5imgClass = defaultClasses.step5img,
  step6imgClass = defaultClasses.step6img,
  step7imgClass = defaultClasses.step7img,
  ...props
}: ComponentProps) => {
  const { currentNumber: step, increment } = useNumberCycler(features.length)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleIncrement = () => {
    if (isAnimating) return
    setIsAnimating(true)
    increment()
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  const renderStepContent = () => {
    const content = () => {
      switch (step) {
        case 0:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step1img1Class, "left-[5%] top-[30%] md:left-[68px] md:top-[30%]")}
              src={features[0]?.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&crop=center"}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          )
        case 1:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step2img1Class, "left-[5%] top-[30%] md:left-[68px] md:top-[30%]")}
              src={features[1]?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop&crop=center"}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          )
        case 2:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step3imgClass, "left-[5%] top-[30%] md:left-[68px] md:top-[30%]")}
              src={features[2]?.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop&crop=center"}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          )
        case 3:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step4imgClass, "left-[5%] top-[30%] md:left-[68px] md:top-[30%]")}
              src={features[3]?.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&crop=center"}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          )
        case 4:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step5imgClass, "left-[5%] top-[30%] md:left-[68px] md:top-[30%]")}
              src={features[4]?.image || "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=500&fit=crop&crop=center"}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          )
        case 5:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step6imgClass, "left-[5%] top-[30%] md:left-[68px] md:top-[30%]")}
              src={features[5]?.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop&crop=center"}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          )
        case 6:
          return (
            <AnimatedStepImage
              alt={image.alt}
              className={clsx(step7imgClass, "left-[5%] top-[30%] md:left-[68px] md:top-[30%]")}
              src={features[6]?.image || "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=800&h=500&fit=crop&crop=center"}
              preset="fadeInScale"
              onAnimationComplete={handleAnimationComplete}
            />
          )
        default:
          return null
      }
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          {...ANIMATION_PRESETS.fadeInScale}
          className="w-full h-full absolute"
        >
          {content()}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <FeatureCard {...props} step={step} features={features}>
      {renderStepContent()}
      
      <motion.div
        className="absolute right-0 top-0 z-40 h-full w-full cursor-pointer"
        onClick={handleIncrement}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      />
    </FeatureCard>
  )
}

Component.displayName = "Component" 