export const formatDateTime = (d: Date) => {
  const date = new Date(d).toLocaleString().split(',')[0];
  const time = new Date(d).toLocaleString().split(',')[1].replace('AM', '').replace('PM', '');
  const formattedDate = {
    date: date,
    time: time
  };
  return formattedDate;
};