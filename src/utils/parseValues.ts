export const parseValues = (items: any) => {
  return items.map((item: any) => {
    return item.toString().trim().replace(/ /g, "");
  });
};
