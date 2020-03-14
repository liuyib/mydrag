var initDrag = function() {
  new Mydrag('#root');
};

window.addEventListener('DOMContentLoaded', initDrag);
window.addEventListener('resize', initDrag);
