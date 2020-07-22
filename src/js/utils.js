export const randomIntegerFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const dist = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const splitArray = (array, n) => {
	let [...arr] = array;
	var res = [];
	while (arr.length) {
		res.push(arr.splice(0, n));
	}
	return res;
};

export const returnPixelColor = (imageData, width, position) => {
	const index = (position.x + position.y * width) * 4;
	let pixel = {
		r: imageData.data[index + 0],
		g: imageData.data[index + 1],
		b: imageData.data[index + 2],
	};
	return `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
};

export const toDataURL = (url) => {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			var reader = new FileReader();
			reader.onloadend = function () {
				resolve(reader.result);
			};
			reader.readAsDataURL(xhr.response);
		};
		xhr.onerror = reject;
		xhr.open("GET", url);
		xhr.responseType = "blob";
		xhr.send();
	});
};

export const returnImageData = (image, dimensions) => {
	const imageCanvas = document.createElement("canvas");
	const imageCanvasCtx = imageCanvas.getContext("2d");
	imageCanvas.width = dimensions.width;
	imageCanvas.height = dimensions.height;
	imageCanvasCtx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);
	return imageCanvasCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
};

export const loadImage = (imageURL, callback) => {
	toDataURL(imageURL).then((data) => {
		const IMAGE = new Image();
		IMAGE.src = data;
		IMAGE.onload = function () {
			callback(IMAGE);
		};
	});
};

export const loadImages = (imagesURLS, callback) => {
	const totalImageToLoad = imagesURLS.length;
	let curentImageIndex = 0;
	let imagesArray = [];

	const load = () => {
		loadImage(imagesURLS[curentImageIndex], (image) => {
			imagesArray.push(image);
			curentImageIndex++;
			if (curentImageIndex === totalImageToLoad) callback(imagesArray);
			else load();
		});
	};

	load();
};
