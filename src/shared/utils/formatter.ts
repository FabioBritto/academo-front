export const formatDateTime = (d: Date) => {
  const date = new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const time = new Date(d).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const formattedDate = {
    date: date,
    time: time
  };
  return formattedDate;
};