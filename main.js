const elem = document.getElementsByTagName('body')[0];
const params = { width: 300, height: 200 };
const two = new Two(params).appendTo(elem);

const circle = two.makeCircle(60, 100, 50);
circle.fill = '#ff6600';
circle.stroke = '#ffff00';
circle.linewidth = 5;

two.update();
