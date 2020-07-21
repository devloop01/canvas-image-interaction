import { randomIntegerFromRange } from "./utils";
import Particle from "./particle";

export default class Particles {
	constructor(options = {}) {
		this.ctx = options.ctx; // canvas context
		this.totalParticles = options.totalParticles;
		this.maxBounds = options.maxBounds;
		this.imageData = options.imageData;

		// array that holds all the particles
		this.particles = [];

		// all the particles config
		this.particlesConfig = {
			jumpToRandomPosition: options.particlesConfig.hasOwnProperty("jumpToRandomPosition")
				? options.particlesConfig.jumpToRandomPosition
				: false,
			growAndShrink: options.particlesConfig.hasOwnProperty("growAndShrink")
				? options.particlesConfig.growAndShrink
				: false,
			fill: options.particlesConfig.hasOwnProperty("fill") ? options.particlesConfig.fill : true,
			bounceFromEdges: options.particlesConfig.hasOwnProperty("bounceFromEdges")
				? options.particlesConfig.bounceFromEdges
				: true,
			shape: options.particlesConfig.hasOwnProperty("shape") ? options.particlesConfig.shape : "circle",
			radius: options.particlesConfig.hasOwnProperty("radius") ? options.particlesConfig.radius : 5,
			randomRadius: options.particlesConfig.hasOwnProperty("randomRadius")
				? options.particlesConfig.randomRadius
				: false,
			maxRadius: options.particlesConfig.hasOwnProperty("maxRadius") ? options.particlesConfig.maxRadius : 5,
			minRadius: options.particlesConfig.hasOwnProperty("minRadius") ? options.particlesConfig.minRadius : 2,
			maxVelocity: options.particlesConfig.hasOwnProperty("maxVelocity")
				? options.particlesConfig.maxVelocity
				: 8,
		};

		this.init();
	}

	init() {
		const ctx = this.ctx;
		const color = "transparent";
		for (let i = 0; i < this.totalParticles; i++) {
			const radius = this.particlesConfig.randomRadius
				? randomIntegerFromRange(this.particlesConfig.minRadius, this.particlesConfig.maxRadius)
				: this.particlesConfig.radius;
			const position = {
				x: randomIntegerFromRange(radius, this.maxBounds.width - radius),
				y: randomIntegerFromRange(radius, this.maxBounds.height - radius),
			};
			this.particles.push(
				new Particle({
					ctx,
					position,
					radius,
					color,
					imageData: this.imageData,
					maxVelocity: 8,
					bounceFromEdges: this.particlesConfig.bounceFromEdges,
					shape: this.particlesConfig.shape,
					edges: { width: this.maxBounds.width, height: this.maxBounds.height },
				})
			);
		}
	}

	update() {
		// loop through particles, draw & update each particle
		this.particles.forEach((particle) => {
			particle.draw();
			if (this.particlesConfig.fill) particle.fillShape();
			else particle.strokeShape();

			particle.update();

			if (this.particlesConfig.growAndShrink) particle.growAndShrink(particle.minRadius * 0.65);

			if (!this.particlesConfig.jumpToRandomPosition) particle.updatePosition();
			else particle.jumpToRandomPosition({ width: this.maxBounds.width, height: this.maxBounds.height });
		});
	}
}
