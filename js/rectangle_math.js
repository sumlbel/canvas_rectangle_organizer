const rectangleMath = (function () {
    function checkCurrentRectIntersection(currentRect, figures) {
        currentRect.intersected = false;

        for (let figure of figures) {
            if (figure.id !== currentRect.id) {
                figure.intersected = isRectsIntersected(figure, currentRect);
                currentRect.intersected = currentRect.intersected || figure.intersected;
            }
        }
    }

    function isCurrentRectIntersected(currentRect, figures) {
        checkCurrentRectIntersection(currentRect, figures);

        return currentRect.intersected;
    }

    function getDistanceBetweenSegments(beginA, lengthA, beginB, lengthB) {
        let endA = beginA + lengthA;
        let endB = beginB + lengthB;

        return beginA >= beginB ? beginA - endB : beginB - endA;
    }

    function isSegmentsIntersected(beginA, lengthA, beginB, lengthB) {
        let distance = getDistanceBetweenSegments(beginA, lengthA, beginB, lengthB);

        return distance <= 0;
    }

    /**
     * @param {Rectangle} rect1
     * @param {Rectangle} rect2
     *
     * @return {boolean}
     *
     * Return true if rectangles intersected
     * (both (x1, x2) and (y1, y2) segments intersected on some level)
     */
    function isRectsIntersected(rect1, rect2) {
        return isSegmentsIntersected(rect1.position.x, rect1.width, rect2.position.x, rect2.width)
            && isSegmentsIntersected(rect1.position.y, rect1.height, rect2.position.y, rect2.height);
    }

    function getClosestToCurrentRectInDistance(figures, currentRect, distance) {
        let closest = {'rectangle': null, 'distance': distance};

        for (let figure of figures) {
            if (figure.id !== currentRect.id) {
                let lengthX = getDistanceBetweenSegments(
                    figure.position.x,
                    figure.width,
                    currentRect.position.x,
                    currentRect.width
                );
                let lengthY = getDistanceBetweenSegments(
                    figure.position.y,
                    figure.height,
                    currentRect.position.y,
                    currentRect.height
                );
                if (lengthX <= 0 && lengthY <= 0) {
                    continue;
                }
                let length;
                if (lengthX > 0 && lengthY > 0) {
                    length = pythagorean(lengthX, lengthY);
                }
                else {
                    //since only one will be above zero by this point
                    length = lengthX < lengthY ? lengthY : lengthX;
                }
                if (length < closest.distance) {
                    closest.rectangle = figure;
                    closest.distance = length;
                }
            }
        }

        return closest.rectangle;
    }

    function pythagorean(a, b) {
        return Math.sqrt(a * a + b * b);
    }

    function getProjectionDistanceIfPositive(maxCoord, minCoord) {
        let distance = maxCoord - minCoord;

        return distance > 0 ? distance : Number.MAX_VALUE;
    }

    function getAbsProjectionDistance(coordA, coordB) {
        return Math.abs(coordA - coordB);
    }

    function isPointInRect(point, rect) {
        return (rect.position.x <= point.x)
            && (rect.position.x + rect.width >= point.x)
            && (rect.position.y <= point.y)
            && (rect.position.y + rect.height >= point.y);
    }

    function getClosestToCurrentRectSide(currentRect, attractedRect) {
        let distance = {'side': null, 'value': Number.MAX_VALUE};
        let sides = {
            'left': getProjectionDistanceIfPositive(attractedRect.position.x, currentRect.position.x + currentRect.width),
            'right': getProjectionDistanceIfPositive(currentRect.position.x, attractedRect.position.x + attractedRect.width),
            'top': getProjectionDistanceIfPositive(attractedRect.position.y, currentRect.position.y + currentRect.height),
            'bottom': getProjectionDistanceIfPositive(currentRect.position.y, attractedRect.position.y + attractedRect.height),
        };

        for (const [side, value] of Object.entries(sides)) {
            if (value <= distance.value) {
                distance.value = value;
                distance.side = side;
            }
        }

        return distance.side;
    }

    return {
        checkCurrentRectIntersection,
        isCurrentRectIntersected,
        getDistanceBetweenSegments,
        getClosestToCurrentRectSide,
        isPointInRect,
        getClosestToCurrentRectInDistance,
        getAbsProjectionDistance,
    };
}());

