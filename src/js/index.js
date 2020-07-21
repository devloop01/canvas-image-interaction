console.clear();

import gsap from "gsap";
import { loadImages, splitArray } from "./utils";
import Canvas from "./canvas";

import "../css/style.scss";

const cards = Array.from(document.querySelectorAll(".card"));

const cardOptions = [
	{
		imageURL: {
			default: require("../images/desert-dark.jpg"),
			hovered: require("../images/desert-bright.jpg"),
			// default: "https://source.unsplash.com/8xznAGy4HcY/400x600",
			// hovered: "https://source.unsplash.com/Xc6gtOwSMSA/400x600",
		},
		totalParticles: 1500,
		mouseRange: 80,
		particlesConfig: {
			jumpToRandomPosition: false,
			fill: true,
			randomRadius: true,
			minRadius: 1,
			maxRadius: 2,
		},
	},
	{
		imageURL: {
			default: require("../images/forest.jpg"),
			hovered: require("../images/forest-top.jpg"),
			// default: "https://source.unsplash.com/wQImoykAwGs/400x600",
			// hovered: "https://source.unsplash.com/QsWG0kjPQRY/400x600",
		},
		totalParticles: 1500,
		particlesConfig: {
			jumpToRandomPosition: true,
			fill: true,
			shape: "square",
			radius: 2,
		},
	},
	{
		imageURL: {
			default: require("../images/ocean-top.jpg"),
			hovered: require("../images/ocean.jpg"),
			// default: "https://source.unsplash.com/sLAk1guBG90/400x600",
			// hovered: "https://source.unsplash.com/xe-ss5Tg2mo/400x600",
		},
		totalParticles: 2500,
		particlesConfig: {
			jumpToRandomPosition: false,
			bounceFromEdges: false,
			fill: false,
			shape: "hexagon",
			radius: 1,
		},
	},
];

const imageURLS = cardOptions.map((option) => Object.values(option.imageURL)).flat();
// after all images are loaded remove loader
// (this is not the best way to do so but it gets the job done)
loadImages(imageURLS, (images) => {
	// this array holds the images in a sub array
	// i.e [img, img, img, img, img, img] ==> [[img, img], [img, img], [img, img]]
	const splitedImagesArray = splitArray(images, 2);

	cards.forEach((card, index) => {
		new Canvas({
			parent: card.querySelector(".card__image--inner"),
			dimensions: {
				width: card.getBoundingClientRect().width,
				height: card.getBoundingClientRect().height,
			},
			...cardOptions[index],
			images: {
				default: splitedImagesArray[index][0],
				hovered: splitedImagesArray[index][1],
			},
		});
	});

	// hide the loading wrapper
	document.querySelector(".loading__wrapper").classList.add("hide");

	// let the gsap animation begin
	gsap.timeline({
		delay: 0.8,
		defaults: {
			duration: 1.5,
			stagger: 0.1,
			ease: "expo.out",
		},
	})
		.fromTo(
			cards.map((card) => card.querySelector(".card__image")),
			{
				translateY: "-100%",
			},
			{
				translateY: "0%",
			}
		)
		.fromTo(
			cards.map((card) => card.querySelector(".card__image--inner")),
			{
				translateY: "100%",
			},
			{
				translateY: "0%",
			},
			0
		)
		.fromTo(
			cards.map((card) => card.querySelector(".card__text--inner")),
			{
				translateY: "100%",
			},
			{
				duration: 1.2,
				translateY: "0%",
			},
			0.4
		);
});
