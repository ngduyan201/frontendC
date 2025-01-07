// Chặn F12 và các phím tắt DevTools
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 123) { // F12
        event.preventDefault();
        return false;
    }
    if(event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74)) { // Ctrl+Shift+I hoặc J
        event.preventDefault();
        return false;
    }
    if (event.ctrlKey && event.keyCode == 85) { // Ctrl+U
        event.preventDefault();
        return false;
    }
});

// Chặn chuột phải
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    return false;
});

// Phát hiện DevTools
function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if(widthThreshold || heightThreshold) {
        // Chuyển hướng về trang chủ
        window.location.href = '/homepage';
    }
}

// Kiểm tra định kỳ
setInterval(detectDevTools, 1000);
window.addEventListener('resize', detectDevTools);