function brl(cents) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
function dataCurta(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Maceio"
  });
}
function dataHora(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Maceio"
  });
}
function dezena(n) {
  return String(n).padStart(2, "0");
}
export {
  dataHora as a,
  brl as b,
  dataCurta as c,
  dezena as d
};
