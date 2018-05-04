const rectangles = [
    {width: 20, height: 40},
    {width: 15, height: 30},
    {width: 40, height: 80},
    {width: 12, height: 6},
    {width: 37, height: 9},
    {width: 51, height: 13},
    {width: 40, height: 75},
    {width: 26, height: 33},
];

const offsets = {start: 10, attraction: 20, normal: 1};

document.addEventListener(
    'DOMContentLoaded',
    () => rectangleOrganizer.init({canvasId: 'wrapper', rectangles, offsets})
);