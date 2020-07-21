import { randomIntegerFromRange } from "./utils";

export default class Particle {
	constructor(options = {}) {
		this.ctx = options.ctx;

		this.position = options.position || {
			x: 0,
			y: 0,
		};
		this.maxVelocity = options.maxVelocity || 5;
		this.velocity = options.velocity || {
			x: (0.5 - Math.random()) * this.maxVelocity,
			y: (0.5 - Math.random()) * this.maxVelocity,
		};

		this.radius = options.radius;
		this.minRadius = this.radius;

		this.color = options.color;

		this.imageData = options.imageData;

		this.rotation = 0;
		this.rotationIncrement = randomIntegerFromRange(2, 5);

		this.stroke = false;
		this.fill = true;

		this.shape = options.shape || "circle";

		this.edges = options.edges || null;
		this.bounceFromEdges = options.bounceFromEdges;
		this.avoidEdges = options.avoidEdges || false;

		this.tick = 0;
		this.tickIncrement = 0.02 + Math.random() * 0.03;
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.translate(this.position.x, this.position.y);
		this.ctx.rotate((Math.PI / 180) * this.rotation);
		this.drawShape(this.shape);
		this.ctx.restore();
		this.ctx.closePath();
	}

	fillShape() {
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}

	strokeShape() {
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
	}

	drawShape(shape) {
		if (shape === "square") this.ctx.rect(-this.radius / 2, -this.radius / 2, this.radius, this.radius);
		else if (shape === "circle") this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
		else if (shape === "hexagon") {
			this.ctx.moveTo(this.radius * Math.cos(0), this.radius * Math.sin(0));
			for (let side = 0; side < 7; side++) {
				this.ctx.lineTo(
					this.radius * Math.cos((side * 2 * Math.PI) / 6),
					this.radius * Math.sin((side * 2 * Math.PI) / 6)
				);
			}
		}
	}

	update() {
		if (this.bounceFromEdges) this.changeVelocityOnBounce(this.edges);
		else this.continueFromEdge();

		this.rotation += this.rotationIncrement;
		this.tick += this.tickIncrement;
	}

	updatePosition() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}

	jumpToRandomPosition(bounds) {
		this.position.x = Math.random() * bounds.width;
		this.position.y = Math.random() * bounds.height;
	}

	growAndShrink(max) {
		this.radius = this.minRadius + Math.abs(Math.sin(this.tick)) * max;
	}

	updateColor(color) {
		this.color = color;
	}

	continueFromEdge() {
		if (!this.avoidEdges) {
			if (this.position.x > this.edges.width) this.position.x = 0;
			else if (this.position.x < 0) this.position.x = this.edges.width;
			if (this.position.y > this.edges.height) this.position.y = 0;
			else if (this.position.y < 0) this.position.y = this.edges.height;
		}
	}

	changeVelocityOnBounce() {
		if (!this.avoidEdges) {
			if (this.position.x + this.radius > this.edges.width || this.position.x - this.radius < 0)
				this.velocity.x *= -1;
			if (this.position.y + this.radius > this.edges.height || this.position.y - this.radius < 0)
				this.velocity.y *= -1;
		}
	}
}
