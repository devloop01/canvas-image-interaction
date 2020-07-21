import { returnImageData, loadImages, dist, returnPixelColor } from "./utils";
import Particles from "./particles";
import Particle from "./particle";

export default class Canvas {
	constructor(options = {}) {
		// the parent where the canvas will be appended
		this.parent = options.parent;

		// canvas dimensions
		this.dimensions = options.dimensions;

		// all imageURL's, images(optional) & imagesData that are required
		this.imageURL = options.imageURL || {};
		this.images = options.images || {};
		this.imagesData = options.imagesData || {
			default: null,
			hovered: null,
		};
		this.currentImageData = null;

		// Array where all the particles will be stored
		this.particles = null;
		this.totalParticles = options.totalParticles || 400;

		// boolean which changes to 'true' when hovered, oe else false
		this.hovered = false;

		// particles configs
		this.particlesConfig = options.particlesConfig;

		// mouse range and mouse particle instance
		this.mouseRange = options.mouseRange || null;
		this.mouse = null;

		// initialize the canvas
		this.init();
	}

	init() {
		// create the canvas element
		this.canvas = document.createElement("canvas");
		// get the canvas context
		this.ctx = this.canvas.getContext("2d");
		// set the canvas dimensions
		this.canvas.width = this.dimensions.width;
		this.canvas.height = this.dimensions.height;

		const initialize = () => {
			// this variable holds the current image data
			this.currentImageData = this.imagesData.default;

			// add many Particle instances
			this.addParticles(this.totalParticles);
			// start rendering the canvas
			this.startRender();
			// initialize all the canvas events
			this.initEvents();
			// append the canvas on the parent
			this.parent.appendChild(this.canvas);
		};

		// what happens here is if the user/dev provides the loaded image directly then use the images provided by the use directly
		// and if the user provides the URL for the image then load the images from the URL and initialize
		if (!this.images.hasOwnProperty("default") && !this.images.hasOwnProperty("hovered")) {
			// load all the images that are required and after all the images are loaded the callback is called.
			loadImages([this.imageURL.default, this.imageURL.hovered], (images) => {
				// set the image data so that they can be accessed later when needed
				this.imagesData.default = returnImageData(images[0], this.dimensions);
				this.imagesData.hovered = returnImageData(images[1], this.dimensions);
				initialize();
			});
		} else {
			// set the image data so that they can be accessed later when needed
			this.imagesData.default = returnImageData(this.images.default, this.dimensions);
			this.imagesData.hovered = returnImageData(this.images.hovered, this.dimensions);
			initialize();
		}

		// init mouse particle
		if (this.mouseRange != null) {
			this.mouse = new Particle({
				ctx: this.ctx,
				position: {
					x: 0,
					y: 0,
				},
				radius: this.mouseRange,
				color: "#000",
				avoisEdges: true,
				shape: "circle",
			});
		}
	}

	initEvents() {
		const onMouseEnter = () => {
			this.hovered = true;
			this.currentImageData = this.imagesData.hovered;
		};
		const onMouseLeave = () => {
			this.hovered = false;
			this.currentImageData = this.imagesData.default;
		};
		const onMouseMove = (e) => {
			if (this.mouse != null) {
				this.mouse.position.x = e.offsetX;
				this.mouse.position.y = e.offsetY;
			}
		};

		this.canvas.addEventListener("mouseenter", onMouseEnter);
		this.canvas.addEventListener("mouseleave", onMouseLeave);
		this.canvas.addEventListener("mousemove", onMouseMove);
	}

	addParticles(n) {
		this.particles = new Particles({
			ctx: this.ctx,
			totalParticles: n,
			maxBounds: { width: this.dimensions.width, height: this.dimensions.height },
			imageData: this.currentImageData,
			particlesConfig: this.particlesConfig,
		});
	}

	updateParticleColor(imageData, particle) {
		const color = returnPixelColor(imageData, Math.floor(this.dimensions.width), {
			x: Math.floor(particle.position.x),
			y: Math.floor(particle.position.y),
		});
		particle.updateColor(color);
	}

	startRender() {
		requestAnimationFrame(() => this.render());
	}

	render() {
		// this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);

		// loop through all the particles
		this.particles.particles.forEach((particle) => {
			if (this.mouseRange != null) {
				// if the mouse range is not null then calculate the dist between mouse particle & all the other particles
				const d = dist(this.mouse.position, particle.position);
				// if the dist between the particles is less than the summation of the radius of the mouse particle & the other particle, that means they are intersecting
				if (d < this.mouse.radius + particle.radius && this.hovered) {
					// update the color of the intersecting particle only if mouse is hovered
					this.updateParticleColor(this.imagesData.hovered, particle);
				}
				// else update every other particle too
				else this.updateParticleColor(this.imagesData.default, particle);
			}
			// if the mouserange is null then update all particles at once
			else this.updateParticleColor(this.currentImageData, particle);
		});

		this.particles.update();

		requestAnimationFrame(() => this.render());
	}
}
