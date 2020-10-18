const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let points = [];

const margin = 100;
function getRandomPoints(amount)
{
	let ps = [];

	for (let i = 0; i < amount; ++i)
	{
		const left = Math.random() * (width - margin) + margin / 2;
		const top = Math.random() * (height - margin) + margin / 2;
		ps.push({left: left, top: top});
	}
	return ps;
}

function drawLineBetweenPoints(p1, p2)
{
	ctx.beginPath();
	ctx.moveTo(p1.left, p1.top);
	ctx.lineTo(p2.left, p2.top);
	ctx.stroke();
}

function generateNet()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < points.length; ++i)
	{
		for (let j = 0; j < points.length; ++j)
		{
			if (j != i)
			{
				drawLineBetweenPoints(points[i], points[j]);
			}
		}
	}
}

function getExpandedPoints(step)
{
	const rightmost = points.sort((a, b) =>
	{
		if (a.left > b.left)
			return 1;
		else
			return -1;
	})[0];

	const leftmost = points.sort((a, b) =>
	{
		if (a.left > b.left)
			return -1;
		else
			return 1;
	})[0];

	const topmost = points.sort((a, b) =>
	{
		if (a.top > b.top)
			return 1;
		else
			return -1;
	})[0];

	const bottommost = points.sort((a, b) =>
	{
		if (a.top > b.top)
			return 1;
		else
			return -1;
	})[0];

	const middlex = ((rightmost.left - leftmost.left) / 2) + leftmost.left;
	const middley = ((bottommost.top - topmost.top) / 2) + topmost.top;

	for (let pointIndex = 0; pointIndex < points.length; ++pointIndex)
	{
		const p = points[pointIndex];
		if (p.left > middlex)
			p.left += step;
		else
			p.left -= step;

		if (p.top > middley)
			p.top += step;
		else
			p.top -= step;
	}

	return points;
}

function getContractedPoints(step)
{
	const rightmost = points.sort((a, b) =>
	{
		if (a.left > b.left)
			return 1;
		else
			return -1;
	})[0];

	const leftmost = points.sort((a, b) =>
	{
		if (a.left > b.left)
			return -1;
		else
			return 1;
	})[0];

	const topmost = points.sort((a, b) =>
	{
		if (a.top > b.top)
			return 1;
		else
			return -1;
	})[0];

	const bottommost = points.sort((a, b) =>
	{
		if (a.top > b.top)
			return 1;
		else
			return -1;
	})[0];

	const middlex = ((rightmost.left - leftmost.left) / 2) + leftmost.left;
	const middley = ((bottommost.top - topmost.top) / 2) + topmost.top;

	for (let pointIndex = 0; pointIndex < points.length; ++pointIndex)
	{
		const p = points[pointIndex];
		if (p.left > middlex)
			p.left -= step;
		else
			p.left += step;

		if (p.top > middley)
			p.top -= step;
		else
			p.top += step;
	}

	return points;
}

function grow()
{
	points = getExpandedPoints();
	generateNet();
}

let isGrowing = true;
const duration = 1000;
let startTime;
function breathe(time)
{
	if (!startTime)
		startTime = time || performance.now();

	const deltaTime = (time - startTime) / duration;

	if (isGrowing)
		points = getExpandedPoints(.1);
	else
		points = getContractedPoints(.1);

	if (deltaTime >= 1) // ended animation
	{
		generateNet();
		startTime = null;
		isGrowing = !isGrowing;
		breathe(undefined);
	}
	else
	{
		generateNet();
		requestAnimationFrame(breathe);
	}
}

function draw()
{
	points = getRandomPoints(10);
	generateNet();
	breathe(undefined);
}

draw();
