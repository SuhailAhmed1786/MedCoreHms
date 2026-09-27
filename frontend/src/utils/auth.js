export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);

    if (!user || typeof user !== "object") {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Invalid user data in localStorage");

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return null;
  }
};
