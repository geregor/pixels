window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let pixelSize = 1;
    let canvasZoom = 1;
    let zoomLevel = 0;
    let offsetX = 0;
    let offsetY = 0;
    let isDraging = false;
    let dragX = [0,0];
    let dragY = [0,0];
    let canvasBorder = 2500;
    let isMouseOverCanvas = false;
    let isMouseMoving = false;
    let filledColor = 'black';
    var pixels = new Map();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    function drawPixel(x, y, color) {
        console.log('Draw Pixel function started!')
        ctx.fillStyle = filledColor;
        ctx.fillRect(x, y, pixelSize, pixelSize);
        pixels.set( [x,y],color )
        console.log('Draw Pixel function ended!')
    }
  
    function clearCanvas() {
        console.log('Clear Canvas function started!')
        ctx.clearRect(0, 0, canvas.width/canvasZoom, canvas.height/canvasZoom);
        console.log('Clear Canvas function ended!')

    }

    function createStrech() {
        console.log('Create Strech function started!')
        let lineSize = 0.05;
        let repeater = 1*canvasZoom;
        if (zoomLevel > 1) {
            for (let i = 0; i < canvas.width; i++) { // Y
                ctx.lineWidth = lineSize;
                ctx.beginPath();
                ctx.moveTo(offsetX+i*repeater, offsetY);
                ctx.lineTo(offsetX+i*repeater, offsetY+canvas.height*canvasZoom);
                ctx.stroke();
            }
    
            for (let i = 0; i < canvas.height; i++) { // X
                ctx.lineWidth = lineSize;
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY+i*repeater);
                ctx.lineTo(offsetX+canvas.width*canvasZoom, offsetY+i*repeater);
                ctx.stroke();
            }
        }
        console.log('Create Strech function ended!')
    }
  
    function handleMouseDown(event) {
        console.log('HandleMouseDown function started!')
        if (!isMouseOverCanvas) return;
        isDraging = true;
        dragX[0] = event.clientX;
        dragY[0] = event.clientY;
        console.log('HandleMouseDown function ended!')
    }

    function handleMouseMove(event) {
        console.log('HandleMouseMove function started!')
        if (!isDraging) return;
        isMouseMoving = true;
        offsetX = (event.clientX - dragX[0])/canvasZoom + dragX[1];
        offsetY = (event.clientY - dragY[0])/canvasZoom + dragY[1];

        document.getElementsByClassName("data")[0].children[0].innerText = 
        `CanvasWidth: ${canvas.width}\n
        CanvasHeight: ${canvas.height}\n
        OffsetX: ${offsetX}\n
        OffsetY: ${offsetY}\n
        CanvasZoom: ${canvasZoom}\n
        event: [${event.clientX},${event.clientY}]`

        if (offsetX > canvasBorder) {
            offsetX = canvasBorder; 
        }
        else if (offsetX < -canvasBorder) {
            offsetX = -canvasBorder; 
        }
        if (offsetY > canvasBorder) {
            offsetY = canvasBorder; 
        }
        else if (offsetY < -canvasBorder) {
            offsetY = -canvasBorder; 
        }
        clearCanvas();
        draw();
        console.log('HandleMouseMove function ended!')

    }

    function handleMouseUp(event) {
        console.log('HandleMouseUp function started!')
        console.log(!isMouseOverCanvas, isMouseMoving)
        if (!isMouseOverCanvas) return;
        let realClickX = Math.floor(event.clientX / Math.pow(canvasZoom,2) - offsetX/canvasZoom);
        let realClickY = Math.floor(event.clientY / Math.pow(canvasZoom,2) - offsetY/canvasZoom);
        console.log(Array.from(pixels.keys()))
        if (!isMouseMoving) {

            document.getElementsByClassName("data")[0].children[0].innerText = 
            `CanvasWidth: ${canvas.width}\n
            CanvasHeight: ${canvas.height}\n
            OffsetX: ${offsetX}\n
            OffsetY: ${offsetY}\n
            CanvasZoom: ${canvasZoom}
            event: [${event.clientX},${event.clientY}]\n
            realClick: [${realClickX},${realClickY}]`

            if (pixels.has([realClickX,realClickY])) {
                pixels.set([realClickX, realClickY],filledColor);
                draw();
            }
            else if (
                0 <= realClickX && realClickX <= canvas.width-pixelSize &&
                0 <= realClickY && realClickY <= canvas.height-pixelSize
             ) {
                drawPixel(
                    realClickX, 
                    realClickY,
                    filledColor );
                draw();
            }
        }
        dragX[1] = offsetX;
        dragY[1] = offsetY;
        isDraging = false;
        isMouseMoving = false;
        console.log('HandleMouseUp function ended!')
    }
    
    document.getElementById("plus_button").addEventListener("click", () => {
        if (zoomLevel < 1.8) {
            ctx.scale(1.2,1.2);
            canvasZoom /= 4/5;
            zoomLevel += 0.2
            clearCanvas();
            draw();
        }
    })

    document.getElementById("minus_button").addEventListener("click", () => {
        if (zoomLevel > -0.3) {
            ctx.scale(0.8,0.8);
            canvasZoom *= 0.8;
            zoomLevel -= 0.2
            clearCanvas();
            draw();
        }
    })

    document.getElementById("color_red").addEventListener("click", () => {
        filledColor = 'red';
    })

    document.getElementById("color_green").addEventListener("click", () => {
        filledColor = 'green';
    })

    function handleMouseWheel(event) {
        console.log('HandleMouseWheel function started!')
        if (!isMouseOverCanvas) return;
        const delta = Math.sign(event.deltaY); // Определяем направление вращения колеса мыши
        let lengthX = canvas.width/2 - offsetX;
        let lengthY = canvas.height/2 - offsetY;
        let scaleX = lengthX/(canvas.width*canvasZoom)
        let scaleY = lengthY/(canvas.height*canvasZoom)

        let rightBorderX = -canvas.width*canvasZoom, bottomBorderY = -canvas.height*canvasZoom
        
        
        if (delta > 0 && zoomLevel < 1.5) {
            ctx.scale(20/19,20/19);
            canvasZoom *= (20 / 19)
            zoomLevel += 0.05;
        } else if (delta < 0 && zoomLevel > -0.30) {
            ctx.scale(19/20,19/20);
            canvasZoom *= (19 / 20);
            zoomLevel -= 0.05;
        }
        let length2X = scaleX * (canvas.width * canvasZoom);
        let length2Y = scaleY * (canvas.height * canvasZoom);
        let rightBorder2X = -canvas.width*canvasZoom, bottomBorder2Y = -canvas.height*canvasZoom
        
        document.getElementsByClassName("data")[0].children[0].innerText = 
        `CanvasWidth: ${canvas.width}\n
        CanvasHeight: ${canvas.height}\n
        OffsetX: ${offsetX}\n
        OffsetY: ${offsetY}\n
        CanvasZoom: ${canvasZoom}\n
        moveChange: [${length2X - lengthX},${length2Y - lengthY}]\n`
        console.log(length2X - lengthX, length2Y - lengthY)
        if (canvasZoom <= 1) {
            offsetX -= length2X - lengthX;
            offsetY -= length2Y - lengthY;
        } else {
            offsetX -= length2X - lengthX;
            offsetY -= length2Y - lengthY;
        }
        
        dragX[1] = offsetX;
        dragY[1] = offsetY;
        clearCanvas();
        draw();
        event.preventDefault(); // Предотвращаем прокрутку 
        console.log('HandleMouseWheel function ended!')
    }
  
    function draw() {
        console.log('Draw function started!')
        ctx.fillStyle = 'wheat';
        ctx.fillRect(0, 0, canvas.width/canvasZoom, canvas.height/canvasZoom);

        ctx.fillStyle = 'white'
        ctx.fillRect(offsetX, offsetY, canvas.width*canvasZoom, canvas.height*canvasZoom);
    
        // Отрисовываем все установленные пиксели из массива
        // for (let i = 0; i < pixels.size; i++) {
        for (let [cords,color] of pixels.entries()) {
            // const pixel = pixels[i];
            ctx.fillStyle = color;
            ctx.fillRect(offsetX+(cords[0]*canvasZoom), offsetY+(cords[1]*canvasZoom), pixelSize*canvasZoom, pixelSize*canvasZoom);
        }
        createStrech();
        console.log('Draw function ended!')

    }

    function changeWindowSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup',handleMouseUp)
    canvas.addEventListener('mousemove',handleMouseMove)
    canvas.addEventListener('wheel', handleMouseWheel);
  
    canvas.addEventListener('mouseenter', () => {
      isMouseOverCanvas = true;
    });
  
    canvas.addEventListener('mouseleave', () => {
      isMouseOverCanvas = false;
    });

    window.addEventListener('orientationchange', changeWindowSize);
  
    clearCanvas();
    createStrech();
};  