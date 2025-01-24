export const isToday = (classDay) => {
  console.log('classDay', classDay);
  if (!classDay) return false;
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const classDays = classDay.split(',').map(Number);
  // 注意：需要将周日的0转换为7以匹配后端的格式
  const adjustedToday = today === 0 ? 7 : today;
  return classDays.includes(adjustedToday);
}; 