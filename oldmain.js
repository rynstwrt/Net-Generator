const pointAmount = 100;
const transitionLength = 200;
const neighborCount = 7;
const wrapper = $('#container');

for (let i = 0; i < pointAmount; ++i)
{
	wrapper.append('<div class="point"></div>')
}

function getNearestNeighbors(point, children)
{
	point = $(point);
	const originalLeft = parseFloat(point.css('left'));
	const originalTop = parseFloat(point.css('top'));

	let nearPoints = {}; // distance: point format

	for (let i = 0; i < children.length; ++i)
	{
		const elem = $(children[i]);
		const left = parseFloat(elem.css('left'));
		const top = parseFloat(elem.css('top'));

		const diffX = left - originalLeft;
		const diffY = top - originalTop;
		const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

		if (distance == 0) continue;

		if (Object.keys(nearPoints).length < neighborCount)
		{
			nearPoints[distance.toString()] = elem;
		}
		else
		{
			for (let j = Object.keys(nearPoints).length - 1; j >= 0; --j)
			{
				const dist = Object.keys(nearPoints)[j];
				if (parseFloat(dist) > distance)
				{
					nearPoints[distance.toString()] = elem;
					delete nearPoints[dist];
					break;
				}
			}
		}
	}

	return nearPoints;
}

let lineCount = 0;
function drawLineTo(a, b)
{
	a = $(a);
	b = $(b);
	const fromLeft = parseFloat(a.css('left'));
	const fromTop = parseFloat(a.css('top'));
	const toLeft = parseFloat(b.css('left'));
	const toTop = parseFloat(b.css('top'));
	const diffX = Math.abs(fromLeft - toLeft);
	const diffY = Math.abs(fromTop - toTop);

	const hypot = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

	wrapper.append('<div class="line" id="' + lineCount + '"></div>');

	const line = $('#' + lineCount);
	line.css({'width': hypot + 'px'});

	line.css({'left': fromLeft + 'px'});
	line.css({'top': fromTop + 'px'});

	let theta = 0;
	if (fromLeft < toLeft)
	{
		if (fromTop < toTop)
		{
			// from is left and below to
			theta = (Math.atan(diffY / diffX) * (180 / Math.PI));
		}
		else
		{
			// from is left and above to
			theta = -(Math.atan(diffY / diffX) * (180 / Math.PI));
		}
	}
	else
	{
		if (fromTop < toTop)
		{
			// from is right and below to
			theta = 180 - (Math.atan(diffY / diffX) * (180 / Math.PI));
		}
		else
		{
			// from is right and above to
			theta = 180 + (Math.atan(diffY / diffX) * (180 / Math.PI));
		}
	}
	line.css({'transform': `rotate(${theta}deg)`});

	lineCount++;
}

function moveDots()
{
	let points = $('.point');
	for (let i = 0; i < points.length; ++i)
	{
		const left = Math.random() * 101;
		const top = Math.random() * 101;
		$(points[i]).css({'left': left + '%', 'top': top + '%'});
	}
}

function drawLines()
{
	let points = $('.point');
	for (let i = 0; i < points.length; ++i)
	{
		const point = $(points[i]);
		const nearestNeighbors = getNearestNeighbors(point, points);

		for (let neighborDist in nearestNeighbors)
		{
			const neighborPoint = $(nearestNeighbors[neighborDist]);
			drawLineTo(point, neighborPoint);
		}
	}
}


$(document).ready(() =>
{
	moveDots();
	drawLines();

	$('#reload-button').click(() =>
	{
		$('.line').remove();
		lineCount = 0;
		moveDots();
		drawLines();
	});
});
