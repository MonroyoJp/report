// Initialize chessboard immediately on page load
window.chessBoard = Chessboard('board', {
    position: 'start'
});

// Hide board initially
document.getElementById('board').style.display = 'none';
