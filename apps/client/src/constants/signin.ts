export const mathSymbols = [
		"π",
		"∑",
		"∫",
		"√",
		"∞",
		"≠",
		"≈",
		"±",
		"×",
		"÷",
		"α",
		"β",
		"θ",
		"Δ",
		"∂",
	];

export const floatingElements = Array.from({ length: 20 }, (_, i) => ({
		id: i,
		symbol: mathSymbols[i % mathSymbols.length],
		x: Math.random() * 100,
		y: Math.random() * 100,
		duration: 15 + Math.random() * 10,
		delay: Math.random() * 5,
		scale: 0.5 + Math.random() * 0.5,
	}));