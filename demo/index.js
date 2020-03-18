window.addEventListener('load', function() {
  Mydrag('.drag1', {
    initX: 50,
    initY: 50,
  });
  Mydrag('.drag2', {
    initX: 170,
    initY: 50,
    adsorb: false,
  });
  Mydrag('.drag3', {
    initX: 50,
    initY: 170,
    rate: 30,
  });
  Mydrag('.drag4', {
    initX: 170,
    initY: 170,
    gap: 50,
  });
});
