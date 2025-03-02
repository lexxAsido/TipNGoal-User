const getInitials = (name) => {
  if (name) {
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 0) return "";
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  }
  return "";
};

export { getInitials };
