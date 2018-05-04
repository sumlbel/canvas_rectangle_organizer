const rectangleOrganizer = (function () {
    const REDRAW_INTERVAL = 10;
    const rectMath = rectangleMath;

    let startOffset;
    let attractionOffset;
    let normalOffset;

    let canvas;
    let canvasWidth;
    let canvasHeight;
    let ctx;
    let redrawer = null;

    let figures = [];
    let currentRect = null;
    let originalPositionOfCurrentRect = null;
    let currentRectOffset = null;

    function* idGenerator() {
        let index = 1;
        while (index < index + 1) {
            yield index++;
        }
    }
    const rectId = idGenerator();

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        subtract(point) {
            this.x -= point.x;
            this.y -= point.y;

            return this;
        }

        clone() {
            return new Point(this.x, this.y);
        }
    }

    class Rectangle {
        constructor(width, height) {
            this.id = rectId.next().value;

            this.width = width;
            this.height = height;

            this.position = new Point(0, 0);

            this.intersected = false;
        }

        clone() {
            let clone = new Rectangle(this.width, this.height);

            return Object.assign(clone, this);
        }
    }

    function init({canvasId, rectangles, offsets}) {

        initOffsets(offsets);
        initRectangles(rectangles);

        initCanvas(canvasId);
        resetCanvas();

        window.onresize = resetCanvas;
    }

    function initOffsets({start, attraction, normal}) {
        startOffset = start;
        attractionOffset = attraction;
        normalOffset = normal;
    }

    function initRectangles(rectangles) {
        let lastY = startOffset;

        for (let {width, height} of rectangles) {
            let figure = new Rectangle(width, height);

            figure.position.x += startOffset;
            figure.position.y += lastY;

            figures.push(figure);

            lastY += figure.height + startOffset;
        }
    }

    function initCanvas(canvasId) {
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext('2d');
        canvas.onmousedown = onCursorDown;
        canvas.onmouseup = onCursorUp;
    }

    function resetCanvas() {
        canvasWidth = canvas.offsetWidth;
        canvasHeight = canvas.offsetHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        redrawRectangles();
    }

    function redrawRectangles() {
        clearCanvas();

        for (let figure of figures) {
            drawRectangle(figure);
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function drawRectangle(rect) {
        ctx.beginPath();

        ctx.fillStyle = rect.intersected ? "#FF0000" : "#000000";

        ctx.rect(rect.position.x, rect.position.y, rect.width, rect.height);
        ctx.fill();
    }

    function moveCurrentRectByEvent(e) {
        if (currentRect) {
            let newPosition = new Point(e.offsetX, e.offsetY);

            newPosition.subtract(currentRectOffset);
            currentRect.position = newPosition;

            rectangleSnapper.stickCurrentRectToAttractedRect(
                currentRect,
                figures,
                {attractionOffset, 'normal': normalOffset}
            );
            rectMath.checkCurrentRectIntersection(currentRect, figures);
        }
    }

    function initFocusedRect(e) {
        let clicked = new Point(e.offsetX, e.offsetY);
        for (let key in figures) {
            if (rectMath.isPointInRect(clicked, figures[key])) {
                originalPositionOfCurrentRect = figures[key].position;
                currentRectOffset = clicked.subtract(figures[key].position);
                currentRect = figures[key].clone();
                figures.splice(key, 1);
                figures.push(currentRect);
                break;
            }
        }
    }

    function onCursorDown(e) {
        initFocusedRect(e);

        if (currentRect) {
            moveCurrentRectByEvent(e);
            canvas.onmousemove = moveCurrentRectByEvent;
            redrawer = setInterval(redrawRectangles, REDRAW_INTERVAL);
        }
    }

    function onCursorUp() {
        if (currentRect && rectMath.isCurrentRectIntersected(currentRect, figures)) {
            currentRect.position = originalPositionOfCurrentRect;
            rectMath.checkCurrentRectIntersection(currentRect, figures);
        }
        clearInterval(redrawer);
        redrawRectangles();
        currentRect = null;
        currentRectOffset = null;
        originalPositionOfCurrentRect = null;
        canvas.onmousemove = null;
    }

    return {
        init
    };
}());
