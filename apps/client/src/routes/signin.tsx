import { createFileRoute, useRouter } from '@tanstack/react-router';
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from 'react';
import { floatingElements } from '../constants/signin';
import { authClient } from '../lib/auth-client';

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [_error, setError] = useState('')
  const [loading, setLoading] = useState(false)
	const [isHovered, setIsHovered] = useState(false);

  if (session) {
    router.navigate({ to: '/chat' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${import.meta.env.VITE_CLIENT_URL || 'http://localhost:5000'}/chat`,
      });
    } catch (err) {
      setError('Invalid email or password')
      console.error('Signin failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden flex items-center justify-center">
			{floatingElements.map((element) => (
				<motion.div
					key={element.id}
					className="absolute text-white/10 font-bold pointer-events-none select-none"
					style={{
						left: `${element.x}%`,
						top: `${element.y}%`,
						fontSize: `${element.scale * 3}rem`,
					}}
					animate={{
						y: [0, -30, 0],
						x: [0, 15, 0],
						rotate: [0, 10, -10, 0],
						opacity: [0.1, 0.2, 0.1],
					}}
					transition={{
						duration: element.duration,
						delay: element.delay,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					{element.symbol}
				</motion.div>
			))}

			<motion.div
				className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
				animate={{
					scale: [1.2, 1, 1.2],
					opacity: [0.5, 0.3, 0.5],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			<motion.div
				className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md w-full mx-4"
				initial={{ opacity: 0, y: 50, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{
					duration: 0.8,
					ease: [0.22, 1, 0.36, 1],
				}}
			>
				<motion.div
					className="flex justify-center mb-8"
					initial={{ scale: 0, rotate: -180 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{
						type: "spring",
						stiffness: 200,
						damping: 15,
						delay: 0.2,
					}}
				>
					<div className="relative">
						<motion.div
							className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-60"
							animate={{
								scale: [1, 1.2, 1],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
						<div className="relative w-20 h-20 bg-linear-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
							<span className="text-4xl font-bold text-white">∑</span>
						</div>
					</div>
				</motion.div>

				<motion.h1
					className="text-4xl font-bold text-white text-center mb-3"
					style={{ direction: "rtl" }}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.4,
						duration: 0.6,
					}}
				>
					ברוכים הבאים לנומרו
				</motion.h1>

				<motion.p
					className="text-white/70 text-center mb-8 text-lg"
					style={{ direction: "rtl" }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						delay: 0.6,
						duration: 0.6,
					}}
				>
					המורה הפרטי שלך למתמטיקה
				</motion.p>

				{/* Animated Divider */}
				<motion.div
					className="h-px bg-linear-to-r from-transparent via-white/30 to-transparent mb-8"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{
						delay: 0.8,
						duration: 0.8,
					}}
				/>

				<motion.button
					className="w-full relative overflow-hidden"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 1,
						duration: 0.6,
					}}
					onHoverStart={() => setIsHovered(true)}
					onHoverEnd={() => setIsHovered(false)}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSubmit}
					disabled={loading}
				>
					<motion.div
						className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl"
						animate={{
							backgroundPosition: isHovered ? ["0% 50%", "100% 50%"] : "0% 50%",
						}}
						transition={{
							duration: 0.5,
						}}
					/>

					<motion.div
						className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
						initial={{ x: "-100%" }}
						animate={{ x: isHovered ? "100%" : "-100%" }}
						transition={{
							duration: 0.6,
							ease: "easeInOut",
						}}
					/>

					<span className="relative block py-4 px-8 text-white font-semibold text-lg">
						{!loading ? (
							"התחברות למערכת"
						) : (
							<span className="flex gap-2 items-center">
								מתחבר... <Loader className="animate:spin" />
							</span>
						)}
					</span>
				</motion.button>
			</motion.div>

			<motion.div
				className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
				initial={{ y: 100 }}
				animate={{ y: 0 }}
				transition={{ delay: 1.2, duration: 0.8 }}
			>
				<svg
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
					className="w-full h-full"
				>
					<title>Decorative wave</title>
					<path
						d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
						fill="rgba(255,255,255,0.1)"
					/>
				</svg>
			</motion.div>
		</div>
  )
}
