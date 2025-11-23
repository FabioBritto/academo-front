export const formatDateTime = (d: Date | string) => {
  // Se for string, pode ser ISO do backend (ex: "2024-01-25T00:00:00.000Z")
  // Precisamos garantir que seja interpretada no timezone local
  let dateObj: Date;
  
  if (typeof d === 'string') {
    // Se a string contém apenas data (YYYY-MM-DD) ou data com hora
    // Criar Date no timezone local para evitar problemas de conversão UTC
    const dateStr = d.split('T')[0]; // Pega apenas a parte da data (YYYY-MM-DD)
    const [year, month, day] = dateStr.split('-').map(Number);
    
    // Se tiver hora na string original, pegar a hora também
    const timeMatch = d.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
      const [, hours, minutes, seconds] = timeMatch.map(Number);
      dateObj = new Date(year, month - 1, day, hours, minutes, seconds || 0);
    } else {
      dateObj = new Date(year, month - 1, day, 0, 0, 0, 0);
    }
  } else {
    dateObj = new Date(d);
  }
  
  const date = dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const time = dateObj.toLocaleTimeString('pt-BR', {
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