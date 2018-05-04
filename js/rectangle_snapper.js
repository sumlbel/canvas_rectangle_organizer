const rectangleSnapper = (function () {
    const rectMath = rectangleMath;

    let currentRect;
    let normalOffset;

    function stickCurrentRectToAttractedRect(currentRectangle, figures, {attractionOffset, normal}) {
        currentRect = currentRectangle;
        normalOffset = normal;

        let attractedRect = rectMath.getClosestToCurrentRectInDistance(figures, currentRect, attractionOffset);
        if (!attractedRect) {
            return;
        }

        let closestSide = rectMath.getClosestToCurrentRectSide(currentRect, attractedRect);
        if (!closestSide) {
            return;
        }

        let beforePosition = currentRect.position.clone();
        alignToClosestAttractedRectSide(attractedRect, closestSide);
        if (rectMath.isCurrentRectIntersected(currentRect, figures)) {
            currentRect.position = beforePosition;
        }
    }

    function alignToClosestAttractedRectSide(attractedRect, closestSide) {
        switch (closestSide) {
            case 'left':
                currentRect.position.x = attractedRect.position.x - normalOffset - currentRect.width;
                equalizeVerticallyTo(attractedRect);
                break;
            case 'right':
                currentRect.position.x = attractedRect.position.x + attractedRect.width + normalOffset;
                equalizeVerticallyTo(attractedRect);
                break;
            case 'top':
                currentRect.position.y = attractedRect.position.y - normalOffset - currentRect.height;
                equalizeHorizontallyTo(attractedRect);
                break;
            case 'bottom':
                currentRect.position.y = attractedRect.position.y + attractedRect.height + normalOffset;
                equalizeHorizontallyTo(attractedRect);
                break;
        }
    }

    function equalizeVerticallyTo(attractedRect) {
        let topDistance = rectMath.getAbsProjectionDistance(currentRect.position.y, attractedRect.position.y);

        let bottomDistance = rectMath.getAbsProjectionDistance(
            currentRect.position.y + currentRect.height,
            attractedRect.position.y + attractedRect.height
        );

        currentRect.position.y = topDistance <= bottomDistance ?
            attractedRect.position.y :
            attractedRect.position.y + attractedRect.height - currentRect.height;
    }

    function equalizeHorizontallyTo(attractedRect) {
        let leftDistance = rectMath.getAbsProjectionDistance(currentRect.position.x, attractedRect.position.x);

        let rightDistance = rectMath.getAbsProjectionDistance(
            currentRect.position.x + currentRect.width,
            attractedRect.position.x + attractedRect.width
        );

        currentRect.position.x = leftDistance <= rightDistance ?
            attractedRect.position.x :
            attractedRect.position.x + attractedRect.width - currentRect.width;
    }

    return {
        stickCurrentRectToAttractedRect
    };
}());

